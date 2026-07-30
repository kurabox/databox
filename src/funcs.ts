import { PageData } from "./data-types.ts";

// Hàm hiển thị PageData ra console (dùng cho test và debug)
export function logPageData(pageData: PageData): void {
    console.log(`
        Page Data:
            id: ${pageData.page.id}
            url: ${pageData.page.url}
            title: ${pageData.meta.title}
            publication timestamp: ${(pageData.meta.publicationTimestamp !== null) ? new Date(Number(pageData.meta.publicationTimestamp)).toDateString() : "No info"}
            type: ${pageData.meta.pageType.toString()}
            source: ${pageData.meta.source}
            created timestamp: ${new Date(Number(pageData.status.createdTimestamp)).toDateString()}
            update date: ${new Date(Number(pageData.status.updateTimestamp)).toDateString()}
            language: ${pageData.meta.language}
            content hash: ${pageData.htmlHash.hashData}
    `);
}
