import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        
        this._handleEscape = this._handleEscape.bind(this);
        this.close = this.close.bind(this);
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this._handleEscape);
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        document.removeEventListener('keydown', this._handleEscape);
    }

    private _handleEscape(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    render(data: IModalData): HTMLElement {
        this.content = data.content;
        return this.container;
    }
}