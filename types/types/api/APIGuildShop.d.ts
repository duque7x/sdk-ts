import { APIProduct } from "./APIProduct";
export interface APIGuildShop {
    /** Shop's product */
    products: APIProduct[];
    /** Bought count */
    boughtCount: number;
    /** Creation Date */
    createdAt: Date;
    /** Updated Date */
    updatedAt: Date;
}
