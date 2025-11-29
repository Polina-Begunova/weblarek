import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
  protected _items: IProduct[] = [];
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  // Получение товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавление товара в корзину
  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit("basket:changed", { items: this._items });
  }

  // Удаление товара из корзины
  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", { items: this._items });
  }

  // Очистка корзины
  clear(): void {
    this._items = [];
    this.events.emit("basket:changed", { items: this._items });
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
