import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
	error: string;
	valid: boolean;
}

export abstract class Form<T extends IFormState> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions button[type="submit"]', this.container);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (e: Event) => this.onSubmit(e));
	}

	protected onSubmit(e: Event): void {
		e.preventDefault();
	}

	set error(value: string) {
		this.errorsElement.textContent = value;
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}
}
