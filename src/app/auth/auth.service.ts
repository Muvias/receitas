import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

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

  constructor(private http: HttpClient) { };


  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );

    this.user.next(user);
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

};
