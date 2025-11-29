import { Form } from "./Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface IOrderActions {
    onSubmit: (data: IBuyer) => void;
    onInputChange: (field: keyof IBuyer, value: string) => void;
}

export class OrderForm extends Form<IBuyer> {
    protected _addressInput: HTMLInputElement;
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLElement, actions?: IOrderActions) {
        super(container);
        
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
        this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        
        this._paymentButtons = [this._cardButton, this._cashButton];
        
        // Обработчики для выбора способа оплаты
        this._cardButton.addEventListener('click', () => {
            this.selectPayment('card');
            actions?.onInputChange('payment', 'card');
            this.validateForm(); 
        });
        
        this._cashButton.addEventListener('click', () => {
            this.selectPayment('cash');
            actions?.onInputChange('payment', 'cash');
            this.validateForm(); 
        });
        
        // Обработчик для адреса
        this._addressInput.addEventListener('input', () => {
            actions?.onInputChange('address', this._addressInput.value);
            this.validateForm(); 
        });
        
        // Обработчик отправки формы
        if (actions?.onSubmit) {
            container.addEventListener('submit', (e: Event) => {
                e.preventDefault();
                const formData = this.getFormData();
                actions.onSubmit(formData);
            });
        }
         setTimeout(() => {
        this.validateForm();
    }, 0);
    }
   protected validateForm(): boolean {
    const addressFilled = this._addressInput.value.trim() !== '';
    const paymentSelected = this._cardButton.classList.contains('button_alt-active') || 
                           this._cashButton.classList.contains('button_alt-active');
    
    // Валидация и отображение ошибок
    let errors: Record<string, string> = {};
    
    if (!paymentSelected) {
        errors.payment = "Не выбран способ оплаты";
    }
    
    if (!addressFilled) {
        errors.address = "Необходимо указать адрес";
    }
    
    // Устанавливаем ошибки (если есть)
    if (Object.keys(errors).length > 0) {
        this.setErrors(errors);
    } else {
        this.clearErrors();
    }
    
    const isValid = addressFilled && paymentSelected;
    this.setValid(isValid);
    return isValid;
}
  
    private selectPayment(method: 'card' | 'cash') {
        // Снимаем выделение со всех кнопок
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        
        // Выделяем выбранную кнопку
        if (method === 'card') {
            this._cardButton.classList.add('button_alt-active');
        } else {
            this._cashButton.classList.add('button_alt-active');
        }
    }

    private getFormData(): IBuyer {
        return {
            payment: this._cardButton.classList.contains('button_alt-active') ? 'card' : 'cash',
            address: this._addressInput.value,
            email: '',
            phone: ''
        };
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: 'card' | 'cash') {
        this.selectPayment(value);
    }

    render(data?: Partial<IBuyer>): HTMLElement {
        super.render(data);
        
        if (data) {
            if (data.address) this.address = data.address;
            if (data.payment) this.payment = data.payment;
        }
        this.validateForm(); 
        return this.container;
    }
}