import { Card } from "./Card";
import { IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }
  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (data) {
      console.log(`Рендер карточки: ${data.title}`, {
        image: data.image,
        fullPath: data.image ? `${CDN_URL}${data.image}` : "no image",
      });

      this.setCategory(data.category || "");
      this.setTitle(data.title || "");

      if (data.image) {
        this.setImageSrc(data.image, data.title);
      }

      this.setPrice(data.price ?? null);
    }

    return this.container;
  }
}
