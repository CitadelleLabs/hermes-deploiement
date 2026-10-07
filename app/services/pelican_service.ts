interface PullFileOptions {
  url: string
  directory: string
  filename?: string
}

export interface ServerInfo {
  name: string
  identifier: string
}

export interface PelicanFileObject {
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

export default class PelicanService {
  /**
   * Déploie un fichier depuis une URL vers un serveur Pelican
   */
  async pullFile(
    panelUrl: string,
    clientApiKey: string,
    serverId: string,
    options: PullFileOptions
  ): Promise<void> {
    const endpoint = `${panelUrl.replace(/\/+$/, '')}/api/client/servers/${serverId}/files/pull`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clientApiKey}`,
        'Accept': 'application/json',
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
      throw new Error(`Pelican API error (${response.status}): ${errorText}`)
    }
  }

  /**
   * Liste les fichiers d'un répertoire sur un serveur Pelican
   */
  async listFiles(
    panelUrl: string,
    clientApiKey: string,
    serverId: string,
    directory: string
  ): Promise<PelicanFileObject[]> {
    const encodedDir = encodeURIComponent(directory)
    const endpoint = `${panelUrl.replace(/\/+$/, '')}/api/client/servers/${serverId}/files/list?directory=${encodedDir}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clientApiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur listFiles:', errorText)
      throw new Error(`Pelican listFiles error (${response.status}): ${errorText}`)
    }

    const data = (await response.json()) as { data: PelicanFileObject[] }
    return data.data || []
  }

  /**
   * Supprime un ou plusieurs fichiers sur un serveur Pelican
   */
  async deleteFiles(
    panelUrl: string,
    clientApiKey: string,
    serverId: string,
    directory: string,
    files: string[]
  ): Promise<void> {
    const endpoint = `${panelUrl.replace(/\/+$/, '')}/api/client/servers/${serverId}/files/delete`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clientApiKey}`,
        'Accept': 'application/json',
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
      throw new Error(`Pelican deleteFiles error (${response.status}): ${errorText}`)
    }
  }

  /**
   * Déploie un plugin vers un serveur Pelican en supprimant l'ancienne version
   */
  async deployPlugin(
    panelUrl: string,
    clientApiKey: string,
    serverId: string,
    pluginUrl: string,
    pluginName: string,
    pluginId: string
  ): Promise<void> {
    try {
      const fileList = await this.listFiles(panelUrl, clientApiKey, serverId, '/plugins')

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
        await this.deleteFiles(panelUrl, clientApiKey, serverId, '/plugins', filesToDelete)
      }
    } catch (e) {
      console.error('Erreur lors du nettoyage des anciens plugins sur Pelican:', e)
    }

    await this.pullFile(panelUrl, clientApiKey, serverId, {
      url: pluginUrl,
      directory: '/plugins',
      filename: pluginName,
    })
  }

  async getServers(panelUrl: string, applicationApiKey: string): Promise<ServerInfo[]> {
    const endpoint = `${panelUrl.replace(/\/+$/, '')}/api/application/servers`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${applicationApiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Réponse erreur:', errorText)
      throw new Error(`Pelican API error (${response.status}): ${errorText}`)
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
