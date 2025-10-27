import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ICartView {
	content: HTMLElement[];
    total: number;
}

interface ICartViewActions {
	onCheckout?: () => void;
}

export class CartView extends Component<ICartView> {
	protected contentElement: HTMLElement;
	protected totalPriceElement: HTMLElement;
	protected orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICartViewActions) {
		super(container);

		this.contentElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
		this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		if (actions?.onCheckout) {
			this.orderButton.addEventListener('click', actions.onCheckout);
		}
	}

	set content(items: HTMLElement[]) {
		this.contentElement.replaceChildren(...items);
	}

	set total(value: number) {
		this.totalPriceElement.textContent = `${value} синапсов`;
	}

	private set checkoutEnabled(enabled: boolean) {
		this.orderButton.disabled = !enabled;
	}

	set isEmpty(empty: boolean) {
		this.checkoutEnabled = !empty;
	}
}
