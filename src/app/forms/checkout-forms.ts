import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Luv2ShopValidators } from '../validators/luv2-shop-validators';

export class CheckoutForms {
  constructor(private formBuilder: FormBuilder) {}

  customer: FormGroup = this.formBuilder.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
  });

  get firstName() {
    return this.customer.get('firstName');
  }

  get lastName() {
    return this.customer.get('lastName');
  }

  get email() {
    return this.customer.get('email');
  }

  shippingAddress: FormGroup = this.formBuilder.group({
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    zipCode: [''],
  });

  billingAddress: FormGroup = this.formBuilder.group({
    street: [''],
    city: [''],
    state: [''],
    country: [''],
    zipCode: [''],
  });

  creditCard: FormGroup = this.formBuilder.group({
    cardType: [''],
    nameOnCard: [''],
    cardNumber: [''],
    securityCode: [''],
    expirationMonth: [''],
    expirationYear: [''],
  });
} // END OF CLASS
