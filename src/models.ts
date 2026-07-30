/**
 * Các model được mô hình hoá từ database
*/

import { Model } from "sequelize";

export class Page extends Model {}
export class PageMeta extends Model {}
export class PageStatus extends Model {}
export class HtmlContent extends Model {}
export class HtmlHash extends Model {}
export class Image extends Model {}