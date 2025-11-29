import { Component } from "../base/Component";
import { categoryMap, CDN_URL } from "../../utils/constants"; 

export abstract class Card<T> extends Component<T> {
    protected _category?: HTMLElement;
    protected _title?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        // Находим элементы в контейнере
        this._category = container.querySelector('.card__category') || undefined;
        this._title = container.querySelector('.card__title') || undefined;
        this._image = container.querySelector('.card__image') || undefined;
        this._price = container.querySelector('.card__price') || undefined;
        this._button = container.querySelector('.card__button') || undefined;
        this._description = container.querySelector('.card__text') || undefined;
    }

    // Установка категории с соответствующим CSS классом
    protected setCategory(category: string) {
        if (this._category) {
            this._category.textContent = category;
            
            // Удаляем все возможные классы категорий
            Object.values(categoryMap).forEach(className => {
                this._category!.classList.remove(className);
            });
            
            // Добавляем соответствующий класс для категории
            const categoryClass = categoryMap[category as keyof typeof categoryMap];
            if (categoryClass) {
                this._category.classList.add(categoryClass);
            }
        }
    }

    protected setTitle(title: string) {
        this.setText(this._title, title);
    }

  protected setImageSrc(src: string, alt?: string) {
    if (this._image) {
        // Формируем полный путь к изображению
        const fullImagePath = src.startsWith('http') ? src : `${CDN_URL}${src}`;
        console.log(`Загрузка изображения: ${fullImagePath}`); // Для отладки
        this._image.src = fullImagePath;
        if (alt) {
            this._image.alt = alt;
        }
        
        // Обработчик ошибок загрузки
        this._image.onerror = () => {
            console.warn(`Не удалось загрузить изображение: ${fullImagePath}`);
        };
    }
}

    protected setPrice(price: number | null) {
        if (this._price) {
            if (price === null) {
                this._price.textContent = 'Бесценно';
            } else {
                this._price.textContent = `${price} синапсов`;
            }
        }
    }

    protected setButton(text: string, disabled: boolean = false) {
        if (this._button) {
            this._button.textContent = text;
            this._button.disabled = disabled;
        }
    }

    protected setDescription(text: string) {
        this.setText(this._description, text);
    }

    protected setText(element: HTMLElement | undefined, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}