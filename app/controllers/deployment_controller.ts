import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PelicanService from '#services/pelican_service'
import PluginsService, { parsePluginFilename } from '#services/plugins_service'
import ServersService from '#services/servers_service'
import DiscordService from '#services/discord_service'
import env from '#start/env'

@inject()
export default class DeploymentController {
  constructor(
    private pelicanService: PelicanService,
    private pluginsService: PluginsService,
    private serversService: ServersService
  ) { }

  async deployPlugin({ request, response, params }: HttpContext) {
    try {
      const { pluginPath } = request.only(['pluginPath'])
      const identifier = params.identifier

      const server = await this.serversService.getServerByIdentifier(identifier)
      if (!server) {
        return response.notFound({ error: 'Serveur non trouvé' })
      }

      const panelUrl = env.get('PELICAN_PANEL_URL')
      const clientApiKey = env.get('PELICAN_CLIENT_API_KEY')

      const signedUrl = await this.pluginsService.getSignedUrl(pluginPath)

      const pluginName = pluginPath.split('/').pop() || 'plugin.jar'
      const parsed = parsePluginFilename(pluginName)
      const pluginId = parsed.id

      await this.pelicanService.deployPlugin(
        panelUrl,
        clientApiKey,
        server.identifier,
        signedUrl,
        pluginName,
        pluginId
      )

      await DiscordService.sendDeploymentNotification({
        serverName: server.name,
        pluginName: pluginName,
        isAutoUpdate: false,
      })

      return response.redirect().back()
    } catch (error) {
      return response.redirect().back()
    }
  }
}

