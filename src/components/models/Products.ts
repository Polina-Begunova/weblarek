import { IProduct } from "../../types";

export class Products {
  protected _items: IProduct[] = [];
  protected _selectedItem: IProduct | null = null;

  // Сохранение массива товаров
  setItems(items: IProduct[]): void {
    this._items = items;
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
  }

  // Получение выбранного товара
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
