import { IBuyer } from "../../types";

export class Buyer {
  protected _data: Partial<IBuyer> = {};

  constructor(initialData?: Partial<IBuyer>) {
    this._data = initialData ? { ...initialData } : {};
  }

  // Сохранение данных покупателя
  setData(data: Partial<IBuyer>): void {
    this._data = { ...this._data, ...data };
  }

  // Получение всех данных покупателя
  getData(): Partial<IBuyer> {
    return this._data;
  }

  // Очистка данных
  clear(): void {
    this._data = {};
  }

  // Валидация данных
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this._data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this._data.address || this._data.address.trim() === "") {
      errors.address = "Введите адрес доставки";
    }

    if (!this._data.email || this._data.email.trim() === "") {
      errors.email = "Введите email";
    }

    if (!this._data.phone || this._data.phone.trim() === "") {
      errors.phone = "Введите телефон";
    }

    return errors;
  }

  // Проверка валидности всех данных
  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
}
