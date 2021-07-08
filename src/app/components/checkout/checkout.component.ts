import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const customer: FormGroup = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
    });

    const shippingAddress: FormGroup = this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
    });

    const billingAddress: FormGroup = this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
    });

    const creditCard: FormGroup = this.formBuilder.group({
      cardType: [''],
      nameOnCard: [''],
      cardNumber: [''],
      securityCode: [''],
      expirationMonth: [''],
      expirationYear: [''],
    });

    this.checkoutFormGroup = this.formBuilder.group({
      customer: customer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      creditCard: creditCard,
    });
    // the parent form group is 'checkoutFormGroup' and 'customer' is nested form group

    // console logs every value change
    this.checkoutFormGroup
      .get('customer')
      ?.valueChanges.subscribe((data) => console.log(data));
  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  // END OF CLASS
}
