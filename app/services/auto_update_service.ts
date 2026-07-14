import PterodactylService from '#services/pterodactyl_service'
import PluginsService from '#services/plugins_service'
import ServersService from '#services/servers_service'
import PluginAutoUpdate from '#models/plugin_auto_update'
import env from '#start/env'

export default class AutoUpdateService {
    private pterodactylService = new PterodactylService()
    private pluginsService = new PluginsService()
    private serversService = new ServersService()

    async run() {
        try {
            const activeAutoUpdates = await PluginAutoUpdate.query().where('isEnabled', true)
            if (activeAutoUpdates.length === 0) {
                return
            }
            const pluginsByCategory = await this.pluginsService.getPlugins()

            const R2ProfilesMap = new Map<string, any>()
            for (const profiles of Object.values(pluginsByCategory)) {
                for (const profile of profiles) {
                    R2ProfilesMap.set(profile.id, profile)
                }
            }

            const servers = await this.serversService.getAllServers()
            const panelUrl = env.get('PTERODACTYL_PANEL_URL')
            const apiKey = env.get('PTERODACTYL_API_KEY')

            for (const autoUpdate of activeAutoUpdates) {
                const pluginId = autoUpdate.pluginId
                const activeProfile = R2ProfilesMap.get(pluginId)
                if (!activeProfile) {
                    continue
                }

                const latestVersion = activeProfile.latestVersion
                const latestFileName = latestVersion.fileName
                const latestPath = latestVersion.path

                for (const server of servers) {
                    try {
                        const fileList = await this.pterodactylService.listFiles(
                            panelUrl,
                            apiKey,
                            server.identifier,
                            '/plugins'
                        )

                        const escapedId = pluginId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                        const regexNewFormat = new RegExp(`^${escapedId}-\\d+(?:\\.\\d+)*-.*\\.jar$`)
                        const legacyFormat = `${pluginId}.jar`

                        const foundJar = fileList.find((file) => {
                            const name = file.attributes.name
                            return (
                                file.attributes.is_file &&
                                (regexNewFormat.test(name) || name === legacyFormat)
                            )
                        })

                        if (foundJar) {
                            const installedFileName = foundJar.attributes.name
                            if (installedFileName !== latestFileName) {
                                console.log(`[AutoUpdate] Upgrading ${pluginId} on server ${server.name} (${installedFileName} -> ${latestFileName})`)

                                const signedUrl = await this.pluginsService.getSignedUrl(latestPath)

                                await this.pterodactylService.deployPlugin(
                                    panelUrl,
                                    apiKey,
                                    server.identifier,
                                    signedUrl,
                                    latestFileName,
                                    pluginId
                                )
                            }
                        }
                    } catch (serverErr) {
                        console.error(`[AutoUpdate] Error processing server ${server.identifier} for plugin ${pluginId}:`, serverErr)
                    }
                }
            }
        } catch (err) {
            console.error('[AutoUpdate] Error running scheduler cycle:', err)
        }
    }
}
