import { DbConfig, loadEnvDbConfig } from "../src/dbservices.ts";
import { assert, assertEquals } from "@std/assert";

Deno.test("load env config test", (): void => {
    const config: DbConfig | null = loadEnvDbConfig();
    assert(config !== null);
    assertEquals(config.host, "localhost");
    assertEquals(config.port, 3306);
    assertEquals(config.dbName, "kurabox_search");
    assertEquals(config.user, "root");
    assertEquals(config.password, "password");
});