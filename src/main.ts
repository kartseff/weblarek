import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardCart } from './components/views/CardCart';
import { CartView } from './components/views/CartView';
import { FormOrder } from './components/views/FormOrder';
import { FormContacts } from './components/views/FormContacts';
import { Success } from './components/views/Success';
import { EventEmitter } from './components/base/Events';
import { ApiService } from './components/communication/ApiService';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrderPayload, IProduct} from './types';

const events = new EventEmitter();

const apiUrl = new Api(API_URL);
const apiService = new ApiService(apiUrl);
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const headerContainer = ensureElement<HTMLElement>('.header');
const mainContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

const header = new Header(headerContainer, events);
const gallery = new Gallery(mainContainer, events);
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cartView = new CartView(cloneTemplate(cartTemplate), {
    onClick: () => {
        events.emit('orderForm:open');
    },
});

const formOrder = new FormOrder(cloneTemplate(orderTemplate), events, {
    onPaymentChange: (payment: string) => {
        buyerModel.setPayment(payment as 'card' | 'cash');
        validateFormOrder();
    },
    onAddressChange: (address: string) => {
        buyerModel.setAddress(address);
        validateFormOrder();
    },
    onNextForm: () => {
        events.emit('contactsForm:open');
    }
});

const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events, {
    onEmailChange: (email: string) => {
        buyerModel.setEmail(email);
        validateFormContacts();
    },
    onPhoneChange: (phone: string) => {
        buyerModel.setPhone(phone);
        validateFormContacts();
    },
    onOrderDone: () => {
        events.emit('order:done');
    }
});

function validateFormOrder() {
    let error = '';
    let valid = true;

    if (buyerModel.validate().payment) {
        valid = false;
        error += `${buyerModel.validate().payment} `;
    }

    if (buyerModel.validate().address) {
        valid = false;
        error += `${buyerModel.validate().address}`;
    }

    formOrder.render({ error, valid });
}

function validateFormContacts() {
    let error = '';
    let valid = true;

    if (buyerModel.validate().email) {
        valid = false;
        error += `${buyerModel.validate().email} `;
    }

    if (buyerModel.validate().phone) {
        valid = false;
        error += `${buyerModel.validate().phone}`;
    }

    formContacts.render({ error, valid });
}

(async () => {
    try {
        const response = await apiService.fetchProducts();
        productsModel.setItems(response.items);
    } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
    }
})();

// Изменение каталога товаров

events.on('products:changed', () => {
    const itemCards = productsModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    });

    gallery.render({ catalog: itemCards });
})

// Изменение выбранного товара (предпросмотр)

events.on('card:select', (item: IProduct) => {
    const isAvailable = item.price !== null;
    const isInCart = cartModel.hasItem(item.id);

    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:buttonAction', item),
    });

    modal.content = cardPreview.render({
        ...item,
        isInCart,
        isAvailable
    });
    modal.open();
});

// Действие кнопки товара в превью

events.on('card:buttonAction', (item: IProduct) => {
    const isInCart = cartModel.hasItem(item.id);

    if (isInCart) {
        cartModel.removeItem(item.id);
    } else {
        cartModel.addItem(item);
    }

    modal.close();
})

// Изменение содержимого корзины

events.on('cart:changed', () => {
    const total = cartModel.getTotal();
    const isEmpty = cartModel.getCount() === 0;
    const counter = cartModel.getCount();

    const content = cartModel.getItems().map((item, index) => {
        const card = new CardCart(cloneTemplate(cardCartTemplate), {
            onClick: () => cartModel.removeItem(item.id),
        });

        const itemIndex = index + 1;

        return card.render({ ...item, itemIndex });
    });

    header.render({ counter });
    cartView.render({ content, total, isEmpty});
});

// Открытие корзины

events.on('basket:open', () => {
    modal.content = cartView.render();
    modal.open();
});

// Показывает форму оплаты

events.on('orderForm:open', () => {
    validateFormOrder();
    modal.content = formOrder.render();
});

// Закрепляет выбранный способ оплаты

events.on('payment:selected', (button: HTMLButtonElement) => {
    formOrder.paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
    button.classList.add('button_alt-active');
    formOrder.selectedPayment = button.getAttribute('name') || '';
})

// Показывает форму контанктов

events.on('contactsForm:open', () => {
    validateFormContacts();
    modal.content = formContacts.render();
})

// Завершение заказа

events.on('order:done', () => {
    const buyer = buyerModel.getBuyerData();
    const cartItems = cartModel.getItems();

    const orderData: IOrderPayload = {
        payment: buyer.payment,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        total: cartModel.getTotal(),
        items: cartItems.map((item) => item.id),
    };

    const success = new Success(cloneTemplate(successTemplate), events);
    const total = orderData.total;

    (async () => {
        try {
            await apiService.sendOrder(orderData);
            modal.content = success.render({ total });
        } catch (err) {
            console.error('Ошибка при отправке заказа:', err);
        }
    })();

    const counter = 0;

    cartModel.clearBasket();
    buyerModel.clearBuyerData();
    header.render({ counter });
})

// Закрытие экрана успеха

events.on('success:close', () => {
    modal.close();
});
