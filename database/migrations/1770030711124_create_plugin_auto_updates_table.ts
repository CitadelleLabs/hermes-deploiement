import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'plugin_auto_updates'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('plugin_id').notNullable().unique()
            table.boolean('is_enabled').notNullable().defaultTo(false)

            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
