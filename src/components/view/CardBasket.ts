import { Card } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
  onClick: (event: MouseEvent, id: string) => void;
}

export class CardBasket extends Card<IProduct> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected _currentId?: string;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    if (actions?.onClick) {
      this._deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (this._currentId) {
          actions.onClick(event, this._currentId);
        }
      });
    }
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
    super.render(data);

    if (data) {
      this.setTitle(data.title || "");
      this.setPrice(data.price ?? null);

      if (data.index !== undefined) {
        this.index = data.index + 1;
      }

      if (data.id) {
        this._currentId = data.id;
      }
    }

    return this.container;
  }
}
