import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICartView {
	content: HTMLElement[];
    total: number;
	isEmpty: boolean;
}

interface ICartViewActions {
	onClick?: () => void;
}

export class CartView extends Component<ICartView> {
	private contentElement: HTMLElement;
	private totalPriceElement: HTMLElement;
	private orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICartViewActions) {
		super(container);

		this.contentElement = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);
		this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
		this.orderButton.disabled = true;

		if (actions?.onClick) {
			this.orderButton.addEventListener('click', actions.onClick);
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
