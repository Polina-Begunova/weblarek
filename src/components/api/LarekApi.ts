import { Api } from "../base/Api"; // Импортируем конкретный класс Api
import { IProduct, IOrder, IOrderResult } from "../../types";

export class LarekApi {
  protected api: Api;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.api = new Api(baseUrl, options);
  }

  getProductList(): Promise<IProduct[]> {
    return this.api.get("/product/") as Promise<IProduct[]>;
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post("/order/", order) as Promise<IOrderResult>;
  }
}
