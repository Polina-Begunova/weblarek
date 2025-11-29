import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected _errors: HTMLElement;
  protected _submit: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this._errors = ensureElement<HTMLElement>(".form__errors", container);
    this._submit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
  }

  protected setErrors(errors: Record<string, string>): void {
    const errorMessages = Object.values(errors).filter(
      (message) => message.length > 0
    );
    this._errors.textContent = errorMessages.join(", ");
  }

  protected clearErrors(): void {
    this._errors.textContent = "";
  }

  protected setValid(valid: boolean): void {
    if (this._submit) {
      this._submit.disabled = !valid;
    }
  }

  protected validateForm(): boolean {
    return true;
  }
}
