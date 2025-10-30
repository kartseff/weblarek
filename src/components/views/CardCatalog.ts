import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

interface ICardCatalog extends ICard {
	image: string;
	category: string;
}

export interface ICardActions {
	onClick?: () => void;
}

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<ICardCatalog> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}

	set image(value: string) {
		this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title)
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
        }
	}
}
