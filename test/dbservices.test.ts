import { assert, assertEquals } from "@std/assert";
import { DbConfig, loadEnvDbConfig, initSequelizeInstance, modelingIndexDbEntities, runWithTransaction } from "../src/dbservices.ts";
import { Sequelize, Transaction } from "sequelize";
import { Page } from "../src/models.ts";
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

Deno.test("runWithTransaction test", async (): Promise<void> => {
    const dbConfig: DbConfig = loadEnvDbConfig();
    const sequelize: Sequelize = initSequelizeInstance(dbConfig, "mariadb");
    modelingIndexDbEntities(sequelize);
    try {
        await runWithTransaction(sequelize, async (t: Transaction): Promise<void> => {
            await Page.create(
                {
                    id: utilsbox.generateV4UUID(),
                    url: "www.page1.com",
                },
                { transaction: t },
            );
        });
    } catch (err: unknown) {
        console.log(err);
    }
});