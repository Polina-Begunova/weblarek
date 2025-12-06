import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface IContactsActions {
  onSubmit: (data: IBuyer) => void;
  onInputChange: (field: keyof IBuyer, value: string) => void;
}

export class ContactsForm extends Form<IBuyer> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _currentData: Partial<IBuyer> = {};
  protected _onInputChange?: (field: keyof IBuyer, value: string) => void;

  constructor(container: HTMLElement, actions?: IContactsActions) {
    super(container, actions?.onSubmit);

    this._onInputChange = actions?.onInputChange;

    this._emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );
    this._phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );

    this._emailInput.addEventListener("input", () => {
      const value = this._emailInput.value;
      this._currentData.email = value;
      this._onInputChange?.("email", value);
      this.validateForm();
    });

    this._phoneInput.addEventListener("input", () => {
      const value = this._phoneInput.value;
      this._currentData.phone = value;
      this._onInputChange?.("phone", value);
      this.validateForm();
    });
  }
  protected validateForm(): boolean {
    const emailFilled = this._emailInput.value.trim() !== "";
    const phoneFilled = this._phoneInput.value.trim() !== "";

    const isValid = emailFilled && phoneFilled;
    this.setValid(isValid);
    return isValid;
  }

  protected getFormData(): IBuyer {
    return {
      payment: this._currentData.payment || "card",
      address: this._currentData.address || "",
      email: this._emailInput.value,
      phone: this._phoneInput.value,
    };
  }

  set email(value: string) {
    this._emailInput.value = value;
    this._currentData.email = value;
    this.validateForm();
  }

  set phone(value: string) {
    this._phoneInput.value = value;
    this._currentData.phone = value;
    this.validateForm();
  }

  set payment(value: "card" | "cash") {
    this._currentData.payment = value;
  }

  set address(value: string) {
    this._currentData.address = value;
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    super.render(data);

    if (data) {
      this._currentData = { ...this._currentData, ...data };

      if (data.email !== undefined) {
        this._emailInput.value = data.email;
        this._currentData.email = data.email;
      }
      if (data.phone !== undefined) {
        this._phoneInput.value = data.phone;
        this._currentData.phone = data.phone;
      }
      if (data.payment !== undefined) {
        this._currentData.payment = data.payment;
      }
      if (data.address !== undefined) {
        this._currentData.address = data.address;
      }
    }

    this.validateForm();
    return this.container;
  }
}
