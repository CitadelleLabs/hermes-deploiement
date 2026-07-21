import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

export default class DiscordService {
    static async sendDeploymentNotification(options: {
        serverName: string
        pluginName: string
        isAutoUpdate: boolean
    }) {
        const webhookUrl = env.get('DISCORD_WEBHOOK_URL')
        if (!webhookUrl) {
            logger.debug('[DiscordWebhook] Skip because DISCORD_WEBHOOK_URL is not set.')
            return
        }

        const typeLabel = options.isAutoUpdate ? 'Auto-Update' : 'Manuel'

        const discordPayload = [
            {
                type: 17,
                accent_color: null,
                spoiler: false,
                components: [
                    {
                        type: 10,
                        content: '## Nouveau déploiement Hermes'
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                    {
                        type: 10,
                        content: `**Plugin :** \`${options.pluginName}\`\n**Serveur :** \`${options.serverName}\`\n**Type :** \`${typeLabel}\``
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1
                    },
                    {
                        type: 10,
                        content: `-# Déployé sur ${env.get('PTERODACTYL_PANEL_URL')}`
                    }
                ]
            }
        ]

        const url = webhookUrl.includes('?')
            ? `${webhookUrl}&with_components=true`
            : `${webhookUrl}?with_components=true`

        const body = {
            username: 'Hermes',
            flags: 32768,
            components: discordPayload
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error(`Discord returned code ${response.status}: ${await response.text()}`)
            }
        } catch (error) {
            logger.error({ err: error }, '[DiscordWebhook] Failed to send Discord notification')
        }
    }
}
