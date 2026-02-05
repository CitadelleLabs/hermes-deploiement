import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServersService from '#services/servers_service'

@inject()
export default class ServersController {
  constructor(private serversService: ServersService) {}

  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const serversPage = await this.serversService.getPaginatedServers(page, 10)
    return inertia.render('servers/index', { 
      servers: serversPage.all(),
      pagination: serversPage.getMeta()
    })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'serverId'])
    
    try {
      await this.serversService.createServer(data)
      return response.redirect('/servers')
    } catch (error) {
      return response.badRequest({
        error: 'Erreur lors de la création du serveur',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      await this.serversService.deleteServer(params.id)
      return response.redirect('/servers')
    } catch (error) {
      return response.badRequest({
        error: 'Erreur lors de la suppression du serveur',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
