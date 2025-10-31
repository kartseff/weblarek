import { IBuyer, IValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
    protected payment: IBuyer['payment'] = '';
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor(protected events: IEvents) {}

    setPayment(value: IBuyer['payment']): void {
        this.payment = value;
        this.events.emit('buyer:payment-changed');
    }

    setAddress(value: string): void {
        this.address = value;
        this.events.emit('buyer:address-changed');
    }

    setEmail(value: string): void {
        this.email = value;
        this.events.emit('buyer:email-changed');
    }

    setPhone(value: string): void {
        this.phone = value;
        this.events.emit('buyer:phone-changed');
    }

    getBuyerData(): IBuyer {
        return {
        payment: this.payment,
        address: this.address,
        email: this.email,
        phone: this.phone
        };
    }

    clearBuyerData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('buyer:cleared');
    }

    validate(): IValidationErrors {
        const errors: IValidationErrors = {};
        if (!this.payment) errors.payment = 'Необходимо указать способ оплаты';
        if (!this.address) errors.address = 'Необходимо указать адрес';
        if (!this.email) errors.email = 'Необходимо указать email';
        if (!this.phone) errors.phone = 'Необходимо указать телефон';
        return errors;
    }
}
