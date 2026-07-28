import { assert, assertEquals } from "@std/assert";
import { DbConfig, loadEnvDbConfig, initSequelizeInstance, modelingIndexDbEntities } from "../src/dbservices.ts";
import { Sequelize, Transaction } from "sequelize";
import { Page } from "../src/entities.ts";
import { utilsbox } from "../libs.ts";

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

Deno.test("sample query test", async (): Promise<void> => {
    const dbConfig: DbConfig = loadEnvDbConfig();
    const sequelize: Sequelize = initSequelizeInstance(dbConfig, "mariadb");
    modelingIndexDbEntities(sequelize);
    const t: Transaction = await sequelize.transaction();
    try {
        await Page.create({ id: utilsbox.generateV4UUID(), url: "www.example2.com" }, { transaction: t });
        await t.commit();   // commit các thay đổi tư transaction vào database
    } catch (err: unknown) {
        await t.rollback();
        console.log(err);
    }
});