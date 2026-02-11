import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import ServersService from '#services/servers_service'

@inject()
export default class ServersController {
  constructor(private serversService: ServersService) {}

  async index({ inertia }: HttpContext) {
    const servers = await this.serversService.getAllServers()
    return inertia.render('servers/index', { servers })
  }
}
