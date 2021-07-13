import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private luv2ShopFormService: Luv2ShopFormService
  ) {}

  ngOnInit(): void {
    this.listCheckoutDetails();
    this.populateCreditCardMonths();
    this.populateCreditCardYears();
    this.hanadleListCountries();

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

  // --------------- PRIVATE METHODS ---------------

  private listCheckoutDetails(): void {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );

    this.cartService.computeCartTotals();
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

  private handleListStates(theCountryCode: string): void {
    this.luv2ShopFormService
      .getStates(theCountryCode)
      .subscribe((data) => (this.states = data));
  }

  // --------------- PUBLIC METHODS ---------------

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

  getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAdressStates = data;
      } else {
        this.billingAdressStates = data;
      }

      // select first item by default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  // END OF CLASS
}
