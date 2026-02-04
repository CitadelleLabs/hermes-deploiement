import Server from '#models/server'

export default class ServersService {
  async getAllServers(): Promise<Server[]> {
    return await Server.all()
  }

  async createServer(data: { name: string; serverId: string }): Promise<Server> {
    const server = await Server.create({
      name: data.name,
      serverId: data.serverId,
    })
    return server
  }

  async getServerById(id: number): Promise<Server | null> {
    return await Server.find(id)
  }

  async deleteServer(id: number): Promise<void> {
    const server = await Server.find(id)
    if (server) {
      await server.delete()
    }
  }
}
