import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { invProductosModel } from './inv.productos.model';

@Injectable({ providedIn: 'root' })
export class invProductosService {
    private baseODataUrl = '';  // URL to web api
    private invProductosODataUrl = '';  // URL to web api
    private invProductosUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.invProductosODataUrl = `${this.baseODataUrl}/invProductos`;
        this.invProductosUrl = `${this.dataBrowserServiceUrl}/invProductos`;
    }

    getById(productoLinea: string): Observable<any> {
        const sUrl = `${this.invProductosODataUrl}(ProductoLinea=${productoLinea})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched invProductos")),
            catchError((error) => this.handleError("getinvProductos", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        return this.http.get<any>(this.invProductosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched invProductos')),
            catchError((error) => this.handleError('getinvProductosList', error))
        );
    }

    getList(filter: string,
            paginator: MatPaginator,
            sort: MatSort): Observable<any> {

        const params: any = {};

        if (filter) {
            params["$filter"] = filter;
        }

        if (paginator.pageIndex) {
            params["$skip"] = paginator.pageSize * paginator.pageIndex;
        }

        params["$top"] = paginator.pageSize;

        if (sort.active) {
            params["$orderby"] = `${sort.active || ""} ${sort.direction || ""}`;
        }

        params["$count"] = "true";

        return this.http.get<any>(this.invProductosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched invProductos")),
            catchError((error) => this.handleError('getinvProductosList', error))
        );
    }

    add(row: invProductosModel): Observable<invProductosModel> {
        return this.http.post<invProductosModel>(this.invProductosODataUrl, invProductosModel.clone(row)).pipe(
            retry(3),
            tap((_row: invProductosModel) => this.log(`added invProductos w/ id=${_row.ProductoLinea}`)),
            catchError((error) => this.handleError("addinvProductos", error))
        );
    }

    update(row: invProductosModel, original: invProductosModel): Observable<invProductosModel> {
        const sUrl = `${this.invProductosUrl}(ProductoLinea=${original.ProductoLinea})`;

        let changes = <any>{};
        let _current = invProductosModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<invProductosModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update invProductos id=${row.ProductoLinea}`)),
            catchError((error) => this.handleError("updateinvProductos", error))
        );
    }

    save(row: invProductosModel, original: invProductosModel): Observable<invProductosModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: invProductosModel): Observable<any> {
        const sUrl = `${this.invProductosUrl}(ProductoLinea=${row.ProductoLinea})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter invProductos id=${row.ProductoLinea}`)),
            catchError((error) => this.handleError("deleteinvProductos", error))
        );
    }

    saveRows(rows: Array<invProductosModel>): Observable<any> {
        const _rows = rows.map((row) => invProductosModel.clone(row));
        return this.http.post<any>(this.invProductosUrl, _rows).pipe(
            retry(3),
            tap((rrows: invProductosModel) => this.log(`pasted rows in invProductos `)),
            catchError((error) => this.handleError("addinvProductos", error))
        );
    }

    batch(row: invProductosModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.ProductoLinea = row.ProductoLinea;

            });

            return this.http.post<any>(`${this.invProductosODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: invProductosModel) => this.log(`executed batch in invProductos `)),
                catchError((error) => this.handleError("BatchinvProductos", error))
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

    /** Log a invProductosService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`invProductosService: ${message}`);
        console.log(`invProductosService: ${message}`);
    }
}
