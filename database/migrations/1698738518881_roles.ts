import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import { Role } from "App/Enums/Role";

export default class extends BaseSchema {
  protected tableName = "roles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("role_name", 15).notNullable();
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());

      this.defer(async (db) => {
        await db.table(this.tableName).multiInsert([
          {
            id: Role.ADMIN,
            role_name: "Admin",
          },
          {
            id: Role.USER,
            role_name: "User",
          },
        ]);
      });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
