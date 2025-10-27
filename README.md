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

### Интерфейс IHeader
Интерфейс для типизации данных Header компонента

interface IHeader {
    counter: number;
}

### Тип TCardCatalog
Тип для передачи данных в компоненты Card

type TCardCatalog = Pick<IProduct, `image` | `category`>;

### Интерфейс ICardActions
Интерфейс для обработки действий карточки

interface ICardActions {
  onClick?: (product: HTMLElement) => void;
}

### Интерфейс ISuccess
Интерфейс для данных экрана успеха

interface ISuccess {
    total: number;
}

### Класс Modal extends Component 
Модальное окно — контейнер для отображения различного содержимого. Отображает содержимое (компоненты) в модальном окне с возможностью открытия/закрытия.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент модального окна из index.html и экземпляр системы событий

Поля класса:
`protected closeButton: HTMLElement` — кнопка закрытия (крестик)

Методы:
`open(): void` — открыть модальное окно (добавить класс active)
`close(): void` — закрыть модальное окно (удалить класс active)
`setContent(component: Component): void` — установить содержимое (заменить HTML в контейнере)

События:
При клике вне содержимого (по overlay): emit('modal:close')
При клике на кнопку закрытия: emit('modal:close')

### Класс Header extends Component
Шапка страницы с кнопкой корзины и счетчиком товаров. Отображает иконку корзины с количеством выбранных товаров.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент заголовка из index.html и экземпляр системы событий

Поля класса:
`protected basketButton: HTMLButtonElement` — кнопка корзины
`protected counterElement: HTMLElement` — элемент счетчика

Методы:
`setCounter(value: number): void` — обновить счетчик (отобразить количество товаров)

События:
При клике на кнопку корзины: emit('basket:open')

### Класс Gallery extends Component
Каталог товаров на главной странице. Отображает список карточек товаров в виде сетки.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент галереи (каталога товаров) из index.html и экземпляр системы событий

Поля класса:
Контейнер передаётся в конструктор и становится this.container из Component

Методы:
`set items(items: HTMLElement[]): void` — отобразить массив карточек товаров (использует replaceChildren для замены содержимого)

### Абстрактный класс Card<T> extends Component
Базовый класс для всех вариантов отображения товара. Общий функционал вынесен для CardCatalog, CardPreview и CartItem.

Конструктор:
`protected constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент товара из index.html и возможные действия

Поля класса:
`protected titleElement: HTMLElement` — название товара
`protected imageElement: HTMLImageElement` — изображение
`protected priceElement: HTMLElement` — цена
`protected categoryElement: HTMLElement` — категория
`protected descriptionElement?: HTMLElement` — описание (опционально)

Методы:
`set title(value: string): void` — установить название товара в элемент
`set price(value: number | null): void` — установить цену товара (null → "Бесценно")
`set category(value: string): void` — установить категорию с переключением CSS-классов
`set image(value: string): void` — установить изображение товара
`set description(value: string): void` — установить описание товара (если есть)

### Класс CardCatalog extends Card<TCardCatalog>
Карточка товара в каталоге. Отображает товар в каталоге: изображение, название, категория, цена.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент карточки из index.html и возможные действия

Поля класса:
`protected imageElement: HTMLImageElement` — изображение товара
`protected categoryElement: HTMLElement` — категория с CSS-классом цвета

Методы:
`render(data: IProduct): HTMLElement` — отрендерить карточку с данными товара

События:
При клике на карточку: emit('card:select', product)

### Класс CardPreview extends Card<IProduct>
Карточка товара в модальном окне. Отображает полную информацию о товаре в модальном окне с кнопкой действия.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент ревью карточки из index.html и возможные действия

Поля класса:
`protected descriptionElement: HTMLElement` — описание товара
`protected buttonElement: HTMLButtonElement` — кнопка Купить/Удалить

Методы:
`render(data: IProduct): HTMLElement` — отрендерить превью карточки с полной информацией
`setButtonState(product: IProduct): void` — установить состояние кнопки (Купить/Удалить/Бесценно)
`setButtonText(text: string): void` — установить текст кнопки

События:
При клике на кнопку: emit('product:action', {product}) — логика определяется в Presenter

### Класс CartItem extends Card<IProduct>
Строка товара в корзине. Отображает товар в списке корзины с кнопкой удаления.

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает HTML-элемент строчки карточки в корзине из index.html и возможные действия

Поля класса:
`protected removeButton: HTMLButtonElement` — кнопка удаления из корзины

Методы:
`render(data: IProduct): HTMLElement` — отрендерить товар в корзине (без изображения, только текст и цена)

События:
При клике на кнопку удаления: emit('product:remove', product.id)

### Абстрактный класс Form extends Component
Базовый класс для форм. Общий функционал валидации и обработки ошибок для FormOrder и FormContacts.

Конструктор:
`protected constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент формы из index.html и экземпляр системы действий

Поля класса:
`protected formElement: HTMLFormElement` — элемент формы
`protected submitButton: HTMLButtonElement` — кнопка отправки
`protected inputElements: HTMLInputElement[]` — массив всех полей ввода
`protected errorElement: HTMLElement` — контейнер для ошибок валидации

Методы:
`setErrors(errors: IValidationErrors): void` — отобразить ошибки валидации в контейнере
`toggleSubmit(disabled: boolean): void` — деактивировать/активировать кнопку отправки
`protected onInputChange(): void` — внутренний обработчик изменения полей (проверка валидации)
`protected getFormData(): Record<string, string | number>` — получить все значения из полей формы

### Класс FormOrder extends Form
Форма выбора оплаты и адреса доставки (Шаг 1). Получает способ оплаты и адрес доставки от пользователя.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент формы выбора оплаты и адреса доставки из index.html и экземпляр системы действий

Поля класса:
`protected paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты
`protected addressInput: HTMLInputElement` — поле ввода адреса
`protected selectedPayment: string = ''` — текущая выбранная оплата

Методы:
`getPayment(): string` — получить выбранный способ оплаты
`getAddress(): string` — получить введённый адрес
`protected onInputChange(): void` — проверить валидацию (оплата и адрес заполнены)
`clear(): void` — очистить форму после успешного заказа

События:
При отправке формы: emit('order:submit', {payment, address})

### Класс FormContacts extends Form
Форма ввода email и телефона (Шаг 2). Получает контактные данные покупателя.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент формы ввода email и телефона из index.html и экземпляр системы действий

Поля класса:
`protected emailInput: HTMLInputElement` — поле ввода email
`protected phoneInput: HTMLInputElement` — поле ввода телефона

Методы:
`getEmail(): string` — получить введённый email
`getPhone(): string` — получить введённый телефон
`protected onInputChange(): void` — проверить валидацию (email и телефон корректны)
`clear(): void` — очистить форму после успешного заказа

События:
При отправке формы: emit('contacts:submit', {email, phone})

### Класс CartView extends Component
Содержимое модального окна корзины. Отображает список товаров в корзине, итоговую стоимость и кнопку оформления.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент корзины из index.html и экземпляр системы действий

Поля класса:
`protected itemsContainer: HTMLElement` — контейнер для товаров
`protected totalElement: HTMLElement` — элемент итоговой цены
`protected checkoutButton: HTMLButtonElement` — кнопка «Оформить»

Методы:
`set items(items: HTMLElement[]): void` — отобразить список товаров в контейнере (использует replaceChildren)
`set total(value: number): void` — обновить отображение общей стоимости
`set disabled(disabled: boolean): void` — деактивировать кнопку при пустой корзине

События:
При клике на кнопку «Оформить»: emit('order:start')

### Класс Success extends Component
Содержимое модального окна успешного заказа. Показывает подтверждение успешного оформления с указанной суммой.

Конструктор:
`constructor(container: HTMLElement, protected events: IEvents)` - принимает HTML-элемент окна успешного заказа из index.html и экземпляр системы действий

Поля класса:
`protected descriptionElement: HTMLElement` — элемент описания с сообщением об успехе
`protected closeButton: HTMLButtonElement` — кнопка закрытия

Методы:
`render(data: ISuccess): HTMLElement` — отрендерить экран успеха с сообщением и суммой

События:
При клике на кнопку закрытия: emit('success:close')