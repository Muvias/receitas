import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { Router } from "@angular/router";

import { AuthResponseData, AuthService } from "./auth.service";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {};

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  };

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    };

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      authObs = this.authService.signup(email, password);
    };

    form.reset();
  };
};
