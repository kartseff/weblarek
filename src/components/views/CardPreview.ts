import { Card, ICard } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICardPreview extends ICard {
	image: string;
	description: string;
	category: string;
}

interface ICardPreviewActions {
	onAddToCart?: () => void;
	onRemoveFromCart?: () => void;
}

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICardPreview> {
	protected imageElement: HTMLImageElement;
	protected descriptionElement: HTMLElement;
	protected categoryElement: HTMLElement;
	protected buyButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardPreviewActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		this.buyButton.addEventListener('click', () => {
		if (this.isInCart) {
			actions?.onRemoveFromCart?.();
		} else {
			actions?.onAddToCart?.();
		}
    });
	}

	set image(value: string) {
		this.setImage(this.imageElement, value, this.title);
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

	// Устанавливает состояние кнопки в зависимости от наличия товара в корзине
	set isInCart(value: boolean) {
		this.isInCart = value;
		this.updateButtonState();
	}

	// Устанавливает доступность кнопки в зависимости от цены
	set isAvailable(available: boolean) {
		this.buyButton.disabled = !available;
		if (!available) {
			this.buyButton.textContent = 'Недоступно';
		}
	}

	// Обновляет текст кнопки в зависимости от состояния
	private updateButtonState(): void {
		if (this.buyButton.disabled) {
			this.buyButton.textContent = 'Недоступно';
		} else if (this.isInCart) {
			this.buyButton.textContent = 'Удалить из корзины';
		} else {
			this.buyButton.textContent = 'Купить';
		}
	}
}