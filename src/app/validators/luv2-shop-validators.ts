import { FormControl } from '@angular/forms';

export class Luv2ShopValidators {
  // whitespace validation
  static notOnlyWhitespace(control: FormControl) {
    const isWhitespace: boolean =
      control.value != null && (control.value || '').trim().length === 0;
    const isValid: boolean = !isWhitespace;

    return isValid ? null : { notOnlyWhitespace: true };
  }

  // END OF CLASS
}
