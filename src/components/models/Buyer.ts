import { IBuyer } from "../../types";

// Тип для ошибок валидации
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  protected data: IBuyer = {
    payment: "card", // значение по умолчанию
    email: "",
    phone: "",
    address: "",
  };

  constructor(initialData?: Partial<IBuyer>) {
    if (initialData) {
      this.data = { ...this.data, ...initialData };
    }
  }

  // Сохранение данных покупателя
  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
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
  }

  // Валидация данных
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.data.address || this.data.address.trim() === "") {
      errors.address = "Введите адрес доставки";
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
}
