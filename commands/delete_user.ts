import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'

export default class DeleteUser extends BaseCommand {
  static commandName = 'user:delete'
  static description = 'Supprime un utilisateur'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Nom d\'utilisateur' })
  declare username: string

  async run() {
    try {
      const user = await User.findBy('username', this.username)

      if (!user) {
        this.logger.error(`Utilisateur "${this.username}" introuvable`)
        return
      }

      await user.delete()
      this.logger.success(`Utilisateur "${this.username}" supprimé avec succès`)
    } catch (error) {
      this.logger.error('Erreur lors de la suppression de l\'utilisateur')
      this.logger.error(error.message)
    }
  }
}
