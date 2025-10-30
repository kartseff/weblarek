# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Интерфейс IProduct
Интерфейс для учета используемых товаров.

interface IProduct {
  id: string - Уникальный идентификатор товара
  description: string - Описание товара
  image: string - Ссылка на изображение товара
  title: string - Название товара
  category: string - Категория товара
  price: number | null - Цена товара (null — если товар недоступен для покупки)
}

### Интерфейс IBuyer
Описывает данные покупателя при оформлении заказа.

interface IBuyer {
  payment: 'card' | 'cash' | '' - Способ оплаты: карта, наличные, а также может быть еще не указан
  email: string - Email покупателя
  phone: string - Телефон покупателя
  address: string - Адрес доставки
}

### Интерфейс ICartItem
Интерфейс описывает одну позицию в корзине.

interface ICartItem {
  productId: string — идентификатор товара  
  quantity: number — количество единиц товара  
}

### Интерфейс IOrderPayload
Интерфейс описывает данные, отправляемые на сервер при оформлении заказа.

interface IOrderPayload {
  items: ICartItem[] — массив позиций корзины  
  totalPrice: number — общая сумма заказа  
  buyer: IBuyer — данные покупателя  
}

### Интерфейс IValidationErrors
Интерфейс описывает ошибки валидации, если такие возникнут.

interface IValidationErrors {
  payment?: string - описание ошибки вида оплаты
  address?: string - описание ошибки адреса
  email?: string - описание ошибки email
  phone?: string - описание ошибки телефона
}

## Модели данных

### Класс Products
Отвечает за хранение и работу с каталогом товаров. Хранит массив всех товаров и предоставляет методы для управления этим массивом.

Конструктор:
`constructor(protected events: IEvents)` - Принимает экземпляр системы действий.

Поля класса:  
`protected items: IProduct[]` — массив всех товаров
`protected preview: IProduct | null` — выбранная карточка для подробного просмотра

Методы:
`setItems(items: IProduct[]): void` — сохраняет массив товаров
`getItems(): IProduct[]` — возвращает массив товаров
`getProduct(id: string): IProduct | undefined` — получает товар по id, возвращает undefined, если не найден
`setPreview(item: IProduct): void` — сохраняет выбранную карточку
`getPreview(): IProduct | null` — возвращает выбранную карточку

### Класс Cart
Управляет корзиной — хранит выбранные для покупки товары. Хранит массив товаров пользователя и предоставляет методы добавления, удаления, проверки и подсчета.

Конструктор:
`constructor(protected events: IEvents)` - Принимает экземпляр системы действий.

Поля класса:
`protected items: IProduct[]` — массив товаров, добавленных в корзину (может быть пустым)

Методы:
`getItems(): IProduct[]` — возвращает массив товаров в корзине
`addItem(item: IProduct): void` — добавляет товар в корзину
`removeItem(id: string): void` — удаляет товар из корзины по id
`clearBasket(): void` — очищает корзину
`getTotal(): number` — возвращает сумму стоимости всех товаров
`getCount(): number` — возвращает количество товаров в корзине
`hasItem(id: string): boolean` — проверяет наличие товара в корзине по id

### Класс Buyer
Отвечает за управление, хранение, валидацию и очистку данных покупателя. Хранит данные, которые вводит пользователь при оформлении заказа, и проверяет их корректность.

Конструктор:
`constructor(protected events: IEvents)` - Принимает экземпляр системы действий.

Поля класса:
`protected payment: 'card' | 'cash' | ''` — вид оплаты
`protected address: string` — адрес доставки
`protected phone: string` — телефон покупателя
`protected email: string` — email покупателя

Методы:
`setPayment(payment: 'card' | 'cash' | ''): void` — сохранить вид оплаты
`setAddress(address: string): void` — сохранить адрес доставки
`setPhone(phone: string): void` — сохранить телефон
`setEmail(email: string): void` — сохранить email
`getBuyerData(): IBuyer` — получить все данные покупателя
`clearBuyerData(): void` — сбросить все поля
`validate(): IValidationErrors` — проверить валидность всех полей, вернуть объект с ошибками, вернуть объект ошибок вида { payment?: string; address?: string; email?: string; phone?: string }, отсутствие свойства означает, что поле прошло валидацию

## Слой коммуникации

### Интерфейс IApi
Интерфейс клиента для выполнения HTTP-запросов.

interface IApi {
  get<T>(path: string): Promise<T> - выполняет GET-запрос по пути `path`, возвращает данные типа T
  post<T, U>(path: string, payload: T): Promise<U> - выполняет POST-запрос по пути `path` с телом `payload` типа T, возвращает данные типа U
}

### Интерфейс IProductResponse
Интерфейс описывает ответ сервера на GET /product/.

interface IProductResponse {
  items: IProduct[] — массив товаров
}

### Интерфейс IOrderPayload
Интерфейс описывает данные, отправляемые на сервер при оформлении заказа.

interface IOrderPayload {
  items: ICartItem[] — массив позиций корзины
  totalPrice: number — общая сумма заказа
  buyer: IBuyer — данные покупателя
}

### Интерфейс IOrderResponse
Интерфейс описывает ответ сервера на POST /order/.

interface IOrderResponse {
  orderId: string — идентификатор созданного заказа
}

### Класс ApiService
Отвечает за взаимодействие с сервером «Веб-Ларёк». Он инкапсулирует методы получения каталога товаров и отправки заказа, используя готовый клиент Api из стартового набора.

Конструктор:
`constructor(apiClient: IApi = new Api(import.meta.env.VITE_API_ORIGIN))` - принимает экземпляр клиента Api, базовый URL из .env.

Поля класса:
`protected apiClient: IApi` — экземпляр клиента Api

Методы:
`async fetchProducts(): Promise<IProductResponse>` — GET /product/. Возвращает объект { items: IProduct[] }
`async sendOrder(payload: IOrderPayload): Promise<IOrderResponse>` - POST /order/. Отправляет payload, возвращает { orderId: string }

## Слой Представления

### Интерфейс ICard
Интерфейс для рендера общих данных карточек

interface ICard {
	title: string;
	price: number | null;
}

### Интерфейс ICardCart
Интерфейс для рендера данных карточек в корзине

interface ICardCart extends ICard {
	itemIndex: number;
}

### Интерфейс ICardCatalog
Интерфейс для рендера данных карточек в каталоге

interface ICardCatalog extends ICard {
	image: string;
	category: string;
}

### Интерфейс ICardActions
Интерфейс для типизации события в карточках

interface ICardActions {
	onClick?: () => void;
}

### Интерфейс ICardPreview
Интерфейс для рендера данных карточек в превью

interface ICardPreview extends ICard {
	image: string;
	description: string;
	category: string;
	isInCart: boolean;
	isAvailable: boolean;
}

### Тип CategoryKey
Тип для типизации категорий из коллекции categoryMap

type CategoryKey = keyof typeof categoryMap;

### Интерфейс ICartView
Интерфейс для рендера корзины

interface ICartView {
	content: HTMLElement[];
  total: number;
	isEmpty: boolean;
}

### Интерфейс ICartViewActions
Интерфейс для типизации события в корзине

interface ICartViewActions {
	onClick?: () => void;
}

### Интерфейс IFormState
Интерфейс для рендера форм

interface IFormState {
	error: string;
	valid: boolean;
}

### Интерфейс IFormContactsActions
Интерфейс для типизации событий в форме контактов

interface IFormContactsActions {
  onEmailChange?: (email: string) => void;
  onPhoneChange?: (phone: string) => void;
  onOrderDone?: () => void;
}

### Интерфейс IFormOrderActions
Интерфейс для типизации событий в форме оплаты

interface IFormOrderActions {
  onPaymentChange?: (payment: string) => void;
  onAddressChange?: (address: string) => void;
  onNextForm?: () => void;
}

### Интерфейс IGallery
Интерфейс для рендера каталога товаров

interface IGallery {
    catalog: HTMLElement[];
}

### Интерфейс IHeader
Интерфейс для рендера шапки

interface IHeader {
    counter: number;
}

### Интерфейс IModal
Интерфейс для рендера модального окна

interface IModal {
    content: HTMLElement;
}

### Интерфейс ISuccess
Интерфейс для рендера экрана успеха

interface ISuccess {
    total: number;
}

### Класс Modal extends Component<IModal>
Модальное окно — контейнер для отображения различного содержимого. Отображает содержимое (компоненты) в модальном окне с возможностью открытия/закрытия.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент модального окна из index.html и экземпляр системы событий

Поля класса:
`protected closeButton: HTMLButtonElement` — кнопка закрытия (крестик)
`protected contentElement: HTMLElement` — контент модального окна

Методы:
`open(): void` — открыть модальное окно (добавить класс active)
`close(): void` — закрыть модальное окно (удалить класс active)
`set content(item: HTMLElement)` — установить содержимое

### Класс Header extends Component<IHeader>
Шапка страницы с кнопкой корзины и счетчиком товаров. Отображает иконку корзины с количеством выбранных товаров.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент заголовка из index.html и экземпляр системы событий

Поля класса:
`protected basketButton: HTMLButtonElement` — кнопка корзины
`protected counterElement: HTMLElement` — элемент счетчика

Методы:
`set counter(value: number)` — установить счетчик (отобразить количество товаров)

### Класс Gallery extends Component<IGallery>
Каталог товаров на главной странице. Отображает список карточек товаров в виде сетки.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент галереи (каталога товаров) из index.html и экземпляр системы событий

Поля класса:
`protected catalogElement: HTMLElement` - каталог товаров

Методы:
`set catalog(items: HTMLElement[])` — отобразить массив карточек товаров (использует replaceChildren для замены содержимого)

### Абстрактный класс Card<T extends ICard> extends Component<T>
Базовый класс для всех вариантов отображения товара. Общий функционал вынесен для CardCatalog, CardPreview и CartCart.

Конструктор:
`protected constructor(container: HTMLElement)` - принимает HTML-элемент товара из index.html

Поля класса:
`protected titleElement: HTMLElement` — название товара
`protected priceElement: HTMLElement` — цена

Методы:
`set title(value: string): void` — установить название товара в элемент
`set price(value: number | null): void` — установить цену товара (null → "Бесценно")

### Класс CardCatalog extends Card<ICardCatalog>
Карточка товара в каталоге. Отображает товар в каталоге: изображение, название, категория, цена.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент карточки из index.html и возможные действия

Поля класса:
`protected imageElement: HTMLImageElement` — изображение товара
`protected categoryElement: HTMLElement` — категория с CSS-классом цвета

Методы:
`set image(value: string)` — установить изображение
`set category(value: string)` — установить категорию

### Класс CardPreview extends Card<ICardPreview>
Карточка товара в модальном окне. Отображает полную информацию о товаре в модальном окне с кнопкой действия.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент ревью карточки из index.html и возможные действия

Поля класса:
`protected imageElement: HTMLImageElement` — изображение
`protected descriptionElement: HTMLElement` — описание товара
`protected categoryElement: HTMLElement` — категория
`protected buyButton: HTMLButtonElement` — кнопка Купить/Удалить
`private _isInCart: boolean = false` — наличие товара в корзине

Методы:
`set image(value: string)` — установить изображение
`set description(value: string)` — установить описание
`set category(value: string)` — установить категорию
`set isInCart(value: boolean)` — установить наличие товара в корзине
`set isAvailable(value: boolean)` — установить доступность кнопки
`private updateButtonState(): void` — установить состояние кнопки (Купить/Удалить/Бесценно)

### Класс CartCart extends Card<ICardCart>
Строка товара в корзине. Отображает товар в списке корзины с кнопкой удаления.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент строчки карточки в корзине из index.html и возможные действия

Поля класса:
`protected indexElement: HTMLElement` — номер товара в корзине
`protected deleteButton: HTMLButtonElement` — кнопка удаления из корзины

Методы:
`set itemIndex(value: number)` — установить номер товара

### Абстрактный класс Form<T extends IFormState> extends Component<T>
Базовый класс для форм. Общий функционал валидации и обработки ошибок для FormOrder и FormContacts.

Конструктор:
`protected constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент формы из index.html и экземпляр системы действий

Поля класса:
`protected submitButton: HTMLButtonElement` — кнопка отправки
`protected errorElement: HTMLElement` — контейнер для ошибок валидации

Методы:
`protected onSubmit(e: Event): void` — отменяет стандартное поведение формы при сабмите
`set error(value: string)` — установить ошибки
`set valid(value: boolean)` — установить валидность формы

### Класс FormOrder extends Form<IFormState>
Форма выбора оплаты и адреса доставки (Шаг 1). Получает способ оплаты и адрес доставки от пользователя.

Конструктор:
`constructor(container: HTMLElement, actions?: IFormOrderActions)` - принимает HTML-элемент формы выбора оплаты и адреса доставки из index.html и возможные действия

Поля класса:
`protected paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты
`addressInput: HTMLInputElement` — поле ввода адреса
`selectedPayment: string = ''` — текущая выбранная оплата

Методы:
Отсутствуют

### Класс FormContacts extends Form<IFormState>
Форма ввода email и телефона (Шаг 2). Получает контактные данные покупателя.

Конструктор:
`constructor(container: HTMLElement, actions?: IFormContactsActions)` - принимает HTML-элемент формы ввода email и телефона из index.html и возможные действия

Поля класса:
`emailInput: HTMLInputElement` — поле ввода email
`phoneInput: HTMLInputElement` — поле ввода телефона

Методы:
Отсутствуют

### Класс CartView extends Component<ICartView>
Содержимое модального окна корзины. Отображает список товаров в корзине, итоговую стоимость и кнопку оформления.

Конструктор:
`constructor(container: HTMLElement, actions?: ICartViewActions)` - принимает HTML-элемент корзины из index.html и экземпляр системы действий

Поля класса:
`protected contentElement: HTMLElement` — контейнер для товаров
`protected totalPriceElement: HTMLElement` — элемент итоговой цены
`protected orderButton: HTMLButtonElement` — кнопка «Оформить»

Методы:
`set content(items: HTMLElement[])` — отобразить список товаров в контейнере (использует replaceChildren)
`set total(value: number)` — обновить отображение общей стоимости
`private set checkoutEnabled(enabled: boolean)` — деактивировать/активировать кнопку
`set isEmpty(empty: boolean)` — установить показатель "пустоты" корзины

### Класс Success extends Component<ISuccess>
Содержимое модального окна успешного заказа. Показывает подтверждение успешного оформления с указанной суммой.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент окна успешного заказа из index.html и экземпляр системы действий

Поля класса:
`protected descriptionElement: HTMLElement` — элемент описания с сообщением об успехе
`protected closeButton: HTMLButtonElement` — кнопка закрытия

Методы:
`set total(value: number)` — установить сумму заказа

## Презентер
В качестве метода было выбрано не создавать отдельный класс, а реализовывать презентер в основном файле main.ts

### Cобытие `products:changed`
Изменение данных каталога

### Cобытие `card:select`
Выбор карточки для просмотра превью

### Cобытие `cart:changed`
Изменение данных корзины

### Cобытие `basket:open`
Открытие корзины

### Cобытие `orderForm:open`
Открытие формы оплаты

### Cобытие `contactsForm:open`
Открытие формы контактов

### Cобытие `order:done`
Отправка данных на сервер, обнуление корзины и покупателя, вывод экрана успеха

### Cобытие `success:close`
Закрытие экрана успеха