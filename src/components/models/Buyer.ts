import { IBuyer } from "../../types";
import { EventEmitter } from "../base/Events";

// Тип для ошибок валидации
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  protected data: IBuyer = {
    payment: "card", // значение по умолчанию
    email: "",
    phone: "",
    address: "",
  };

   protected events: EventEmitter;

  constructor(events: EventEmitter,initialData?: Partial<IBuyer>) {
    this.events = events;
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }

  // Сохранение данных покупателя
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit('buyer:changed', { data: this.data });
  }

  // Получение всех данных покупателя
  getData(): IBuyer {
    return { ...this.data };
  }

  // Очистка данных
  clear(): void {
    this.data = {
      payment: "card",
      email: "",
      phone: "",
      address: "",
    };
     this.events.emit('buyer:changed', { data: this.data });
  }

  // Валидация данных
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.data.address || this.data.address.trim() === "") {
      errors.address = "Необходимо указать адрес";
    }

    if (!this.data.email || this.data.email.trim() === "") {
      errors.email = "Введите email";
    }

    if (!this.data.phone || this.data.phone.trim() === "") {
      errors.phone = "Введите телефон";
    }

    return errors;
  }

  // Проверка валидности всех данных
  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }
  // метод для валидации только данных заказа
  validateOrderData(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.data.address || this.data.address.trim() === "") {
      errors.address = "Необходимо указать адрес";
    }

    return errors;
  }

  // Проверка валидности только данных заказа
  isOrderDataValid(): boolean {
    return Object.keys(this.validateOrderData()).length === 0;
  }

}

