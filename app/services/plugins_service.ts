import drive from '@adonisjs/drive/services/main'
import PluginAutoUpdate from '#models/plugin_auto_update'

export interface PluginVersion {
  fileName: string
  path: string
  version: string
  commit: string
  size: number
  lastModified: string
  url: string
}

export interface PluginProfile {
  id: string
  name: string
  category: string
  versions: PluginVersion[]
  latestVersion: PluginVersion
  isAutoUpdateEnabled: boolean
}

export interface PluginsByCategory {
  [category: string]: PluginProfile[]
}

export function parsePluginFilename(filename: string): { id: string; version: string; commit: string } {
  const match = filename.match(/^(.*?)-(\d+(?:\.\d+)*)(?:-(.*))?\.jar$/)
  if (match) {
    return {
      id: match[1],
      version: match[2],
      commit: match[3] || 'unknown',
    }
  }

  const baseName = filename.endsWith('.jar') ? filename.substring(0, filename.length - 4) : filename
  return {
    id: baseName,
    version: 'unknown',
    commit: 'unknown',
  }
}

export default class PluginsService {
  async getPlugins(): Promise<PluginsByCategory> {
    const disk = drive.use('r2')
    const autoUpdates = await PluginAutoUpdate.query()
    const autoUpdateMap = new Map(autoUpdates.map((au) => [au.pluginId, au.isEnabled]))

    const files = await disk.listAll('', { recursive: true })

    const allObjects = [...files.objects]

    const jarFiles: { key: string; name: string; category: string }[] = []
    for (const item of allObjects) {
      if (item.isFile && item.name.endsWith('.jar')) {
        const key = (item as any).key as string
        const pathParts = key.split('/')
        const category = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : 'root'
        jarFiles.push({ key, name: item.name, category })
      }
    }

    const tempGroup: {
      [category: string]: {
        [pluginId: string]: PluginVersion[]
      }
    } = {}

    await Promise.all(
      jarFiles.map(async (file) => {
        const metadata = await disk.getMetaData(file.key)
        const url = await disk.getUrl(file.key)

        const parsed = parsePluginFilename(file.name)
        const versionInfo: PluginVersion = {
          fileName: file.name,
          path: file.key,
          version: parsed.version,
          commit: parsed.commit,
          size: metadata.contentLength || 0,
          lastModified: metadata.lastModified?.toISOString() || '',
          url,
        }

        if (!tempGroup[file.category]) {
          tempGroup[file.category] = {}
        }
        if (!tempGroup[file.category][parsed.id]) {
          tempGroup[file.category][parsed.id] = []
        }
        tempGroup[file.category][parsed.id].push(versionInfo)
      })
    )

    const pluginsByCategory: PluginsByCategory = {}

    for (const [category, profilesMap] of Object.entries(tempGroup)) {
      pluginsByCategory[category] = []

      for (const [pluginId, versions] of Object.entries(profilesMap)) {
        versions.sort(
          (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        )

        const latestVersion = versions[0]
        const name = pluginId.replace(/-/g, ' ')

        pluginsByCategory[category].push({
          id: pluginId,
          name,
          category,
          versions,
          latestVersion,
          isAutoUpdateEnabled: autoUpdateMap.get(pluginId) || false,
        })
      }
    }

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

