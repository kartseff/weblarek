import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';

interface ICardCart extends ICard {
	index: number;
}

interface ICardCartActions {
	onRemove?: () => void;
}

export class CardCart extends Card<ICardCart> {
	protected indexElement: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardCartActions) {
		super(container);

		this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete-btn', this.container);

		if (actions?.onRemove) {
			this.deleteButton.addEventListener('click', actions.onRemove);
		}
	}

	set index(value: number) {
		this.indexElement.textContent = String(value);
	}
}
