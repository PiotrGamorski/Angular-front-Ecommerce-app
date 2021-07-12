import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.listCheckoutDetails();

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

  // PRIVATE METHODS
  private listCheckoutDetails(): void {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    this.cartService.computeCartTotals();
  }

  // PUBLIC METHODS

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBilingAddress(theEvent: Event): void {
    const controls = this.checkoutFormGroup.controls;

    if ((theEvent.target as HTMLInputElement).checked) {
      controls.billingAddress.setValue(controls.shippingAddress.value);
    } else {
      controls.billingAddress.reset();
    }
  }

  // END OF CLASS
}
