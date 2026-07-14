import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PluginsService from '#services/plugins_service'
import PluginAutoUpdate from '#models/plugin_auto_update'

@inject()
export default class PluginsController {
  constructor(private pluginsService: PluginsService) { }

  async home({ inertia }: HttpContext) {
    return inertia.render('home')
  }

  async show({ params, inertia, response }: HttpContext) {
    const id = params.id
    const pluginsByCategory = await this.pluginsService.getPlugins()

    let foundPlugin = null
    for (const profiles of Object.values(pluginsByCategory)) {
      const match = profiles.find((p) => p.id === id)
      if (match) {
        foundPlugin = match
        break
      }
    }

    if (!foundPlugin) {
      return response.notFound({ error: 'Plugin non trouvé' })
    }

    const autoUpdate = await PluginAutoUpdate.findBy('pluginId', id)
    const isAutoUpdateEnabled = autoUpdate ? autoUpdate.isEnabled : false

    return inertia.render('plugins/show', {
      plugin: foundPlugin,
      isAutoUpdateEnabled,
    })
  }

  async toggleAutoUpdate({ request, response, params }: HttpContext) {
    const id = params.id
    const { isEnabled } = request.only(['isEnabled'])

    const autoUpdate = await PluginAutoUpdate.firstOrCreate(
      { pluginId: id },
      { pluginId: id, isEnabled: false }
    )
    autoUpdate.isEnabled = isEnabled
    await autoUpdate.save()

    return response.redirect().back()
  }
}

