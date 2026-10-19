import type { PluginProfile, PluginsByCategory } from '#services/plugins_service'
import type { ServerInfo } from '#services/pterodactyl_service'

declare module '@adonisjs/inertia/types' {
  interface InertiaPages {
    'auth/login': {}
    home: {}
    'errors/not_found': {}
    'errors/server_error': { error: { message: string } }
    'plugins/show': { plugin: PluginProfile; isAutoUpdateEnabled: boolean }
    'servers/index': {}
  }

  interface SharedProps {
    errors: Record<string, string> | Record<string, Record<string, string>>
    user: { id: number; username: string } | null
    plugins: PluginsByCategory
    servers: ServerInfo[]
  }
}
