/**
 * Các kiểu dữ liệu trung gian làm việc giữa chương trình như crawler, search-backend và sequelize enetity
*/

import { utilsbox } from "../libs.ts";

// Các kiểu bên dưới không cần validate vì modeling của sequelize sẽ xử lý trong quá trình thêm dữ liệu
export type Page = {
    id: string;
    url: string;
};

export type PageStatus = {
    id: string;
    pageId: string;
    createdTimestamp: bigint;
    updateTimestamp: bigint;
};

export type PageMeta = {
    id: string;
    pageId: string;
    title: string;
    publicationTimestamp: bigint | null;
    pageType: utilsbox.PageType;
    source: string;
    language: utilsbox.Language;
};

export type HtmlContent = {
    id: string;
    pageId: string;
    htmlData: string;
};

export type HtmlHash = {
    id: string;
    pageId: string;
    hashData: string;
};

export type Image = {
    id: string;
    pageId: string;
    imageUrl: string;
    altText: string;
    source: string;
};

// Kiểu chuyển tiếp PageData dùng cho việc chuyển dữ liệu từ crawler
export type PageData = {
    page: Page;
    status: PageData;
    meta: PageMeta;
    htmlContent: HtmlContent;
    htmlHash: HtmlHash;
    images?: Image[];
};