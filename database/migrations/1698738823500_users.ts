import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("email", 255).notNullable().unique();
      table.string("password", 180).notNullable();
      table.string("remember_me_token").nullable();
      table.boolean("verified").notNullable().defaultTo(false);
      table
        .integer("role_id")
        .unsigned()
        .references("roles.id")
        .onDelete("CASCADE")
        .notNullable();
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}