interface PullFileOptions {
  url: string
  directory: string
  filename?: string
}

export interface ServerInfo {
  name: string
  identifier: string
}

export interface PterodactylFileObject {
  attributes: {
    name: string
    mode: string
    size: number
    is_file: boolean
    is_symlink: boolean
    mimetype: string
    created_at: string
    modified_at: string
  }
}

export default class PterodactylService {
  /**
   * Déploie un fichier depuis une URL vers un serveur Pterodactyl
   */
  async pullFile(
    panelUrl: string,
    apiKey: string,
    serverId: string,
    options: PullFileOptions
  ): Promise<void> {
    const endpoint = `${panelUrl}/api/client/servers/${serverId}/files/pull`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: options.url,
        directory: options.directory,
        filename: options.filename,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur:', errorText)
      throw new Error(`Pterodactyl API error (${response.status}): ${errorText}`)
    }
  }

  /**
   * Liste les fichiers d'un répertoire sur un serveur Pterodactyl
   */
  async listFiles(
    panelUrl: string,
    apiKey: string,
    serverId: string,
    directory: string
  ): Promise<PterodactylFileObject[]> {
    const encodedDir = encodeURIComponent(directory)
    const endpoint = `${panelUrl}/api/client/servers/${serverId}/files/list?directory=${encodedDir}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur listFiles:', errorText)
      throw new Error(`Pterodactyl listFiles error (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as { data: PterodactylFileObject[] }
    return data.data || []
  }

  /**
   * Supprime un ou plusieurs fichiers sur un serveur Pterodactyl
   */
  async deleteFiles(
    panelUrl: string,
    apiKey: string,
    serverId: string,
    directory: string,
    files: string[]
  ): Promise<void> {
    const endpoint = `${panelUrl}/api/client/servers/${serverId}/files/delete`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        root: directory,
        files,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur deleteFiles:', errorText)
      throw new Error(`Pterodactyl deleteFiles error (${response.status}): ${errorText}`)
    }
  }

  /**
   * Déploie un plugin vers un serveur Pterodactyl en supprimant l'ancienne version
   */
  async deployPlugin(
    panelUrl: string,
    apiKey: string,
    serverId: string,
    pluginUrl: string,
    pluginName: string,
    pluginId: string
  ): Promise<void> {
    try {
      const fileList = await this.listFiles(panelUrl, apiKey, serverId, '/plugins')

      const escapedId = pluginId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regexNewFormat = new RegExp(`^${escapedId}-\\d+(?:\\.\\d+)*-.*\\.jar$`)
      const legacyFormat = `${pluginId}.jar`

      const filesToDelete = fileList
        .filter((file) => {
          const name = file.attributes.name
          return (
            file.attributes.is_file &&
            name !== pluginName &&
            (regexNewFormat.test(name) || name === legacyFormat)
          )
        })
        .map((file) => file.attributes.name)

      if (filesToDelete.length > 0) {
        await this.deleteFiles(panelUrl, apiKey, serverId, '/plugins', filesToDelete)
      }
    } catch (e) {
      console.error('Erreur lors du nettoyage des anciens plugins sur Pterodactyl:', e)
    }

    await this.pullFile(panelUrl, apiKey, serverId, {
      url: pluginUrl,
      directory: '/plugins',
      filename: pluginName,
    })
  }

  async getServers(panelUrl: string, apiKey: string): Promise<ServerInfo[]> {
    const endpoint = `${panelUrl}/api/application/servers`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur:', errorText)
      throw new Error(`Pterodactyl API error (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as {
      data: Array<{ attributes: { name: string; identifier: string } }>
    }

    return data.data.map((server) => ({
      name: server.attributes.name,
      identifier: server.attributes.identifier,
    }))
  }
}

