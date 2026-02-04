import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class CreateUser extends BaseCommand {
  static commandName = 'user:create'
  static description = 'Crée un nouvel utilisateur'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Nom d\'utilisateur' })
  declare username: string

  @args.string({ description: 'Mot de passe de l\'utilisateur' })
  declare password: string

  async run() {
    try {
      const user = await User.create({
        username: this.username,
        password: this.password,
      })

      this.logger.success(`Utilisateur créé avec succès : ${user.username}`)
    } catch (error) {
      this.logger.error('Erreur lors de la création de l\'utilisateur')
      this.logger.error(error.message)
    }
  }
}
