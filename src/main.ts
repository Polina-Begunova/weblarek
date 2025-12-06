import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/api/LarekApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";

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

enum AppEvents {
  ProductsChanged = "products:changed",
  ProductSelect = "product:select",
  ProductSelected = "product:selected",
  BasketAdd = "basket:add",
  BasketRemove = "basket:remove",
  BasketChanged = "basket:changed",
  OrderStart = "order:start",
  OrderSubmit = "order:submit",
  OrderSuccess = "order:success",
  BuyerChanged = "buyer:changed",
  ModalClose = "modal:close",
}

class ErrorMessage {
  constructor(private container: HTMLElement) {}

  show(message: string, onClose?: () => void): HTMLElement {
    const errorElement = document.createElement("div");
    errorElement.className = "error";
    errorElement.innerHTML = `
      <div class="error__content">
        <h2 class="error__title">Ошибка оформления заказа</h2>
        <p class="error__text">${message}</p>
        <button class="button error__button">Закрыть</button>
      </div>
    `;

    const closeButton = errorElement.querySelector(".error__button");
    if (closeButton && onClose) {
      closeButton.addEventListener("click", onClose);
    }

    this.container.appendChild(errorElement);
    return errorElement;
  }

  clear(): void {
    const errorElement = this.container.querySelector(".error");
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// DOM элементы
const gallery = ensureElement<HTMLElement>(".gallery");
const basketCounter = ensureElement<HTMLElement>(".header__basket-counter");
const basketButton = ensureElement<HTMLButtonElement>(".header__basket");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// ✅ СОЗДАЕМ КОМПОНЕНТЫ ОДИН РАЗ (не в функциях)
const modal = new Modal(modalContainer);
const errorMessage = new ErrorMessage(modalContainer);

let orderForm: OrderForm;
let contactsForm: ContactsForm;
let successView: Success;
let basketView: BasketView;

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ФОРМАМИ ==========
function initForms() {
  orderForm = new OrderForm(cloneTemplate(orderTemplate), {
    onSubmit: (data: IBuyer) => {
      buyerModel.setData(data);
      const errors = buyerModel.validate();
      const hasOrderErrors = !!(errors.address || errors.payment);

      if (!hasOrderErrors) {
        showContactsForm();
      } else {
        const orderErrors: Record<string, string> = {};
        if (errors.address) orderErrors.address = errors.address;
        if (errors.payment) orderErrors.payment = errors.payment;
        orderForm.setErrors(orderErrors);
      }
    },
    onInputChange: (field: keyof IBuyer, value: string) => {
      buyerModel.setData({ [field]: value });
      const errors = buyerModel.validate();
      const orderErrors: Record<string, string> = {};
      if (errors.address) orderErrors.address = errors.address;
      if (errors.payment) orderErrors.payment = errors.payment;

      if (Object.keys(orderErrors).length > 0) {
        orderForm.setErrors(orderErrors);
      } else {
        orderForm.clearErrors();
      }
    },
  });

  contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), {
    onSubmit: async (data: IBuyer) => {
      buyerModel.setData(data);
      const errors = buyerModel.validate();
      const hasContactErrors = !!(errors.email || errors.phone);

      if (!hasContactErrors) {
        await submitOrder();
      } else {
        const contactErrors: Record<string, string> = {};
        if (errors.email) contactErrors.email = errors.email;
        if (errors.phone) contactErrors.phone = errors.phone;
        contactsForm.setErrors(contactErrors);
      }
    },
    onInputChange: (field: keyof IBuyer, value: string) => {
      buyerModel.setData({ [field]: value });
      const errors = buyerModel.validate();
      const contactErrors: Record<string, string> = {};
      if (errors.email) contactErrors.email = errors.email;
      if (errors.phone) contactErrors.phone = errors.phone;

      if (Object.keys(contactErrors).length > 0) {
        contactsForm.setErrors(contactErrors);
      } else {
        contactsForm.clearErrors();
      }
    },
  });

  basketView = new BasketView(cloneTemplate(basketTemplate), {
    onCheckout: () => {
      showOrderForm();
    },
    onRemove: (id: string) => {
      basketModel.removeItem(id);
    },
  });

  successView = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
      basketModel.clear();
      buyerModel.clear();
      modal.close();
    },
  });
}

function showOrderForm() {
  const buyerData = buyerModel.getData();
  const orderElement = orderForm.render(buyerData);
  modal.render({ content: orderElement });
  modal.open();
}

function showContactsForm() {
  const buyerData = buyerModel.getData();
  const contactsElement = contactsForm.render(buyerData);
  modal.render({ content: contactsElement });
  modal.open();
}

function showBasket() {
  const items = basketModel.getItems();

  if (items.length === 0) {
    const emptyElement = basketView.render({ items: [], total: 0 });
    modal.render({ content: emptyElement });
    modal.open();
    return;
  }

  const basketItems = items.map((item, index) => {
    const basketCard = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: (event: MouseEvent, id: string) => {
        event.preventDefault();
        basketModel.removeItem(id);
      },
    });

    return basketCard.render({
      ...item,
      index,
      id: item.id,
    });
  });

  const basketElement = basketView.render({
    items: basketItems,
    total: basketModel.getTotal(),
  });

  modal.render({ content: basketElement });
  modal.open();
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Загрузка товаров с сервера
events.on(AppEvents.ProductsChanged, (data: { items: IProduct[] }) => {
  const products = data.items;
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        productsModel.setSelectedItem(product);
      },
    });
    return card.render({
      ...product,
      image: product.image,
    });
  });
  gallery.replaceChildren(...cards);
});

// Показ деталей товара (теперь срабатывает из модели)
events.on(AppEvents.ProductSelected, (data: { item: IProduct }) => {
  const product = data.item;
  const inBasket = basketModel.contains(product.id);

  const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      if (product.price !== null) {
        if (inBasket) {
          basketModel.removeItem(product.id);
        } else {
          basketModel.addItem(product);
        }
        modal.close();
      }
    },
  });

  const cardElement = previewCard.render({
    ...product,
    image: product.image,
  });

  previewCard.setBasketState(inBasket);
  modal.render({ content: cardElement });
  modal.open();
});

// Обновление счетчика корзины
events.on(AppEvents.BasketChanged, () => {
  basketCounter.textContent = basketModel.getCount().toString();

  // Если корзина открыта - обновляем её содержимое
  if (modal.isOpen()) {
    const currentContent = modal.getContent();
    if (currentContent && currentContent.classList.contains("basket")) {
      showBasket();
    }
  }
});

// Обновление состояния кнопок при изменении данных покупателя
events.on(AppEvents.BuyerChanged, () => {
  const errors = buyerModel.validate();
  const orderValid = !errors.address && !errors.payment;
  const contactsValid = !errors.email && !errors.phone;

  orderForm.setValid(orderValid);
  contactsForm.setValid(contactsValid);
});

// Открытие корзины по кнопке в хедере
basketButton.addEventListener("click", () => {
  showBasket();
});

// ========== ОСНОВНЫЕ ФУНКЦИИ ==========

async function submitOrder() {
  try {
    const orderData: IOrder = {
      ...buyerModel.getData(),
      total: basketModel.getTotal(),
      items: basketModel.getItems().map((item) => item.id),
    };

    const result = await api.createOrder(orderData);

    // Показываем успешное окно
    const successElement = successView.render({
      total: result.total,
    });
    modal.render({ content: successElement });
    modal.open();

    // Очищаем модели
    basketModel.clear();
    buyerModel.clear();
  } catch (error) {
    console.error("Order error:", error);
    errorMessage.show(
      "Произошла ошибка при оформлении заказа. Попробуйте еще раз",
      () => {
        modal.close();
        errorMessage.clear();
      }
    );
  }
}

async function loadProducts() {
  try {
    const products = await api.getProductList();
    productsModel.setItems(products);
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
    errorMessage.show(
      "Не удалось загрузить товары. Пожалуйста, обновите страницу",
      () => {
        errorMessage.clear();
      }
    );
  }
}

// ========== ЗАПУСК ПРИЛОЖЕНИЯ ==========
initForms();
loadProducts();
