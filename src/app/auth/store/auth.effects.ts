import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { of } from "rxjs";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { Actions, ofType, createEffect } from "@ngrx/effects";

import * as AuthActions from './auth.actions';
import { Router } from "@angular/router";

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

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
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
    map(resData => {
      return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }),
    catchError(error => {
      return handleError(error);
    }))
  );

  authSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
  ) { };
};
