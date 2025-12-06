import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected _errors: HTMLElement;
  protected _submit: HTMLButtonElement;
  protected _onSubmitCallback?: (data: T) => void;

  constructor(container: HTMLElement, onSubmit?: (data: T) => void) {
    super(container);

    this._errors = ensureElement<HTMLElement>(".form__errors", container);
    this._submit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );

    this._onSubmitCallback = onSubmit;

    if (onSubmit) {
      this.container.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        if (this.validateForm()) {
          const formData = this.getFormData();
          onSubmit(formData);
        }
      });
    }
  }

  public setErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter(
      (message) => message.length > 0
    );
    this._errors.textContent = errorMessages.join(", ");
  }

  public clearErrors(): void {
    this._errors.textContent = "";
  }

  public setValid(valid: boolean): void {
    if (this._submit) {
      this._submit.disabled = !valid;
    }
  }
  protected abstract validateForm(): boolean;
  protected abstract getFormData(): T;
}
