import './scss/styles.scss';
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

const apiService = new ApiService();

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
    let isInCart = cartModel.hasItem(item.id);

    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (isInCart) {
                cartModel.removeItem(item.id);
            } else {
                cartModel.addItem(item);
            }
            modal.close();
        },
    });

    modal.content = card.render({
        ...item,
        isInCart,
        isAvailable
    });   
    modal.open();
});

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
    const formOrder = new FormOrder(cloneTemplate(orderTemplate), {
        onPaymentChange: (payment: string) => {
            validate();
            buyerModel.setPayment(payment as 'card' | 'cash');
        },
        onAddressChange: (address: string) => {
            validate();
            buyerModel.setAddress(address);
        },
        onNextForm: () => {
            events.emit('contactsForm:open');
        }
    });

    function validate() {
        let error = '';
        let valid = false;
        const payment = formOrder.selectedPayment;
        const address = formOrder.addressInput.value.trim();

        if (!payment && !address) {
            error = 'Необходимо выбрать способ оплаты и указать адрес';
        } else if (!payment) {
            error = 'Необходимо выбрать способ оплаты';
        } else if (!address) {
            error = 'Необходимо указать адрес';
        } else {
            valid = true;
        }

        formOrder.render({ error, valid });
    }

    validate();
    modal.content = formOrder.render();
});

// Показывает форму контанктов

events.on('contactsForm:open', () => {
    const formContacts = new FormContacts(cloneTemplate(contactsTemplate), {
        onEmailChange: (email: string) => {
            validate();
            buyerModel.setEmail(email);
        },
        onPhoneChange: (phone: string) => {
            validate();
            buyerModel.setPhone(phone);
        },
        onOrderDone: () => {
            events.emit('order:done');
        }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /\d{11,}/;

    function validate() {
        let error = '';
        let valid = false;
        const email = formContacts.emailInput.value.trim();
        const phone = formContacts.phoneInput.value.trim();

        if (!email && !phone) {
            error = 'Необходимо ввести email и номер телефона';
        } else if (!email) {
            error = 'Необходимо ввести email';
        } else if (!phone) {
            error = 'Необходимо ввести номер телефона';
        } else if (!emailRegex.test(email) && !phoneRegex.test(phone.replace(/\D/g, ''))) {
            error = 'Введите корректные email и номер телефона';
        } else if (!emailRegex.test(email)) {
            error = 'Введите корректный email';
        } else if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            error = 'Введите корректный номер телефона';
        } else {
            valid = true;
        }

        formContacts.render({ error, valid });
    }

    validate();
    modal.content = formContacts.render();
})

// Завершение заказа

events.on('order:done', () => {
    const buyer = buyerModel.getBuyerData();
    const cartItems = cartModel.getItems();

    const orderData: IOrderPayload = {
        items: cartItems.map((item) => ({
            productId: item.id,
            quantity: 1,
        })),
        totalPrice: cartModel.getTotal(),
        buyer: {
            payment: buyer.payment,
            address: buyer.address,
            email: buyer.email,
            phone: buyer.phone,
        },
    };

    const success = new Success(cloneTemplate(successTemplate), events);
    const total = cartModel.getTotal();
    
    modal.content = success.render({ total });

    (async () => {
        try {
            await apiService.sendOrder(orderData);
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
