import { Form, IFormState } from './Form';
import { ensureElement } from '../../utils/utils';

interface IFormContactsActions {
	onEmailChange?: (email: string) => void;
	onPhoneChange?: (phone: string) => void;
}

export class FormContacts extends Form<IFormState> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLElement, actions?: IFormContactsActions) {
		super(container);

		this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
		this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

		this.emailInput.addEventListener('input', () => {
			if (actions?.onEmailChange) {
				actions.onEmailChange(this.emailInput.value);
			}
		});

		this.phoneInput.addEventListener('input', () => {
			if (actions?.onPhoneChange) {
				actions.onPhoneChange(this.phoneInput.value);
			}
		});
	}
}
