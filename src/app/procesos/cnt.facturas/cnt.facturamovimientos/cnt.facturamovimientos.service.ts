import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntFacturasModel } from '../cnt.facturas.model';
import { CntFacturaMovimientosModel } from './cnt.facturamovimientos.model';

@Injectable({ providedIn: 'root' })
export class CntFacturaMovimientosService {
    private baseODataUrl = '';  // URL to web api
    private cntFacturaMovimientosODataUrl = '';  // URL to web api
    private cntFacturaMovimientosUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntFacturaMovimientosODataUrl = `${this.baseODataUrl}/CntFacturaMovimientos`;
        this.cntFacturaMovimientosUrl = `${this.dataBrowserServiceUrl}/CntFacturaMovimientos`;
    }

    getById(row: CntFacturaMovimientosModel): Observable<any> {
        const sUrl = `${this.cntFacturaMovimientosODataUrl}(FacturaId = ${row.FacturaId}, FacturaSerie = ${row.FacturaSerie}, ProductoLinea = ${row.ProductoLinea})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntFacturaMovimientos")),
            catchError((error) => this.handleError("getCntFacturaMovimientos", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        params["$expand"] = "invProductos";

        return this.http.get<any>(this.cntFacturaMovimientosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntFacturaMovimientos')),
            catchError((error) => this.handleError('getCntFacturaMovimientosList', error))
        );
    }

    getList(masterRow: CntFacturasModel,
            filter: string,
            paginator: MatPaginator,
            sort: MatSort): Observable<any> {

        const params: any = {};

        params["$filter"] = `(FacturaId eq ${masterRow.FacturaId} and FacturaSerie eq ${masterRow.FacturaSerie})`;

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

        params["$expand"] = "invProductos";

        return this.http.get<any>(this.cntFacturaMovimientosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntFacturaMovimientos")),
            catchError((error) => this.handleError('getCntFacturaMovimientosList', error))
        );
    }

    add(row: CntFacturaMovimientosModel): Observable<CntFacturaMovimientosModel> {
        return this.http.post<CntFacturaMovimientosModel>(this.cntFacturaMovimientosODataUrl, CntFacturaMovimientosModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntFacturaMovimientosModel) => this.log(`added CntFacturaMovimientos w/ id=${_row.FacturaId}`)),
            catchError((error) => this.handleError("addCntFacturaMovimientos", error))
        );
    }

    update(row: CntFacturaMovimientosModel, original: CntFacturaMovimientosModel): Observable<CntFacturaMovimientosModel> {
        const sUrl = `${this.cntFacturaMovimientosODataUrl}?keyFacturaId=${original.FacturaId}&keyFacturaSerie=${original.FacturaSerie}&keyProductoLinea=${original.ProductoLinea}`;

        let changes = <any>{};
        let _current = CntFacturaMovimientosModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntFacturaMovimientosModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntFacturaMovimientos id=${row.FacturaId}`)),
            catchError((error) => this.handleError("updateCntFacturaMovimientos", error))
        );
    }

    save(row: CntFacturaMovimientosModel, original: CntFacturaMovimientosModel): Observable<CntFacturaMovimientosModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntFacturaMovimientosModel): Observable<any> {
        const sUrl = `${this.cntFacturaMovimientosUrl}(FacturaId=${row.FacturaId}, FacturaSerie=${row.FacturaSerie}, ProductoLinea=${row.ProductoLinea})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntFacturaMovimientos id=${row.FacturaId}`)),
            catchError((error) => this.handleError("deleteCntFacturaMovimientos", error))
        );
    }

    saveRows(rows: Array<CntFacturaMovimientosModel>): Observable<any> {
        const _rows = rows.map((row) => CntFacturaMovimientosModel.clone(row));
        return this.http.post<any>(this.cntFacturaMovimientosUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntFacturaMovimientosModel) => this.log(`pasted rows in CntFacturaMovimientos `)),
            catchError((error) => this.handleError("addCntFacturaMovimientos", error))
        );
    }

    batch(row: CntFacturaMovimientosModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.FacturaId = row.FacturaId;
                detailRow.body.FacturaSerie = row.FacturaSerie;
                detailRow.body.ProductoLinea = row.ProductoLinea;

            });

            return this.http.post<any>(`${this.cntFacturaMovimientosODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntFacturaMovimientosModel) => this.log(`executed batch in CntFacturaMovimientos `)),
                catchError((error) => this.handleError("BatchCntFacturaMovimientos", error))
            );
        } else {
            return of({});
        }
    }

    filterProductoDescripcion(val: string, pageSize: number = 10): Observable<any> {
        let sUrl = `${this.baseODataUrl}/invProductos`;

        let params: any = { };
        params["$filter"] = `contains(ProductoDescripcion,'${val}')`;
        params["$top"] = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter ProductoDescripcion id=${val}`)),
            catchError((error) => this.handleError("filterProductoDescripcion", error))
        );
    }

    getByIdProductoDescripcion(productoLinea: string): Observable<any> {
        let sUrl = `${this.baseODataUrl}/invProductos(ProductoLinea=${productoLinea})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById ProductoDescripcion ProductoLinea=${productoLinea}`)),
            catchError((error) => this.handleError("getByIdProductoDescripcion", error))
        );
    }


    private handleError(operation = "operation", result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.message); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a CntFacturaMovimientosService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntFacturaMovimientosService: ${message}`);
        console.log(`CntFacturaMovimientosService: ${message}`);
    }
}
