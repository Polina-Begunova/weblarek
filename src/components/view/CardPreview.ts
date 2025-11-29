import { Card } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<IProduct> {
    protected _button: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    
       render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    
    if (data) {
        console.log(`Рендер превью: ${data.title}`, {
            image: data.image,
            fullPath: data.image ? `${CDN_URL}${data.image}` : 'no image'
        });
        
        this.setCategory(data.category || '');
        this.setTitle(data.title || '');
        this.setDescription(data.description || '');
        
        if (data.image) {
            this.setImageSrc(data.image, data.title);
        }
        
        this.setPrice(data.price ?? null);
        
        if (data.id) {
            this.id = data.id;
        }
        if (data.price === null) {
            this.setButton('Недоступно', true); 
        }
    }
    
    return this.container;
}

    // Специальный метод для установки состояния кнопки корзины
    setBasketState(inBasket: boolean) {
    if (this._button && !this._button.disabled) {
        if (inBasket) {
            this.setButton('Удалить из корзины', false);
        } else {
            this.setButton('Купить', false);
        }
    }
}
}