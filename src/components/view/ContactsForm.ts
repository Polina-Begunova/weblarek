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

  constructor(container: HTMLElement, actions?: IContactsActions) {
    super(container);

    if (actions?.onInputChange) {
      const originalOnInputChange = actions.onInputChange;
      actions.onInputChange = (field: keyof IBuyer, value: string) => {
        if (field === "payment") {
          if (value === "card" || value === "cash") {
            this._currentData[field] = value;
          }
        } else {
          this._currentData[field] = value;
        }

        originalOnInputChange(field, value);
        this.validateForm();
      };
    }

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
      actions?.onInputChange("email", value);
      this.validateForm();
    });

    this._phoneInput.addEventListener("input", () => {
      const value = this._phoneInput.value;
      this._currentData.phone = value;
      actions?.onInputChange("phone", value);
      this.validateForm();
    });

    if (actions?.onSubmit) {
      this.container.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        if (this.validateForm()) {
          const formData = this.getFormData();
          actions.onSubmit(formData);
        }
      });
    }
  }

  protected validateForm(): boolean {
    const emailFilled = this._emailInput.value.trim() !== "";
    const phoneFilled = this._phoneInput.value.trim() !== "";

    let errors: Record<string, string> = {};

    if (!emailFilled) {
      errors.email = "Введите email";
    }

    if (!phoneFilled) {
      errors.phone = "Введите телефон";
    }

    if (Object.keys(errors).length > 0) {
      this.setErrors(errors);
    } else {
      this.clearErrors();
    }

    const isValid = emailFilled && phoneFilled;
    this.setValid(isValid);
    return isValid;
  }

  private getFormData(): IBuyer {
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

      if (data.email) this.email = data.email;
      if (data.phone) this.phone = data.phone;
      if (data.payment) this.payment = data.payment;
      if (data.address) this.address = data.address;
    }

    this.validateForm();
    return this.container;
  }
}
