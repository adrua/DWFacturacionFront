import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntClientesModel } from './cnt.clientes.model';

@Injectable({ providedIn: 'root' })
export class CntClientesService {
    private baseODataUrl = '';  // URL to web api
    private cntClientesODataUrl = '';  // URL to web api
    private cntClientesUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntClientesODataUrl = `${this.baseODataUrl}/CntClientes`;
        this.cntClientesUrl = `${this.dataBrowserServiceUrl}/CntClientes`;
    }

    getById(clienteId: number): Observable<any> {
        const sUrl = `${this.cntClientesODataUrl}(ClienteId=${clienteId})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntClientes")),
            catchError((error) => this.handleError("getCntClientes", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        params["$expand"] = "CntCodigosCiiu,CntCiudades";

        return this.http.get<any>(this.cntClientesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntClientes')),
            catchError((error) => this.handleError('getCntClientesList', error))
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

        params["$expand"] = "CntCodigosCiiu,CntCiudades";

        return this.http.get<any>(this.cntClientesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntClientes")),
            catchError((error) => this.handleError('getCntClientesList', error))
        );
    }

    add(row: CntClientesModel): Observable<CntClientesModel> {
        return this.http.post<CntClientesModel>(this.cntClientesODataUrl, CntClientesModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntClientesModel) => this.log(`added CntClientes w/ id=${_row.ClienteId}`)),
            catchError((error) => this.handleError("addCntClientes", error))
        );
    }

    update(row: CntClientesModel, original: CntClientesModel): Observable<CntClientesModel> {
        const sUrl = `${this.cntClientesUrl}(ClienteId=${original.ClienteId})`;

        let changes = <any>{};
        let _current = CntClientesModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntClientesModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntClientes id=${row.ClienteId}`)),
            catchError((error) => this.handleError("updateCntClientes", error))
        );
    }

    save(row: CntClientesModel, original: CntClientesModel): Observable<CntClientesModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntClientesModel): Observable<any> {
        const sUrl = `${this.cntClientesUrl}(ClienteId=${row.ClienteId})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntClientes id=${row.ClienteId}`)),
            catchError((error) => this.handleError("deleteCntClientes", error))
        );
    }

    saveRows(rows: Array<CntClientesModel>): Observable<any> {
        const _rows = rows.map((row) => CntClientesModel.clone(row));
        return this.http.post<any>(this.cntClientesUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntClientesModel) => this.log(`pasted rows in CntClientes `)),
            catchError((error) => this.handleError("addCntClientes", error))
        );
    }

    batch(row: CntClientesModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.ClienteId = row.ClienteId;

            });

            return this.http.post<any>(`${this.cntClientesODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntClientesModel) => this.log(`executed batch in CntClientes `)),
                catchError((error) => this.handleError("BatchCntClientes", error))
            );
        } else {
            return of({});
        }
    }

    filterCodigoCiiuDescripcion(val: string, pageSize: number = 10): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntCodigosCiiu`;

        let params: any = { };
        params["$filter"] = `contains(CodigoCiiuDescripcion,'${val}')`;
        params["$top"] = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter CodigoCiiuDescripcion id=${val}`)),
            catchError((error) => this.handleError("filterCodigoCiiuDescripcion", error))
        );
    }

    getByIdCodigoCiiuDescripcion(codigoCiiuId: string): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntCodigosCiiu(CodigoCiiuId=${codigoCiiuId})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById CodigoCiiuDescripcion CodigoCiiuId=${codigoCiiuId}`)),
            catchError((error) => this.handleError("getByIdCodigoCiiuDescripcion", error))
        );
    }

    filterCiudadNombreCiudad(val: string, pageSize: number = 10): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntCiudades`;

        let params: any = { };
        params["$filter"] = `contains(CiudadNombreCiudad,'${val}')`;
        params["$top"] = pageSize;

        return this.http.get<any>(sUrl, {params: params}).pipe(
            retry(3),
            tap(_ => this.log(`filter CiudadNombreCiudad id=${val}`)),
            catchError((error) => this.handleError("filterCiudadNombreCiudad", error))
        );
    }

    getByIdCiudadNombreCiudad(ciudadDepartamentoId: number, ciudadid: number): Observable<any> {
        let sUrl = `${this.baseODataUrl}/CntCiudades(CiudadDepartamentoId=${ciudadDepartamentoId}, Ciudadid=${ciudadid})`;

        return this.http.get<any>(sUrl, { }).pipe(
            retry(3),
            tap(_ => this.log(`getById CiudadNombreCiudad CiudadDepartamentoId=${ciudadDepartamentoId}, Ciudadid=${ciudadid}`)),
            catchError((error) => this.handleError("getByIdCiudadNombreCiudad", error))
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

    /** Log a CntClientesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntClientesService: ${message}`);
        console.log(`CntClientesService: ${message}`);
    }
}
