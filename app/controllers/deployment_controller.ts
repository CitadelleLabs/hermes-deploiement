import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PterodactylService from '#services/pterodactyl_service'
import PluginsService from '#services/plugins_service'
import ServersService from '#services/servers_service'
import env from '#start/env'

@inject()
export default class DeploymentController {
  constructor(
    private pterodactylService: PterodactylService,
    private pluginsService: PluginsService,
    private serversService: ServersService
  ) {}

  async deployPlugin({ request, response, params }: HttpContext) {
    try {
      const { pluginPath } = request.only(['pluginPath'])
      const serverId = params.id

      const server = await this.serversService.getServerById(serverId)
      if (!server) {
        return response.notFound({ error: 'Serveur non trouvé' })
      }

      const panelUrl = env.get('PTERODACTYL_PANEL_URL')
      const apiKey = env.get('PTERODACTYL_API_KEY')

      const signedUrl = await this.pluginsService.getSignedUrl(pluginPath)

      const pluginName = pluginPath.split('/').pop() || 'plugin.jar'

      await this.pterodactylService.deployPlugin(
        panelUrl,
        apiKey,
        server.serverId,
        signedUrl,
        pluginName
      )

      return response.redirect('/')
    } catch (error) {
      return response.redirect('/')
    }
  }
}
