import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async showLogin({ inertia, auth, response }: HttpContext) {
    if (await auth.check()) {
      return response.redirect('/')
    }

    return inertia.render('auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    try {
      const user = await User.verifyCredentials(username, password)
      await auth.use('web').login(user)

      return response.redirect('/')
    } catch {
      session.flash('errors', {
        username: "Nom d'utilisateur ou mot de passe incorrect",
      })
      return response.redirect().back()
    }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }
}
