import { Form, IFormState } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IFormContactsActions {
    onEmailChange?: (email: string) => void;
    onPhoneChange?: (phone: string) => void;
    onOrderDone?: () => void;
}

export class FormContacts extends Form<IFormState> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents, actions?: IFormContactsActions) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            const value = this.emailInput.value;

            if (actions?.onEmailChange) {
                actions.onEmailChange(value);
            }
        });

        this.phoneInput.addEventListener('input', () => {
            const value = this.phoneInput.value;

            if (actions?.onPhoneChange) {
                actions.onPhoneChange(value);
            }
        });

        if (actions?.onOrderDone) {
            this.submitButton.addEventListener('click', actions.onOrderDone)
        }
    }
}
