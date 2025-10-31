import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { ICardActions } from './CardCatalog';

interface ICardCart extends ICard {
	itemIndex: number;
}

export class CardCart extends Card<ICardCart> {
	private indexElement: HTMLElement;
	private deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
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
