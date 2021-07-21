import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CheckoutForms } from 'src/app/forms/checkout-forms';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});
  forms: CheckoutForms = new CheckoutForms(this.formBuilder);

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  selectAllStates: boolean = true;

  countries: Country[] = [];
  states: State[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private luv2ShopFormService: Luv2ShopFormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generateCheckoutFormGroup();
    this.populateCheckoutDetails();
    this.populateCreditCardMonths();
    this.populateCreditCardYears();
    this.hanadleListCountries();
    this.handleListOfAllStates();
  }

  // --------------- PRIVATE METHODS ---------------

  private generateCheckoutFormGroup() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.forms.customer,
      shippingAddress: this.forms.shippingAddress,
      billingAddress: this.forms.billingAddress,
      creditCard: this.forms.creditCard,
    });

    // console logs every value change
    this.checkoutFormGroup
      .get('customer')
      ?.valueChanges.subscribe((data) => console.log(data));
  }

  private populateCheckoutDetails(): void {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }

  private populateCreditCardMonths(): void {
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrived credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  private populateCreditCardYears(): void {
    this.luv2ShopFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrived credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });
  }

  private hanadleListCountries(): void {
    this.luv2ShopFormService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }

  private handleListOfAllStates(): void {
    this.luv2ShopFormService.getAllStates().subscribe((data) => {
      // console.log(JSON.stringify(data));
      this.states = data;
    });
  }

  private savePurchaseToDataBase(): void {
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems: CartItem[] = this.cartService.cartItems;
    let orderItems = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    // set up purchase
    let purchase: Purchase = new Purchase();

    // populate purchase with customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase with shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase with billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // pupulate purchase with order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been recieved. \nOrder tracking number: ${response.orderTrackingNumber}`
        );
        // reset cart
        this.resetCart();
      },
      error: (err) => {
        alert(`There was an error: ${err.message}`);
      },
    });
  }

  private resetCart(): void {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  // --------------- END OF PRIVATE METHODS ---------------

  // --------------- PUBLIC METHODS ---------------

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    } else {
      this.savePurchaseToDataBase();
    }
  }

  copyShippingAddressToBilingAddress(theEvent: Event): void {
    const controls = this.checkoutFormGroup.controls;

    if ((theEvent.target as HTMLInputElement).checked) {
      controls.billingAddress.setValue(controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      controls.billingAddress.reset();
    }
  }

  handleMonthsAndYears(): void {
    const creditCardFormGroup = this.checkoutFormGroup.controls.creditCard;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    // if the current year equals the selected year, then start with the current month
    let startMonth: number = 0;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrived credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });
  }

  getStatesWhenCountrySelected(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService
      .getStatesByCountryCode(countryCode)
      .subscribe((data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
        this.selectAllStates = false;
        console.log(this.selectAllStates);
      });
  }
  // --------------- END OF PUBLIC METHODS ---------------

  // END OF CLASS
}
