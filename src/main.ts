import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/api/LarekApi";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// Инициализация моделей
const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer(); // Создаем один экземпляр

// Инициализация API
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi); // Передаем готовый экземпляр

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
loadProductsFromServer();
