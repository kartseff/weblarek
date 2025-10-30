import { Form, IFormState } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';

interface IFormOrderActions {
    onPaymentChange?: (payment: string) => void;
    onAddressChange?: (address: string) => void;
    onNextForm?: () => void;
}

export class FormOrder extends Form<IFormState> {
    protected paymentButtons: HTMLButtonElement[];
    addressInput: HTMLInputElement;
    selectedPayment: string = '';

    constructor(container: HTMLElement, actions?: IFormOrderActions) {
        super(container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.selectedPayment = button.getAttribute('name') || '';

                if (actions?.onPaymentChange) {
                    actions.onPaymentChange(this.selectedPayment);
                }
            });
        });

        this.addressInput.addEventListener('input', () => {
            const value = this.addressInput.value;

            if (actions?.onAddressChange) {
                actions.onAddressChange(value);
            }
        });

        if (actions?.onNextForm) {
            this.submitButton.addEventListener('click', actions.onNextForm)
        }
    }
}