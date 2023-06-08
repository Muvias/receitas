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

@Injectable()
export class AuthEffects {
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
      const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

      return new AuthActions.Login({
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate
      });
    }),
    catchError(error => {
      let errorMessage = 'Um erro desconhecido ocorreu!';

      if (!error.error || !error.error.error) {
        return of(new AuthActions.LoginFail(errorMessage));
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

      return of(new AuthActions.LoginFail(errorMessage));
    }))
  );

  authSuccess = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN),
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
