import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
	errors: string;
	[key: string]: string;
}

export abstract class Form<T extends IFormState> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorsElement: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
		this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (e: Event) => this.onSubmit(e));
	}

	protected onSubmit(e: Event): void {
		e.preventDefault();
	}

	set errors(value: string) {
		this.errorsElement.textContent = value;
	}

	set valid(value: boolean) {
		this.submitButton.disabled = !value;
	}
}
