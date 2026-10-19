import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import app from '@adonisjs/core/services/app'
import PluginsService from '#services/plugins_service'
import ServersService from '#services/servers_service'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(ctx: HttpContext) {
    const partialContext = ctx as Partial<HttpContext>

    let plugins: Awaited<ReturnType<PluginsService['getPlugins']>> = {}
    let servers: Awaited<ReturnType<ServersService['getAllServers']>> = []

    try {
      const pluginsService = await app.container.make(PluginsService)
      plugins = await pluginsService.getPlugins()
    } catch (error) {
      console.error('Erreur lors du chargement des plugins:', error)
    }

    try {
      const serversService = await app.container.make(ServersService)
      servers = await serversService.getAllServers()
    } catch (error) {
      console.error('Erreur lors du chargement des serveurs:', error)
    }

    return {
      errors: ctx.inertia.always(this.getValidationErrors(ctx)),
      user: ctx.inertia.always(
        partialContext.auth?.user
          ? { id: partialContext.auth.user.id, username: partialContext.auth.user.username }
          : null
      ),
      plugins,
      servers,
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)
    const output = await next()
    this.dispose(ctx)
    return output
  }
}

