import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';
import { ICardActions } from './CardCatalog';

export interface ICardPreview extends ICard {
	image: string;
	description: string;
	category: string;
	isInCart: boolean;
	isAvailable: boolean;
}

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICardPreview> {
	private imageElement: HTMLImageElement;
	private descriptionElement: HTMLElement;
	private categoryElement: HTMLElement;
	private buyButton: HTMLButtonElement;
	private _isInCart: boolean = false;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		if (actions?.onClick) {
            this.buyButton.addEventListener('click', actions.onClick);
        }
	}

	set image(value: string) {
		this.setImage(this.imageElement, `${CDN_URL}${value}`, this.title)
	}

	set description(value: string) {
		this.descriptionElement.textContent = value;
	}

	set category(value: string) {
		this.categoryElement.textContent = value;
		for (const key in categoryMap) {
			this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
		}
	}

	set isInCart(value: boolean) {
		this._isInCart = value;
		this.updateButtonState();
	}

	set isAvailable(value: boolean) {
        this.buyButton.disabled = !value;
        this.updateButtonState();
    }

	private updateButtonState(): void {
		if (this.buyButton.disabled) {
			this.buyButton.textContent = 'Недоступно';
		} else if (this._isInCart) {
			this.buyButton.textContent = 'Удалить из корзины';
		} else {
			this.buyButton.textContent = 'Купить';
		}
	}
}