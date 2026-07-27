import { Sequelize, Dialect, DataTypes } from "sequelize";
import { Page, PageMeta, PageStatus, HtmlContent, HtmlHash, Image } from "./entities.ts";

// Cấu hình kết nối database
export type DbConfig = {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
};

/**
 * Hàm tải thông tin kết nối database từ .env
 * @throws {Error} khi không thể tải thông tin database từ file .env
 */
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

// Hàm khởi tạo model cho sequelize instance đầu vào
export function modelingIndexDbEntities(sequelize: Sequelize): void {
    // Mô hình hoá Page entity
    Page.init(
        {
            // Các thuộc tính
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,   // primary key của page
            },
            url: {
                type: DataTypes.TEXT,
                field: "url",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "Page",
            tableName: "page",
            timestamps: false,  // không thêm giá trị timestamps mặc định khi thêm dữ liệu
        },
    );

    // Mô hình hoá PageMeta entity
    PageMeta.init(
        // Các thuộc tính
        {
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,   // primary key của page
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
            },
            title: {
                type: DataTypes.TEXT,
                field: "title",
                allowNull: false,
            },
            publicationTimestamp: {
                type: DataTypes.BIGINT,
                field: "publication_timestamp",
                allowNull: false,
            },
            pageType: {
                type: DataTypes.STRING,
                field: "page_type",
                allowNull: false,
            },
            source: {
                type: DataTypes.STRING,
                field: "source",
                allowNull: false,
            },
            language: {
                type: DataTypes.STRING,
                field: "language",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "PageMeta",
            tableName: "page_meta",
            timestamps: false,
        },
    );

    // Mô hình hoá PageStatus entity
    PageStatus.init(
        // Các thuộc tính
        {
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
            },
            createdTimestamp: {
                type: DataTypes.BIGINT,
                field: "created_timestamp",
                allowNull: false,
            },
            updateTimestamp: {
                type: DataTypes.BIGINT,
                field: "update_timestamp",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "PageStatus",
            tableName: "page_status",
            timestamps: false,
        },
    );

    // Mô hình hoá HtmlContent entity
    HtmlContent.init(
        // Các thuộc tính
        {
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
            },
            htmlData: {
                type: DataTypes.TEXT,
                field: "html_data",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "HtmlContent",
            tableName: "html_content",
            timestamps: false,
        },
    );

    // Mô hình hoá HtmlHash entity
    HtmlHash.init(
        // Các thuộc tính
        {
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
            },
            hashData: {
                type: DataTypes.STRING,
                field: "hash_data",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "HtmlHash",
            tableName: "html_hash",
            timestamps: false,
        },
    );

    // Mô hình hoá Image entity
    Image.init(
        // Các thuộc tính
        {
            id: {
                type: DataTypes.STRING,
                field: "id",
                allowNull: false,
                primaryKey: true,
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
            },
            imageUrl: {
                type: DataTypes.STRING,
                field: "image_url",
                allowNull: false,
            },
            altText: {
                type: DataTypes.STRING,
                field: "alt_text",
                allowNull: false,
            },
            source: {
                type: DataTypes.STRING,
                field: "source",
                allowNull: false,
            }
        },
        {
            sequelize: sequelize,
            modelName: "Image",
            tableName: "image",
            timestamps: false,
        },
    );

    // Khởi tạo tham chiếu khoá ngoại

    // Page entity
    Page.hasOne(PageMeta, { foreignKey: "page_id", sourceKey: "id" });
    Page.hasOne(PageStatus, { foreignKey: "page_id", sourceKey: "id" });
    Page.hasOne(HtmlContent, { foreignKey: "page_id", sourceKey: "id" });
    Page.hasOne(HtmlHash, { foreignKey: "page_id", sourceKey: "id" });
    Page.hasMany(Image, { foreignKey: "page_id", sourceKey: "id" });
    PageMeta.belongsTo(Page, { foreignKey: "page_id" });
    PageStatus.belongsTo(Page, { foreignKey: "page_id" });
    HtmlContent.belongsTo(Page, { foreignKey: "page_id" });
    HtmlHash.belongsTo(Page, { foreignKey: "page_id" });
    Image.belongsTo(Page, { foreignKey: "page_id" });
}