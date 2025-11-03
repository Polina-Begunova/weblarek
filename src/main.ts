import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { LarekApi } from "./components/api/LarekApi";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

// Инициализация моделей
const productsModel = new Products();
const basketModel = new Basket();

// Инициализация API
const api = new LarekApi(API_URL);

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

  // Тестирование покупателя с начальными данными
  const buyerWithData = new Buyer({
    payment: "card",
    address: "Тестовый адрес",
    email: "test@example.com",
    phone: "+79999999999",
  });
  console.log("Данные покупателя (с инициализацией):", buyerWithData.getData());
  console.log("Ошибки валидации:", buyerWithData.validate());
  console.log("Данные валидны:", buyerWithData.isValid());

  // Тестирование покупателя без начальных данных
  const emptyBuyer = new Buyer();
  console.log("Пустой покупатель:", emptyBuyer.getData());
  emptyBuyer.setData({
    payment: "cash",
    address: "Новый адрес",
  });
  console.log("После добавления данных:", emptyBuyer.getData());

  emptyBuyer.clear();
  console.log("После очистки:", emptyBuyer.getData());
}

// Получение данных с сервера
async function loadProductsFromServer() {
  try {
    console.log("=== Загрузка данных с сервера ===");
    const products = await api.getProductList();
    productsModel.setItems(products);
    console.log("Товары с сервера:", productsModel.getItems());
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  }
}

// Запуск тестов
testModels();
loadProductsFromServer();
