import { initSequelizeInstance, DbConfig, loadEnvDbConfig, modelingIndexDbEntities } from "../src/dbservices.ts";
import { Transaction, Sequelize } from "sequelize";
import { Page } from "../src/entities.ts";

Deno.test("sample query test", async (): Promise<void> => {
    const dbConfig: DbConfig = loadEnvDbConfig();
    const sequelize: Sequelize = initSequelizeInstance(dbConfig, "mariadb");
    modelingIndexDbEntities(sequelize);
    const t: Transaction = await sequelize.transaction();
    try {
        await Page.create({ id: "id01", url: "www.example.com" }, { transaction: t });
        await t.commit();   // commit các thay đổi tư transaction vào database
    } catch (err: unknown) {
        await t.rollback();
        console.log(err);
    }
});