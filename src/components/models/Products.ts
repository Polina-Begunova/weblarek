import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Products {
  protected _items: IProduct[] = [];
  protected _selectedItem: IProduct | null = null;
  protected events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit("products:changed", { items: this._items });
  }

  // Получение массива товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Получение товара по ID
  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // Сохранение выбранного товара
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit("product:selected", { item: this._selectedItem });
  }

  // Получение выбранного товара
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
