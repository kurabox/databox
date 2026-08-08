import { Sequelize, Dialect, DataTypes, Transaction } from "sequelize";
import { Page, PageMeta, PageStatus, HtmlContent, HtmlHash, Image } from "./models.ts";
import { utilsbox } from "../libs.ts";

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
                validate: {
                    isUUID: 4,  // cần phải là uuid
                }
            },
            url: {
                type: DataTypes.TEXT,
                field: "url",
                allowNull: false,
                validate: {
                    isUrl: true,    // cần phải là url
                },
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
                validate: {
                    isUUID: 4,  // cần phải là uuid
                },
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
                validate: {
                    isUUID: 4,  // cần phải là uuid
                },
            },
            title: {
                type: DataTypes.TEXT,
                field: "title",
                allowNull: false,
                validate: {
                    fn(title: string): void {
                        if (!utilsbox.isValidStringWithMinLen(title, 2)) {
                            throw new Error("Only valid title is allowed! (Has atlest 2 alphabet chars)");
                        }
                    }
                },
            },
            publicationTimestamp: {
                type: DataTypes.BIGINT,
                field: "publication_timestamp",
                allowNull: true,
                validate: {
                    isInt: true,
                }
            },
            pageType: {
                type: DataTypes.STRING,
                field: "page_type",
                allowNull: false,
                validate: {
                    fn(pageType: string): void {
                        if (!utilsbox.isPageTypeValue(pageType)) {
                            throw new Error("Only valid page type value is allowed!");
                        }
                    }
                },
            },
            source: {
                type: DataTypes.STRING,
                field: "source",
                allowNull: false,
                validate: {
                    notEmpty: true // source không được rỗng
                },
            },
            language: {
                type: DataTypes.STRING,
                field: "language",
                allowNull: false,
                validate: {
                    fn(language: string): void {
                        if (!utilsbox.isLanguageValue(language)) {
                            throw new Error("Only valid language value is allowed!");
                        }
                    }
                }
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
                validate: {
                    isUUID: 4,  // phải là uuid
                },
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
                validate: {
                    isUUID: 4,  // phải là uuid
                }
            },
            createdTimestamp: {
                type: DataTypes.BIGINT,
                field: "created_timestamp",
                allowNull: false,
                validate: {
                    isInt: true,    // cần phải là kiểu int
                },
            },
            updateTimestamp: {
                type: DataTypes.BIGINT,
                field: "update_timestamp",
                allowNull: false,
                validate: {
                    isInt: true,    // cần phải là kiểu int
                }
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
                validate: {
                    isUUID: 4,  // phải là uuid
                },
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
                validate: {
                    isUUID: 4,  // phải là uuid
                },
            },
            htmlData: {
                type: DataTypes.TEXT,
                field: "html_data",
                allowNull: false,
                validate: {
                    // Gọi hàm validate html string
                    fn(htmlData: string): void {
                        if (!utilsbox.validateHtmlString(htmlData)) {
                            throw new Error("Only valid html data is allowed!");
                        }
                    }
                },
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
                validate: {
                    isUUID: 4,
                },
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
                validate: {
                   isUUID: 4,
                },
            },
            hashData: {
                type: DataTypes.STRING,
                field: "hash_data",
                allowNull: false,
                validate: {
                    fn(hashData: string): void {
                        if (!utilsbox.validateSHA256Hash(hashData)) {
                            throw new Error("Only SHA256 format hash is allowed!");
                        }
                    }
                },
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
                validate: {
                    isUUID: 4,
                }
            },
            pageId: {
                type: DataTypes.STRING,
                field: "page_id",
                allowNull: false,
                validate: {
                    isUUID: 4,
                }
            },
            imageUrl: {
                type: DataTypes.STRING,
                field: "image_url",
                allowNull: false,
                validate: {
                    isUrl: true,
                }
            },
            altText: {
                type: DataTypes.STRING,
                field: "alt_text",
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            source: {
                type: DataTypes.STRING,
                field: "source",
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
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

/**
 * Hàm thực thi truy vấn chung theo transaction (không cần khởi tạo lai sequelize và transaction)
 * @param sequelize 
 * @param fn 
 * @throws {unknown}  // Hàm này sẽ throw nếu gặp lỗi
 */
export async function runWithTransaction<T>(sequelize: Sequelize, fn: (t: Transaction) => Promise<T>): Promise<T> {
    const t: Transaction = await sequelize.transaction();   // Khởi tạo transaction cho sequelize
    try {
        const result: T = await fn(t);  // Khởi chạy callback function để thực thi query
        await t.commit();
        return result;
    } catch (err: unknown) {
        await t.rollback(); // huỷ thay đồi của transaction
        throw err;  // throw ra lỗi gặp phải
    }
}