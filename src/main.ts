import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/api/LarekApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";

// Импорты компонентов View
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Basket as BasketView } from "./components/view/Basket";
import { Success } from "./components/view/Success";
import { Modal } from "./components/view/Modal";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, IOrder, IBuyer } from "./types";

// Инициализация  EventEmitter и моделей
const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events); // Создаем один экземпляр

// Функции для обновления ошибок валидации
const updateOrderFormValidation = () => {
    const errors = buyerModel.validate();
    const orderForm = document.querySelector('.order .form__errors') as HTMLElement;
    if (orderForm) {
        const errorMessages = Object.values(errors)
            .filter(msg => msg && (msg.includes('адрес') || msg.includes('оплат')))
            .filter(Boolean);
        orderForm.textContent = errorMessages.join(', ');
    }
};

const updateContactsFormValidation = () => {
    const errors = buyerModel.validate();
    const contactsForm = document.querySelector('.contacts .form__errors') as HTMLElement;
    if (contactsForm) {
        const errorMessages = Object.values(errors)
            .filter(msg => msg && (msg.includes('email') || msg.includes('телефон')))
            .filter(Boolean);
        contactsForm.textContent = errorMessages.join(', ');
    }
};
const updateFormButtons = () => {
    const orderSubmit = document.querySelector('.order button[type="submit"]') as HTMLButtonElement;
    const contactsSubmit = document.querySelector('.contacts button[type="submit"]') as HTMLButtonElement;
    
    if (orderSubmit) {
        orderSubmit.disabled = !buyerModel.isOrderDataValid();
    }
    if (contactsSubmit) {
        contactsSubmit.disabled = !buyerModel.isValid();
    }
};

// Обновляем при изменении данных покупателя
events.on('buyer:changed', () => {
    updateOrderFormValidation();
    updateContactsFormValidation();
    updateFormButtons();
});

// Инициализация API
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi); // Передаем готовый экземпляр
// Получаем DOM элементы
const gallery = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');

// Создаем компоненты
const modal = new Modal(modalContainer);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Загрузка товаров с сервера
events.on('products:changed', () => {
    const products = productsModel.getItems();
    const cards = products.map(product => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: (event: MouseEvent) => {
                event.preventDefault();
                events.emit('product:select', { product });
            }
        });
        return card.render({
            ...product,
            image: product.image
        });
    });
    gallery.replaceChildren(...cards);
});

// Выбор товара для просмотра
events.on('product:select', (data: { product: IProduct }) => {
    productsModel.setSelectedItem(data.product);
});

// Показ деталей товара в модальном окне
events.on('product:selected', (data: { item: IProduct }) => {
    const product = data.item;
    const inBasket = basketModel.contains(product.id);
    
    const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: (event: MouseEvent) => {
            event.preventDefault();
            if (product.price !== null) {
                if (inBasket) {
                    events.emit('basket:remove', { product });
                } else {
                    events.emit('basket:add', { product });
                }
                modal.close();
            }
        }
    });
    
    const cardElement = previewCard.render({
        ...product,
        image: product.image
    });
    
    previewCard.setBasketState(inBasket);
    
    modal.render({ content: cardElement });
    modal.open();
});

// Добавление товара в корзину
events.on('basket:add', (data: { product: IProduct }) => {
    basketModel.addItem(data.product);
});

// Удаление товара из корзины
events.on('basket:remove', (data: { product: IProduct }) => {
    basketModel.removeItem(data.product.id);
});

// Обновление счетчика корзины
events.on('basket:changed', () => {
    // Обновляем счетчик
    basketCounter.textContent = basketModel.getCount().toString();
    
    // Если корзина открыта - обновляем её содержимое
    if (modal.container.classList.contains('modal_active')) {
        const currentContent = modal.container.querySelector('.basket');
        if (currentContent) {
            // Обновляем корзину без закрытия
            events.emit('basket:open');
        }
    }
});

// Открытие корзины
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// Показ корзины
events.on('basket:open', () => {
    const items = basketModel.getItems();
    
    if (items.length === 0) {
        // Показываем сообщение о пустой корзине
        const emptyBasket = document.createElement('div');
        emptyBasket.className = 'basket';
        emptyBasket.innerHTML = `
            <h2 class="modal__title">Корзина</h2>
            <p>Корзина пуста</p>
        `;
        modal.render({ content: emptyBasket });
        modal.open();
        return;
    }
    
    const basketItems = items.map((item, index) => {
        const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: (event: MouseEvent) => {
                event.preventDefault();
                events.emit('basket:remove', { product: item });
            }
        });
        
        return basketCard.render({
            ...item,
            index
        });
    });
    
    const basketView = new BasketView(cloneTemplate(basketTemplate), {
        onCheckout: () => {
            events.emit('order:start');
        },
        onRemove: (_id: string) => {

    }
    });
    
    const basketElement = basketView.render({
        items: basketItems,
        total: basketModel.getTotal()
    });
    
    modal.render({ content: basketElement });
    modal.open();
});
    
    
// Начало оформления заказа
events.on('order:start', () => {
    const orderForm = new OrderForm(cloneTemplate(orderTemplate), {
        onSubmit: (data: IBuyer) => {
            buyerModel.setData(data);
            // Используем частичную валидацию только для заказа
            if (buyerModel.isOrderDataValid()) {
                events.emit('order:submit');
            } else {
                updateOrderFormValidation(); 
            }
        },
        onInputChange: (field: keyof IBuyer, value: string) => {
            buyerModel.setData({ [field]: value });
            updateOrderFormValidation();
        }
    });
    // Восстанавливаем сохраненные данные
    const buyerData = buyerModel.getData();
    const orderElement = orderForm.render(buyerData);
    
    modal.render({ content: orderElement });
    modal.open();
});
  
// Отправка заказа (переход к контактам)
events.on('order:submit', () => {
    const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), {
        onSubmit: async (data: IBuyer) => {
            buyerModel.setData(data);
            if (buyerModel.isValid()) {
                await submitOrder();
            } else {
                updateContactsFormValidation();
            }
        },
        onInputChange: (field: keyof IBuyer, value: string) => {
            buyerModel.setData({ [field]: value });
            updateContactsFormValidation();
        }
    });
    
    // Восстанавливаем сохраненные данные
    const buyerData = buyerModel.getData();
    const contactsElement = contactsForm.render(buyerData);
    
    modal.render({ content: contactsElement });
});

// Обработчик успешной отправки заказа
events.on('order:success', (data: { total: number }) => {
    // Показываем успешное сообщение
    const successView = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            // Очищаем корзину и данные покупателя
            basketModel.clear();
            buyerModel.clear();
            modal.close();
        }
    });
    
    const successElement = successView.render({
        total: data.total
    });
    
    modal.render({ content: successElement });
});

// Финальная отправка заказа
async function submitOrder() {
    try {
        const orderData: IOrder = {
            ...buyerModel.getData(),
            total: basketModel.getTotal(),
            items: basketModel.getItems().map(item => item.id)
        };
        
        const result = await api.createOrder(orderData);
        
        // Очищаем корзину и данные покупателя ПОСЛЕ успешного заказа
        basketModel.clear();
        buyerModel.clear();
        
        // Показываем успешное сообщение
        events.emit('order:success', { total: result.total });
        
    } catch (error) {
        console.error('Order error:', error);
        // Показываем ошибку пользователю
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = `
            <h2>Ошибка оформления заказа</h2>
            <p>Попробуйте еще раз</p>
            <button class="button" onclick="this.closest('.modal').querySelector('.modal__close').click()">Закрыть</button>
        `;
        modal.render({ content: errorElement });
    }
}

// Загрузка товаров при старте приложения
async function loadProducts() {
    try {
        console.log('Загрузка товаров с сервера...');
        const products = await api.getProductList();
        
        // Проверьте пути к изображениям
        console.log('Полученные товары с сервера:');
        products.forEach(product => {
            console.log(`Товар: ${product.title}, Изображение: ${product.image}`);
        });
        
        productsModel.setItems(products);
        console.log('Товары загружены:', products.length);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}
// Запуск приложения
loadProducts();


/*
// Тестирование моделей данных
function testModels() {
  console.log("=== Тестирование моделей данных ===");

  // Тестирование каталога товаров
  productsModel.setItems(apiProducts.items);
  console.log("Каталог товаров:", productsModel.getItems());

  const testProduct = productsModel.getItem(apiProducts.items[0].id);
  console.log("Тестовый товар по ID:", testProduct);

  productsModel.setSelectedItem(apiProducts.items[0]);
  console.log("Выбранный товар:", productsModel.getSelectedItem());

  // Тестирование корзины
  basketModel.addItem(apiProducts.items[0]);
  basketModel.addItem(apiProducts.items[1]);
  console.log("Товары в корзине:", basketModel.getItems());
  console.log("Общая стоимость корзины:", basketModel.getTotal());
  console.log("Количество товаров в корзине:", basketModel.getCount());
  console.log(
    "Содержит товар ID1:",
    basketModel.contains(apiProducts.items[0].id)
  );

  basketModel.removeItem(apiProducts.items[0].id);
  console.log("После удаления товара:", basketModel.getItems());

  // Тестирование покупателя
  console.log("=== Тестирование покупателя ===");

  // Начальное состояние (пустой покупатель)
  console.log("Начальные данные покупателя:", buyerModel.getData());
  console.log("Валидность начальных данных:", buyerModel.isValid());
  console.log("Ошибки валидации начальных данных:", buyerModel.validate());

  // Сохраняем один параметр (как в реальном приложении)
  buyerModel.setData({
    address: "Тестовый адрес доставки",
  });
  console.log("После установки адреса:", buyerModel.getData());
  console.log("Ошибки валидации после адреса:", buyerModel.validate());
  console.log("Валидность после адреса:", buyerModel.isValid());

  // Добавляем остальные данные
  buyerModel.setData({
    payment: "card",
    email: "test@example.com",
    phone: "+79999999999",
  });
  console.log("Полные данные покупателя:", buyerModel.getData());
  console.log("Ошибки валидации полных данных:", buyerModel.validate());
  console.log("Валидность полных данных:", buyerModel.isValid());

  // Очистка данных
  buyerModel.clear();
  console.log("После очистки:", buyerModel.getData());
}

// Получение данных с сервера
async function loadProductsFromServer() {
  try {
    console.log("=== Загрузка данных с сервера ===");
    const products = await api.getProductList();
    productsModel.setItems(products);
    console.log("Товары с сервера:", productsModel.getItems());

    // Проверка работы с товарами
    if (products.length > 0) {
      const firstProductId = products[0].id;
      console.log(
        "Товар по id с сервера:",
        productsModel.getItem(firstProductId)
      );
      console.log("Категория первого товара:", products[0].category);
      console.log("Цена первого товара:", products[0].price);
    }
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  }
}

// Запуск тестов
testModels();
loadProductsFromServer(); */