import { Card } from "./Card";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Card<IProduct> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Добавляем чтобы не всплывало
                actions.onClick(event);
            });
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
        super.render(data);
        
        if (data) {
            this.setTitle(data.title || '');
            this.setPrice(data.price ?? null);
            
            if (data.index !== undefined) {
                this.index = data.index + 1; // +1 потому что индексы с 0
            }
            
            if (data.id) {
                this.id = data.id;
            }
        }
        
        return this.container;
    }
}