import { Form, IFormState } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IFormOrderActions {
    onPaymentChange?: (payment: string) => void;
    onAddressChange?: (address: string) => void;
    onNextForm?: () => void;
}

export class FormOrder extends Form<IFormState> {
    protected addressInput: HTMLInputElement;
    paymentButtons: HTMLButtonElement[];
    selectedPayment: string = '';

    constructor(container: HTMLElement, protected events: IEvents, actions?: IFormOrderActions) {
        super(container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.events.emit('payment:selected', button);
                
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