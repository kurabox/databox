import { MikroORM } from "@mikro-orm/mariadb";
import config from "./mikro-orm.config.ts"; // thực tế là hàm export default defineConfig

const orm = await MikroORM.init(config);    // Khởi tạo mikroorm
export default orm.em;