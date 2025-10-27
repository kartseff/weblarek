import { Form, IFormState } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';

interface IFormOrderActions {
	onPaymentChange?: (payment: string) => void;
    onAddressChange?: (address: string) => void;
}

export class FormOrder extends Form<IFormState> {
	protected paymentButtons: HTMLButtonElement[];
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLElement, actions?: IFormOrderActions) {
		super(container);

		this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
		this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
				button.classList.add('button_alt-active');
				
				if (actions?.onPaymentChange) {
					actions.onPaymentChange(button.getAttribute('name') || '');
				}
			});
		});

		this.addressInput.addEventListener('input', (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            if (actions?.onAddressChange) {
                actions.onAddressChange(value);
            }
        });
	}
}
