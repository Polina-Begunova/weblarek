import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export interface IBasketActions {
  onCheckout: () => void;
  onRemove: (id: string) => void;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this._list = ensureElement<HTMLElement>(".basket__list", container);
    this._total = ensureElement<HTMLElement>(".basket__price", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container
    );

    if (actions?.onCheckout) {
      this._button.addEventListener("click", actions.onCheckout);
    }
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this._button.disabled = false;
    } else {
      this._list.replaceChildren(this.createEmptyText());
      this._button.disabled = true;
    }
  }

  set total(total: number) {
    if (this._total) {
      this._total.textContent = `${total} синапсов`;
    }
  }

  private createEmptyText(): HTMLElement {
    const element = document.createElement("li");
    element.textContent = "Корзина пуста";
    element.classList.add("basket__empty");
    return element;
  }

  render(data: IBasket): HTMLElement {
    super.render(data);
    this.items = data.items;
    this.total = data.total;
    return this.container;
  }
}
