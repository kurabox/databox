import { type InferEntity, defineEntity, p } from "@mikro-orm/mariadb";
import { utilsbox } from "../libs.ts";

// Page entity
export const Page = defineEntity({
    name: "Page",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()), // id của page (khoá chính)
        url: p.text().unique(),   // url của page
    },
});

// PageMeta entity
export const PageMeta = defineEntity({
    name: "PageMeta",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()),   // id của page meta (khoá chính)
        page: () => p.oneToOne(Page), // tham chiếu đến id của page
        title: p.text(),  // title của page
        publicationTimestamp: p.bigint().nullable(), // ngày xuất bản của page (nếu có)
        pageType: p.string(),   // loại page
        source: p.string(), // nguồn page
    },
});

// PageStatus entity
export const PageStatus = defineEntity({
    name: "PageStatus",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()),   // id của page status (khoá chính)
        page: () => p.oneToOne(Page), // tham chiếu đến id của page
        createdTimestamp: p.bigint().onCreate((): bigint => BigInt(Date.now())),   // timestamp khởi tạo của page
        updateTimestamp: p.bigint().onCreate((): bigint => BigInt(Date.now())).onUpdate((): bigint => BigInt(Date.now())),    // timestamp cập nhật của page
    },
});

// HtmlContent entity
export const HtmlContent = defineEntity({
    name: "HtmlContent",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()),   // id của html content (khoá chính)
        page: () => p.oneToOne(Page), // tham chiếu đến id của page
        htmlData: p.text(),   // nội dung html của page
    },
});

// HtmlHash entity
export const HtmlHash = defineEntity({
    name: "HtmlHash",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()),   // id của html hash content (khoá chính)
        page: () => p.oneToOne(Page), // tham chiếu đến id của page
        hashData: p.string(),   // nội dung đã hash của page
    }
});

// Image entity
export const Image = defineEntity({
    name: "Image",
    properties: {
        id: p.string().primary().onCreate(() => utilsbox.generateV4UUID()),   // id của image (khoá chính)
        page: () => p.manyToOne(Page),    // tham chiếu đến id của page
        imageUrl: p.string(),   // url của image
        altText: p.string(),    /// alt text của image
        source: p.string(), // nguồn của image
    },
});

export type IPage = InferEntity<typeof Page>;
export type IPageMeta = InferEntity<typeof PageMeta>;
export type IPageStatus = InferEntity<typeof PageStatus>;
export type IHtmlContent = InferEntity<typeof HtmlContent>;
export type IHtmlHash = InferEntity<typeof HtmlHash>;
export type IImage = InferEntity<typeof Image>;