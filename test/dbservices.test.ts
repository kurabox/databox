import { assert, assertEquals } from "@std/assert";
import { DbConfig, loadEnvDbConfig, initSequelizeInstance } from "../src/dbservices.ts";
import { Sequelize } from "sequelize";

Deno.test("load env config test", (): void => {
    const config: DbConfig | null = loadEnvDbConfig();
    assert(config !== null);
    assertEquals(config.host, "localhost");
    assertEquals(config.port, 3306);
    assertEquals(config.database, "kurabox_search");
    assertEquals(config.username, "root");
    assertEquals(config.password, "password");
});

Deno.test("init sequelize instance test", async (): Promise<void> => {
    const sequelize: Sequelize = initSequelizeInstance(loadEnvDbConfig(), "mariadb");
    await sequelize.authenticate();
});