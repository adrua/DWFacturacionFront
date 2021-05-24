import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntFacturasModel } from './cnt.facturas.model';

@Injectable({ providedIn: 'root' })
export class CntFacturasService {
    private baseODataUrl = '';  // URL to web api
    private cntFacturasODataUrl = '';  // URL to web api
    private cntFacturasUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntFacturasODataUrl = `${this.baseODataUrl}/CntFacturas`;
        this.cntFacturasUrl = `${this.dataBrowserServiceUrl}/CntFacturas`;
    }

    getById(facturaId: number, facturaSerie: number): Observable<any> {
        const sUrl = `${this.cntFacturasODataUrl}(FacturaId=${facturaId}, FacturaSerie=${facturaSerie})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntFacturas")),
            catchError((error) => this.handleError("getCntFacturas", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        params["$expand"] = "CntClientes";

        return this.http.get<any>(this.cntFacturasODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntFacturas')),
            catchError((error) => this.handleError('getCntFacturasList', error))
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

        params["$expand"] = "CntClientes";

        return this.http.get<any>(this.cntFacturasODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntFacturas")),
            catchError((error) => this.handleError('getCntFacturasList', error))
        );
    }

    add(row: CntFacturasModel): Observable<CntFacturasModel> {
        return this.http.post<CntFacturasModel>(this.cntFacturasODataUrl, CntFacturasModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntFacturasModel) => this.log(`added CntFacturas w/ id=${_row.FacturaId}`)),
            catchError((error) => this.handleError("addCntFacturas", error))
        );
    }

    update(row: CntFacturasModel, original: CntFacturasModel): Observable<CntFacturasModel> {
        const sUrl = `${this.cntFacturasODataUrl}?keyFacturaId=${original.FacturaId}&keyFacturaSerie=${original.FacturaSerie}`;

        let changes = <any>{};
        let _current = CntFacturasModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntFacturasModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntFacturas id=${row.FacturaId}`)),
            catchError((error) => this.handleError("updateCntFacturas", error))
        );
    }

    save(row: CntFacturasModel, original: CntFacturasModel): Observable<CntFacturasModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntFacturasModel): Observable<any> {
        const sUrl = `${this.cntFacturasUrl}(FacturaId=${row.FacturaId}, FacturaSerie=${row.FacturaSerie})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntFacturas id=${row.FacturaId}`)),
            catchError((error) => this.handleError("deleteCntFacturas", error))
        );
    }

    saveRows(rows: Array<CntFacturasModel>): Observable<any> {
        const _rows = rows.map((row) => CntFacturasModel.clone(row));
        return this.http.post<any>(this.cntFacturasUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntFacturasModel) => this.log(`pasted rows in CntFacturas `)),
            catchError((error) => this.handleError("addCntFacturas", error))
        );
    }

    batch(row: CntFacturasModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.FacturaId = row.FacturaId;
                detailRow.body.FacturaSerie = row.FacturaSerie;

            });

            return this.http.post<any>(`${this.cntFacturasODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntFacturasModel) => this.log(`executed batch in CntFacturas `)),
                catchError((error) => this.handleError("BatchCntFacturas", error))
            );
        } else {
            return of({});
        }
    }

    filterClienteRazonSocial(val: string, pageSize: number = 10): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntClientes`;

        let params: any = { };
        params["$filter"] = `contains(ClienteRazonSocial,'${val}')`;
        params["$top"] = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter ClienteRazonSocial id=${val}`)),
            catchError((error) => this.handleError("filterClienteRazonSocial", error))
        );
    }

    getByIdClienteRazonSocial(clienteId: number): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntClientes(ClienteId=${clienteId})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById ClienteRazonSocial ClienteId=${clienteId}`)),
            catchError((error) => this.handleError("getByIdClienteRazonSocial", error))
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

    /** Log a CntFacturasService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntFacturasService: ${message}`);
        console.log(`CntFacturasService: ${message}`);
    }
}
