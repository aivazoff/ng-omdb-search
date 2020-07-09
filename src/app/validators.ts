import {FormControl} from '@angular/forms';

export class AppValidators {
  static noWhitespaceValidator(control: FormControl): null | {whitespace: boolean} {
    if (!control.value) {
      return null;
    }
    const isValid = control.value.toString().trim().length > 0;
    return !isValid ? {whitespace: true} : null;
  }
}
