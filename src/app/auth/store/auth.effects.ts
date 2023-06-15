import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { of } from "rxjs";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { Actions, ofType, createEffect } from "@ngrx/effects";

import { User } from "../user.model";

import { AuthService } from "../auth.service";

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
};

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
    redirect: true,
  });
};

const handleError = (error: any) => {
  let errorMessage = 'Um erro desconhecido ocorreu!';

  if (!error.error || !error.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  };

  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'Este email já existe!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Dados inválidos!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Dados inválidos!';
      break;
  };

  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAWEVifCGq-jjhCcC9nJA4o2aoXUlSUL9c', {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      })
    })
  ).pipe(
    tap(resData => {
      this.authService.setLogoutTimer(+resData.expiresIn * 1000);
    }),
    map(resData => {
      return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }),
    catchError(error => {
      return handleError(error);
    }))
  );

  authLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAWEVifCGq-jjhCcC9nJA4o2aoXUlSUL9c', {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      })
    })
  ).pipe(
    tap(resData => {
      this.authService.setLogoutTimer(+resData.expiresIn * 1000);
    }),
    map(resData => {
      return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }),
    catchError(error => {
      return handleError(error);
    }))
  );

  authRedirect = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if(authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      };
    })
  ),
    {
      dispatch: false
    }
  );

  autoLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return { type: 'BLABLA' };
      };

      const loadedUser = new User(
        userData.id,
        userData.email,
        userData._token,
        new Date(userData._tokenExpirationDate),
      );

      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

        this.authService.setLogoutTimer(expirationDuration);

        return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
      };

      return { type: 'BLABLA' };
    }),
  ));

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    }),
  ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) { };
};
