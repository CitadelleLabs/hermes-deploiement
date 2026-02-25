import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'
import app from '@adonisjs/core/services/app'
import PluginsService from '#services/plugins_service'
import ServersService from '#services/servers_service'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => ctx.auth?.user,
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    plugins: async () => {
      try {
        const pluginsService = await app.container.make(PluginsService)
        return await pluginsService.getPlugins()
      } catch (error) {
        console.error('Erreur lors du chargement des plugins:', error)
        return {}
      }
    },
    servers: async () => {
      try {
        const serversService = await app.container.make(ServersService)
        return await serversService.getAllServers()
      } catch (error) {
        console.error('Erreur lors du chargement des serveurs:', error)
        return []
      }
    },
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
