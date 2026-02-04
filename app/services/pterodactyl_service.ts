interface PullFileOptions {
  url: string
  directory: string
  filename?: string
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
        Authorization: `Bearer ${apiKey}`,
        Accept: 'Application/vnd.pterodactyl.v1+json',
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
      throw new Error(
        `Pterodactyl API error (${response.status}): ${errorText}`
      )
    }
  }

  /**
   * Déploie un plugin vers un serveur Pterodactyl
   */
  async deployPlugin(
    panelUrl: string,
    apiKey: string,
    serverId: string,
    pluginUrl: string,
    pluginName: string
  ): Promise<void> {
    await this.pullFile(panelUrl, apiKey, serverId, {
      url: pluginUrl,
      directory: '/plugins',
      filename: pluginName,
    })
  }
}
