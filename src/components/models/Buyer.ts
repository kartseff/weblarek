import { IBuyer, IValidationErrors } from '../../types/index';

export class Buyer {
    protected payment: IBuyer['payment'] = '';
    protected address: string = '';
    protected email: string = '';
    protected phone: string = '';

    constructor() {
    
    }

    setPayment(value: IBuyer['payment']): void {
        this.payment = value;
    }

    setAddress(value: string): void {
        this.address = value;
    }

    setEmail(value: string): void {
        this.email = value;
    }

    setPhone(value: string): void {
        this.phone = value;
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
    }

    validate(): IValidationErrors {
        const errors: IValidationErrors = {};
        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес доставки';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        return errors;
    }
}
