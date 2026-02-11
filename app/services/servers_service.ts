import PterodactylService, { type ServerInfo } from '#services/pterodactyl_service'
import env from '#start/env'

export default class ServersService {
  private pterodactylService: PterodactylService

  constructor() {
    this.pterodactylService = new PterodactylService()
  }

  async getAllServers(): Promise<ServerInfo[]> {
    return await this.pterodactylService.getServers(
      env.get('PTERODACTYL_PANEL_URL'),
      env.get('PTERODACTYL_API_KEY')
    )
  }

  async getServerByIdentifier(identifier: string): Promise<ServerInfo | null> {
    const servers = await this.getAllServers()
    return servers.find((server) => server.identifier === identifier) || null
  }
}
