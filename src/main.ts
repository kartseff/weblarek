import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';
import { ApiService } from './components/communication/ApiService';

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', productsModel.getItems())

const firstProduct = productsModel.getProduct(apiProducts.items[0].id);
console.log('Товар по ID:', firstProduct);

productsModel.setPreview(apiProducts.items[0]);
console.log('Выбранный товар для просмотра:', productsModel.getPreview());

// Тест Cart
const cartModel = new Cart();
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Сумма корзины:', cartModel.getTotal());
console.log('Товар в корзине?', cartModel.hasItem(apiProducts.items[0].id));

cartModel.removeItem(apiProducts.items[1].id);
console.log('После удаления товара:', cartModel.getItems());

// Тест Buyer
const buyerModel = new Buyer();
buyerModel.setPayment('card');
buyerModel.setAddress('ул. Пушкина, д. 1');
buyerModel.setEmail('user@example.com');
buyerModel.setPhone('+79001234567');
console.log('Данные покупателя:', buyerModel.getBuyerData());
console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.clearBuyerData();
console.log('После очистки:', buyerModel.getBuyerData());
console.log('Ошибки валидации:', buyerModel.validate());

const apiService = new ApiService();

(async () => {
    try {
        const response = await apiService.fetchProducts();
        productsModel.setItems(response.items);
        console.log('Каталог товаров из сервера:', productsModel.getItems());
    } catch (err) {
        console.error('Ошибка при загрузке каталога:', err);
    }
})();