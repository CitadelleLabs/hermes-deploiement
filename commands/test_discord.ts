import { BaseCommand } from '@adonisjs/core/ace'
import DiscordService from '#services/discord_service'

export default class TestDiscord extends BaseCommand {
    static commandName = 'test:discord'
    static description = 'Envoie un message via le webhook Discord pour tester'

    static options = {
        startApp: true,
    }

    async run() {
        try {
            this.logger.info("Envoi d'un message Discord de test...")
            await DiscordService.sendDeploymentNotification({
                serverName: 'Serveur-Test-Hermes',
                pluginName: 'Citadelle-Redis-1.0.0.jar',
                isAutoUpdate: false,
            })
            this.logger.success('Message Discord de test envoyé (Manuel)')

            await DiscordService.sendDeploymentNotification({
                serverName: 'Serveur-Test-Hermes',
                pluginName: 'Citadelle-Redis-1.0.1.jar',
                isAutoUpdate: true,
            })
            this.logger.success('Message Discord de test envoyé (Auto-Update)')
        } catch (error) {
            this.logger.error("Erreur lors de l'envoi du message de test")
            this.logger.error(error.message)
        }
    }
}
