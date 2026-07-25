/**
 * Chứa config mikro-orm
*/

import { defineConfig } from "@mikro-orm/mariadb";
import { Page, PageMeta, PageStatus, HtmlContent, HtmlHash } from "./entities.ts";

// Hàm config kết nối đến database
export default defineConfig({
    dbName: "mariadb",  // database
    entities: [Page, PageMeta, PageStatus, HtmlContent, HtmlHash],
    debug: true,    // sử dụng debug mode
});