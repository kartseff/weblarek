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
import { ensureElement } from './utils/utils';
import { IProduct, IProductsChangedData, IPreviewChangedData, ICartChangedData, IOrderPayload, ICartItem } from './types';
import { CDN_URL } from './utils/constants';

const events = new EventEmitter();
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer, events);
const modal = new Modal(modalContainer, events);

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const apiService = new ApiService();

// ============= PRESENTER (ОБРАБОТЧИКИ СОБЫТИЙ) =============

// === Загрузка каталога ===
(async () => {
	try {
		const response = await apiService.fetchProducts();
		productsModel.setItems(response.items);
	} catch (err) {
		console.error('Ошибка загрузки каталога:', err);
	}
})();

// === ОБРАБОТЧИК: Изменение каталога товаров ===
events.on<IProductsChangedData>('products:changed', ({ products }) => {
	const cards = products.map((product: IProduct) => {
		const cardElement = cardTemplate.content.cloneNode(true) as HTMLElement;
		
		const card = new CardCatalog(cardElement as HTMLElement, {
			onClick: () => {
				productsModel.setPreview(product);
			}
		});

		card.title = product.title;
		card.price = product.price;
		card.image = `${CDN_URL}${product.image}`;
		card.category = product.category;

		return card.render();
	});

	gallery.catalog = cards;
});

// === ОБРАБОТЧИК: Изменение выбранного товара (preview) ===
events.on<IPreviewChangedData>('preview:changed', ({ preview }) => {
	if (preview) {
		// Клонируем темплейт
		const cardElement = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
		
		// Создаём экземпляр
		const card = new CardPreview(cardElement as HTMLElement, {
			onAddToCart: () => {
				cartModel.addItem(preview);
				modal.close();
			},
			onRemoveFromCart: () => {
				cartModel.removeItem(preview.id);
				modal.close();
			}
		});

		card.title = preview.title;
		card.price = preview.price;
		card.image = `${CDN_URL}${preview.image}`;
		card.category = preview.category;
		card.description = preview.description;

		modal.content = card.render();
		modal.open();
	}
});


// === События МОДЕЛИ: Изменение содержимого корзины ===
let currentCartView: CartView | null = null;

events.on<ICartChangedData>('cart:changed', ({ count, total }) => {
	header.render({ counter: count });

	if (currentCartView) {
		const cartItems = cartModel.getItems();
		const cartCards = cartItems.map((item, index) => {
			const cardElement = document.createElement('div');
			const card = new CardCart(
				cardElement,
				{
					onRemove: () => {
						cartModel.removeItem(item.id);
					}
				}
			);
			return card.render({
				title: item.title,
				price: item.price,
				index: index + 1
			});
		});

		currentCartView.render({
			content: cartCards,
			total: total
		});
	}
});

// === События VIEW: Открытие корзины ===
events.on('basket:open', () => {
	const cartElement = cartTemplate.content.cloneNode(true) as HTMLElement;
	currentCartView = new CartView(cartElement as HTMLElement, {  // ✅ Сохраняем!
		onCheckout: () => {
			showOrderForm();
		}
	});

	// Получаем товары из корзины и создаём карточки
	const cartItems = cartModel.getItems();
	const cartCards = cartItems.map((item, index) => {
		const cardElement = document.createElement('div');
		const card = new CardCart(
			cardElement,
			{
				onRemove: () => {
					cartModel.removeItem(item.id);
				}
			}
		);
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1
		});
	});

	currentCartView.render({
		content: cartCards,
		total: cartModel.getTotal()
	});

	modal.render({ content: cartElement });
	modal.open();
});

// === Показ формы оплаты ===
function showOrderForm() {
	const orderElement = orderTemplate.content.cloneNode(true) as HTMLElement;
	const formElement = orderElement.querySelector('form') as HTMLFormElement;
	
	const formOrder = new FormOrder(formElement, {
		onPaymentChange: (payment) => buyerModel.setPayment(payment as 'card' | 'cash'),
		onAddressChange: (address) => buyerModel.setAddress(address)
	});

	formOrder.render({ errors: '' });

	formElement.addEventListener('submit', (e) => {
		e.preventDefault();
		const errors = buyerModel.validate();
		if (Object.keys(errors).length === 0) {
			showContactsForm();
		} else {
			formOrder.render({ errors: Object.values(errors).join('; ') });
		}
	});

	modal.render({ content: orderElement });
}


// === Показ формы контактов ===
function showContactsForm() {
	const contactsElement = contactsTemplate.content.cloneNode(true) as HTMLElement;
	const formContacts = new FormContacts(
		contactsElement as HTMLElement,
		{
			onEmailChange: (email) => buyerModel.setEmail(email),
			onPhoneChange: (phone) => buyerModel.setPhone(phone)
		}
	);

	formContacts.render({ errors: '' });

	// Слушаем submit на форме
	contactsElement.addEventListener('submit', (e) => {
		e.preventDefault();
		const errors = buyerModel.validate();
		if (Object.keys(errors).length === 0) {
			submitOrder();
		} else {
			formContacts.render({ errors: Object.values(errors).join('; ') });
		}
	});

	modal.render({ content: contactsElement });
}

// === Отправка заказа ===
async function submitOrder() {
	try {
        const cartItems: ICartItem[] = cartModel.getItems().map(product => ({
			productId: product.id,
			quantity: 1
		}));

		const orderData: IOrderPayload = {
			items: cartItems,
			totalPrice: cartModel.getTotal(),
			buyer: buyerModel.getBuyerData()
		};

		await apiService.sendOrder(orderData);

		// Показываем экран успеха
		const successElement = successTemplate.content.cloneNode(true) as HTMLElement;
		const success = new Success(
			successElement as HTMLElement,
			events
		);

		modal.render({
			content: success.render({
				total: cartModel.getTotal()
			})
		});

		// Очищаем данные
		cartModel.clearBasket();
		buyerModel.clearBuyerData();
	} catch (err) {
		console.error('Ошибка при отправке заказа:', err);
	}
}


// === События VIEW: Закрытие модального окна ===
events.on('modal:close', () => {
	currentCartView = null;
});

// === События VIEW: Закрытие экрана успеха ===
events.on('success:close', () => {
	modal.close();
});
