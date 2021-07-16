import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Luv2ShopValidators } from '../validators/luv2-shop-validators';

export class CheckoutForms {
  constructor(private formBuilder: FormBuilder) {}

  //   --------------- CUSTOMER FORMGROUP ---------------
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
  //   --------------- END OFCUSTOMER FORMGROUP ---------------

  //   --------------- SHIPPING ADDRESS FORMGROUP ---------------
  shippingAddress: FormGroup = this.formBuilder.group({
    street: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
  });

  get shippingAddressStreet() {
    return this.shippingAddress.get('street');
  }
  get shippingAddressCity() {
    return this.shippingAddress.get('city');
  }
  get shippingAddressState() {
    return this.shippingAddress.get('state');
  }
  get shippingAddressCountry() {
    return this.shippingAddress.get('country');
  }
  get shippingAddressZipCode() {
    return this.shippingAddress.get('zipCode');
  }
  //   --------------- END OF SHIPPING ADDRESS FORMGROUP ---------------

  //   --------------- BILLING ADDRESS FORMGROUP ---------------
  billingAddress: FormGroup = this.formBuilder.group({
    street: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Luv2ShopValidators.notOnlyWhitespace,
    ]),
  });

  get billingAddressStreet() {
    return this.billingAddress.get('street');
  }
  get billingAddressCity() {
    return this.billingAddress.get('city');
  }
  get billingAddressState() {
    return this.billingAddress.get('state');
  }
  get billingAddressCountry() {
    return this.billingAddress.get('country');
  }
  get billingAddressZipCode() {
    return this.billingAddress.get('zipCode');
  }

  //   --------------- BILLING ADDRESS FORMGROUP ---------------

  creditCard: FormGroup = this.formBuilder.group({
    cardType: [''],
    nameOnCard: [''],
    cardNumber: [''],
    securityCode: [''],
    expirationMonth: [''],
    expirationYear: [''],
  });
} // END OF CLASS
