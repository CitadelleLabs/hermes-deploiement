import PelicanService, { type ServerInfo } from '#services/pelican_service'
import env from '#start/env'

export default class ServersService {
  private pelicanService: PelicanService

  constructor() {
    this.pelicanService = new PelicanService()
  }

  async getAllServers(): Promise<ServerInfo[]> {
    return await this.pelicanService.getServers(
      env.get('PELICAN_PANEL_URL'),
      env.get('PELICAN_APPLICATION_API_KEY')
    )
  }

  async getServerByIdentifier(identifier: string): Promise<ServerInfo | null> {
    const servers = await this.getAllServers()
    return servers.find((server) => server.identifier === identifier) || null
  }
}
