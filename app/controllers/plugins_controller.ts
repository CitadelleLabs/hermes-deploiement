import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PluginsController {

  async home({ inertia }: HttpContext) {
    return inertia.render('home')
  }
}