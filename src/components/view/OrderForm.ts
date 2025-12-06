import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface IOrderActions {
  onSubmit: (data: IBuyer) => void;
  onInputChange: (field: keyof IBuyer, value: string) => void;
}

export class OrderForm extends Form<IBuyer> {
  protected _addressInput: HTMLInputElement;
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _paymentButtons: HTMLButtonElement[];
  protected _onInputChange?: (field: keyof IBuyer, value: string) => void;
  protected _currentPayment: "card" | "cash" = "card";

  constructor(container: HTMLElement, actions?: IOrderActions) {
    super(container, actions?.onSubmit);

    this._onInputChange = actions?.onInputChange;

    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    this._cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container
    );

    this._paymentButtons = [this._cardButton, this._cashButton];

    // Обработчики для выбора способа оплаты
    this._cardButton.addEventListener("click", () => {
      this.selectPayment("card");
      this._onInputChange?.("payment", "card");
      this.validateForm();
    });

    this._cashButton.addEventListener("click", () => {
      this.selectPayment("cash");
      this._onInputChange?.("payment", "cash");
      this.validateForm();
    });

    // Обработчик для адреса
    this._addressInput.addEventListener("input", () => {
      this._onInputChange?.("address", this._addressInput.value);
      this.validateForm();
    });
    this.selectPayment("card");
  }
  protected validateForm(): boolean {
    const addressFilled = this._addressInput.value.trim() !== "";
    const paymentSelected = this._currentPayment !== null;

    const isValid = addressFilled && paymentSelected;
    this.setValid(isValid);
    return isValid;
  }

  protected getFormData(): IBuyer {
    return {
      payment: this._currentPayment,
      address: this._addressInput.value,
      email: "",
      phone: "",
    };
  }

  private selectPayment(method: "card" | "cash") {
    this._paymentButtons.forEach((button) => {
      button.classList.remove("button_alt-active");
    });

    if (method === "card") {
      this._cardButton.classList.add("button_alt-active");
    } else {
      this._cashButton.classList.add("button_alt-active");
    }
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    super.render(data);
    if (data) {
      if (data.address !== undefined) {
        this._addressInput.value = data.address;
      }
      if (data.payment !== undefined) {
        this.selectPayment(data.payment);
      }
    }
    this.validateForm();
    return this.container;
  }
}
