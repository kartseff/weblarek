import { IProduct } from '../../types/index';

export class Cart {
    protected items: IProduct[] = [];

    constructor() {
    
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
        this.items.push(item);
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clearBasket(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
