import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IPageActions {
  onBasketClick: () => void;
}

export class Page extends Component<null> {
  protected _gallery: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, actions?: IPageActions) {
    super(container);

    this._gallery = ensureElement<HTMLElement>(".gallery", container);
    this._basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container
    );
    this._basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container
    );
    this._wrapper = ensureElement<HTMLElement>(".page__wrapper", container);

    if (actions?.onBasketClick) {
      this._basketButton.addEventListener("click", actions.onBasketClick);
    }
  }

  // Установка счетчика корзины
  set basketCounter(value: number) {
    this._basketCounter.textContent = String(value);
  }

  // Установка карточек товаров в галерею
  set cards(cards: HTMLElement[]) {
    this._gallery.replaceChildren(...cards);
  }

  // Очистка галереи
  clearGallery() {
    this._gallery.innerHTML = "";
  }

  // Блокировка прокрутки страницы при открытом модальном окне
  lockScroll(locked: boolean) {
    if (locked) {
      this._wrapper.classList.add("page__wrapper_locked");
    } else {
      this._wrapper.classList.remove("page__wrapper_locked");
    }
  }
}
