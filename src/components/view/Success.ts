import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this._description = ensureElement<HTMLElement>(
      ".order-success__description",
      container
    );
    this._closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container
    );

    if (actions?.onClick) {
      this._closeButton.addEventListener("click", actions.onClick);
    }
  }

  set total(value: number) {
    if (this._description) {
      this._description.textContent = `Списано ${value} синапсов`;
    }
  }

  render(data: ISuccess): HTMLElement {
    super.render(data);
    this.total = data.total;
    return this.container;
  }
}
