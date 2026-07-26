import { Sequelize, Dialect } from "sequelize";

// Cấu hình kết nối database
export type DbConfig = {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
};

// Hàm load thông tin config từ file .env (Hàm này sẽ throw error nếu không thể đọc được thông tin cần thiến trong .env)
export function loadEnvDbConfig(): DbConfig {
    // Trích xuất thông tin database trong file .env
    const host: string | undefined = Deno.env.get("HOST");
    const port: string | undefined = Deno.env.get("PORT");
    const database: string | undefined = Deno.env.get("DATABASE");
    const username: string | undefined = Deno.env.get("USERNAME");
    const password: string | undefined = Deno.env.get("PASSWORD");

    // throw Error nếu thông tin không hợp lệ
    if (host === undefined || port === undefined || database === undefined || username === undefined || password === undefined) {
        throw new Error("Unable to read the correct database configuration information in .env");
    }

    // Trả ra tông tin db config
    return {
        host: host,
        port: Number(port),
        database: database,
        username: username,
        password: password,
    };
}

// Hàm khởi tạo instance kết nối đến database
export function initSequelizeInstance(config: DbConfig, dbDialect: Dialect): Sequelize {
    // Trả ra Sequelize instance chứa kết nối được chỉ định
    return new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            host: config.host,
            dialect: dbDialect,
        }
    );
}