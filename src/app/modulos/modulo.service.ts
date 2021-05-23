import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModuloService {
    private rolUrl = '';  // URL to web api

    get usuario(): any {
      return 'admin@prueba.com'
    }
      
    constructor(private http: HttpClient) {
    }

    getModulosByUser(userId: string): Observable<any[]> {
      const data = [
          {"id":2,"name":"cxc","descripcion":null,"check":true,"children":[]},]; 
      return of(data);
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.log(result.error); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a INVCO_BienesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`loginService: ${message}`);
        console.log(`ModuloService: ${message}`);
    }

}
