import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { invProductosModel } from '../inv.productos.model';
import { invSaldosModel } from './inv.saldos.model';

@Injectable({ providedIn: 'root' })
export class invSaldosService {
    private baseODataUrl = '';  // URL to web api
    private invSaldosODataUrl = '';  // URL to web api
    private invSaldosUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.invSaldosODataUrl = `${this.baseODataUrl}/invSaldos`;
        this.invSaldosUrl = `${this.dataBrowserServiceUrl}/invSaldos`;
    }

    getById(row: invSaldosModel): Observable<any> {
        const sUrl = `${this.invSaldosODataUrl}(ProductoLinea = ${row.ProductoLinea}, PeriodoDescripcionx = ${row.PeriodoDescripcionx})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched invSaldos")),
            catchError((error) => this.handleError("getinvSaldos", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        return this.http.get<any>(this.invSaldosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched invSaldos')),
            catchError((error) => this.handleError('getinvSaldosList', error))
        );
    }

    getList(masterRow: invProductosModel,
            filter: string,
            paginator: MatPaginator,
            sort: MatSort): Observable<any> {

        const params: any = {};

        params["$filter"] = `(ProductoLinea eq ${masterRow.ProductoLinea})`;

        if (filter) {
            params["$filter"] = ` and (${filter})`;
        }

        if (paginator.pageIndex) {
            params["$skip"] = paginator.pageSize * paginator.pageIndex;
        }

        params["$top"] = paginator.pageSize;

        if (sort.active) {
            params["$orderby"] = `${sort.active || ""} ${sort.direction || ""}`;
        }

        params["$count"] = "true";

        return this.http.get<any>(this.invSaldosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched invSaldos")),
            catchError((error) => this.handleError('getinvSaldosList', error))
        );
    }

    add(row: invSaldosModel): Observable<invSaldosModel> {
        return this.http.post<invSaldosModel>(this.invSaldosODataUrl, invSaldosModel.clone(row)).pipe(
            retry(3),
            tap((_row: invSaldosModel) => this.log(`added invSaldos w/ id=${_row.ProductoLinea}`)),
            catchError((error) => this.handleError("addinvSaldos", error))
        );
    }

    update(row: invSaldosModel, original: invSaldosModel): Observable<invSaldosModel> {
        const sUrl = `${this.invSaldosUrl}(ProductoLinea=${original.ProductoLinea}, PeriodoDescripcionx=${original.PeriodoDescripcionx})`;

        let changes = <any>{};
        let _current = invSaldosModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<invSaldosModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update invSaldos id=${row.ProductoLinea}`)),
            catchError((error) => this.handleError("updateinvSaldos", error))
        );
    }

    save(row: invSaldosModel, original: invSaldosModel): Observable<invSaldosModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: invSaldosModel): Observable<any> {
        const sUrl = `${this.invSaldosUrl}(ProductoLinea=${row.ProductoLinea}, PeriodoDescripcionx=${row.PeriodoDescripcionx})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter invSaldos id=${row.ProductoLinea}`)),
            catchError((error) => this.handleError("deleteinvSaldos", error))
        );
    }

    saveRows(rows: Array<invSaldosModel>): Observable<any> {
        const _rows = rows.map((row) => invSaldosModel.clone(row));
        return this.http.post<any>(this.invSaldosUrl, _rows).pipe(
            retry(3),
            tap((rrows: invSaldosModel) => this.log(`pasted rows in invSaldos `)),
            catchError((error) => this.handleError("addinvSaldos", error))
        );
    }

    batch(row: invSaldosModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.ProductoLinea = row.ProductoLinea;
                detailRow.body.PeriodoDescripcionx = row.PeriodoDescripcionx;

            });

            return this.http.post<any>(`${this.invSaldosODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: invSaldosModel) => this.log(`executed batch in invSaldos `)),
                catchError((error) => this.handleError("BatchinvSaldos", error))
            );
        } else {
            return of({});
        }
    }


    private handleError(operation = "operation", result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.message); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a invSaldosService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`invSaldosService: ${message}`);
        console.log(`invSaldosService: ${message}`);
    }
}
