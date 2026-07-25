export type DbConfig = {
    host: string;
    port: number;
    dbName: string;
    user: string;
    password: string;
};

// Hàm load thông tin config từ file .env
export function loadEnvDbConfig(): DbConfig | null {
    // Trích xuất thông tin database trong file .env
    const host: string | undefined = Deno.env.get("db-host");
    const port: string | undefined = Deno.env.get("db-port");
    const dbName: string | undefined = Deno.env.get("db-name");
    const user: string | undefined = Deno.env.get("db-user");
    const password: string | undefined = Deno.env.get("db-password");

    // Trả ra null nếu thông tin không hợp lệ
    if (host === undefined || port === undefined || dbName === undefined || user === undefined || password === undefined) {
        return null;
    }

    // Trả ra tông tin db config
    return {
        host: host,
        port: Number(port),
        dbName: dbName,
        user: user,
        password: password,
    };
}
