import { Api } from "../base/Api"; // Импортируем конкретный класс Api
import {
  IProduct,
  IOrder,
  IOrderResult,
  IProductListResponse,
} from "../../types";

export class LarekApi {
  protected api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  getProductList(): Promise<IProduct[]> {
    return this.api
      .get<IProductListResponse>("/product/")
      .then((response) => response.items); // Извлекаем items из ответа
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}
