import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

interface ICardCart extends ICard {
	itemIndex: number;
}

interface ICardCartActions {
	onClick?: () => void;
}

export class CardCart extends Card<ICardCart> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardCartActions) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		if (actions?.onClick) {
			this.deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set itemIndex(value: number) {
		this.indexElement.textContent = String(value);
	}
}
