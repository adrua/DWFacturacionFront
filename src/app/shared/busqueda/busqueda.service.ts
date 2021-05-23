import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Busqueda_Service {

    constructor(private http: HttpClient) {}

    filterESAPBOGFuncionalidadesNombre(val: string, pageSize: number = 10): Observable<any> {
        let sUrl = `${environment.dataServiceUrl}/odata/ApplicationTree?$expand=Parent($expand=Parent)`;

        let params: any = { };
        
        params['$filter'] = `contains(Description,'${val}')`;
        params['$top'] = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            tap(_ => this.log(`filter ESAPBOGFuncionalidadesNombre id=${val}`)),
            catchError((error) => this.handleError('filterESAPBOGFuncionalidadesNombre', error))
        );
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.error); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a BusquedaService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`BusquedaService: ${message}`);
        console.log(`BusquedaService: ${message}`);
    }

}
