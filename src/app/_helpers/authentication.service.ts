import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from './user';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    loginUrl = `${environment.dataServiceUrl}/login`;

    constructor() {
        let user = null;
        this.currentUserSubject = new BehaviorSubject<User>(user);
        this.currentUser = this.currentUserSubject.asObservable();

        let token = "ABC123";

        if(token) {
            user = new User();
            user.token = token;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value ;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getParamValueQueryString( paramName: string ): string {
        const url = window.location.href;
        let paramValue = null;
        if (url.includes('?')) {
          const httpParams = new HttpParams({ fromString: url.split('?')[1] });
          paramValue = httpParams.get(paramName);
        }
        return paramValue;
    }
}