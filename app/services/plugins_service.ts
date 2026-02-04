import drive from '@adonisjs/drive/services/main'

interface PluginInfo {
  name: string
  path: string
  size: number
  lastModified: string
  url: string
}

interface PluginsByCategory {
  [category: string]: PluginInfo[]
}

export default class PluginsService {
  async getPlugins(): Promise<PluginsByCategory> {
    const disk = drive.use('r2')
    
    const files = await disk.listAll('', { recursive: true })
    
    const allObjects = [...files.objects]

    const jarFiles: { key: string; name: string; category: string }[] = []
    for (const item of allObjects) {
      if (item.isFile && item.name.endsWith('.jar')) {
        const key = (item as any).key as string
        const pathParts = key.split('/')
        const category = pathParts.length > 1 
          ? pathParts.slice(0, -1).join('/') 
          : 'root'
        jarFiles.push({ key, name: item.name, category })
      }
    }

    const pluginsByCategory: PluginsByCategory = {}
    
    await Promise.all(
      jarFiles.map(async (file) => {
        const metadata = await disk.getMetaData(file.key)
        const url = await disk.getUrl(file.key)
        
        const pluginInfo: PluginInfo = {
          name: file.name,
          path: file.key,
          size: metadata.contentLength || 0,
          lastModified: metadata.lastModified?.toISOString() || '',
          url,
        }
        
        if (!pluginsByCategory[file.category]) {
          pluginsByCategory[file.category] = []
        }
        pluginsByCategory[file.category].push(pluginInfo)
      })
    )

    return pluginsByCategory
  }

  /**
   * Génère une URL signée pour un plugin spécifique
   * @param pluginPath - Chemin du plugin dans le bucket (ex: "category/plugin.jar")
   * @returns URL signée temporaire
   */
  async getSignedUrl(pluginPath: string): Promise<string> {
    const disk = drive.use('r2')
    const signedUrl = await disk.getSignedUrl(pluginPath, { expiresIn: '15m' })
    return signedUrl
  }
}
