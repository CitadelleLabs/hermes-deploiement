import type { ApplicationService } from '@adonisjs/core/types'
import AutoUpdateService from '#services/auto_update_service'

export default class AutoUpdateProvider {
    constructor(protected app: ApplicationService) { }

    /**
     * Register bindings to the container
     */
    register() {
        this.app.container.singleton('auto_update.service', () => new AutoUpdateService())
    }

    /**
     * The process has been started
     */
    async ready() {
        const service = await this.app.container.make('auto_update.service')

        const intervalMinutes = parseInt(process.env.AUTO_UPDATE_INTERVAL_MINUTES || '5', 10)
        service.schedule(`*/${intervalMinutes} * * * *`)
    }

    /**
     * Preparing to shutdown the app
     */
    async shutdown() {
        const service = await this.app.container.make('auto_update.service')
        service.stopSchedule()
    }
}

declare module '@adonisjs/core/types' {
    interface ContainerBindings {
        'auto_update.service': AutoUpdateService
    }
}
