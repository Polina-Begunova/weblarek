import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IErrorData {
  title: string;
  text: string;
  buttonText?: string;
}

export interface IErrorActions {
  onClick: () => void;
}

export class ErrorMessage extends Component<IErrorData> {
  protected _title: HTMLElement;
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IErrorActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(".error__title", container);
    this._text = ensureElement<HTMLElement>(".error__text", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".error__button",
      container
    );

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set text(value: string) {
    this._title.textContent = value;
  }

  set buttonText(value: string) {
    this._title.textContent = value;
  }

  render(data: IErrorData): HTMLElement {
    super.render(data);
    this.title = data.title;
    this.text = data.text;
    this.buttonText = data.buttonText || "Закрыть";
    return this.container;
  }
}
