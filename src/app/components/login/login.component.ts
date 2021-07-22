import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  oktaSignIn = new OktaSignIn({
    logo: 'assets/images/logo.png',
    baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
    clientId: myAppConfig.oidc.clientId,
    redirectUri: myAppConfig.oidc.redirectUri,
    authParams: {
      pkce: true,
      issuer: myAppConfig.oidc.issuer,
      scopes: myAppConfig.oidc.scopes,
    },
  });

  constructor(private oktaAuthService: OktaAuthService) {}

  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn
      .renderEl({
        el: '#okta-sign-in-widget',
      })
      .then((res: any) => {
        if (res.status === 'SUCCESS') {
          this.oktaAuthService.signInWithRedirect();
        }
      });
  }
}
