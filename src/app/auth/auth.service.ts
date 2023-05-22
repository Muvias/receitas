import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );

    this.user.next(user);

    localStorage.setItem('userData', JSON.stringify(user))
  };

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu!';

    if (!err.error || !err.error.error) {
      return throwError(errorMessage);
    };

    switch (err.error.error.message) {
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

    return throwError(errorMessage);
  };

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    };

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    };
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAWEVifCGq-jjhCcC9nJA4o2aoXUlSUL9c', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn,
        );
      })
    );
  };

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAWEVifCGq-jjhCcC9nJA4o2aoXUlSUL9c', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn,
        );
      })
    );
  };

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData')
  };

};
