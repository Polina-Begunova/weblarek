import { IProduct } from "../../types";

export class Basket {
  protected _items: IProduct[] = [];

  // Получение товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  // Удаление товара из корзины
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  // Очистка корзины
  clear(): void {
    this._items = [];
  }

  // Получение общей стоимости
  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  // Получение количества товаров
  getCount(): number {
    return this._items.length;
  }

  // Проверка наличия товара в корзине
  contains(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
