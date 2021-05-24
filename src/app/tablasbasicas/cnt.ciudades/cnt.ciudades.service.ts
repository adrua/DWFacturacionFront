import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntCiudadesModel } from './cnt.ciudades.model';

@Injectable({ providedIn: 'root' })
export class CntCiudadesService {
    private baseODataUrl = '';  // URL to web api
    private cntCiudadesODataUrl = '';  // URL to web api
    private cntCiudadesUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntCiudadesODataUrl = `${this.baseODataUrl}/CntCiudades`;
        this.cntCiudadesUrl = `${this.dataBrowserServiceUrl}/CntCiudades`;
    }

    getById(ciudadDepartamentoId: number, ciudadid: number): Observable<any> {
        const sUrl = `${this.cntCiudadesODataUrl}(CiudadDepartamentoId=${ciudadDepartamentoId}, Ciudadid=${ciudadid})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntCiudades")),
            catchError((error) => this.handleError("getCntCiudades", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        return this.http.get<any>(this.cntCiudadesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntCiudades')),
            catchError((error) => this.handleError('getCntCiudadesList', error))
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

        return this.http.get<any>(this.cntCiudadesODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntCiudades")),
            catchError((error) => this.handleError('getCntCiudadesList', error))
        );
    }

    add(row: CntCiudadesModel): Observable<CntCiudadesModel> {
        return this.http.post<CntCiudadesModel>(this.cntCiudadesODataUrl, CntCiudadesModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntCiudadesModel) => this.log(`added CntCiudades w/ id=${_row.CiudadDepartamentoId}`)),
            catchError((error) => this.handleError("addCntCiudades", error))
        );
    }

    update(row: CntCiudadesModel, original: CntCiudadesModel): Observable<CntCiudadesModel> {
        const sUrl = `${this.cntCiudadesODataUrl}?keyCiudadDepartamentoId=${original.CiudadDepartamentoId}&keyCiudadid=${original.Ciudadid}`;

        let changes = <any>{};
        let _current = CntCiudadesModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntCiudadesModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntCiudades id=${row.CiudadDepartamentoId}`)),
            catchError((error) => this.handleError("updateCntCiudades", error))
        );
    }

    save(row: CntCiudadesModel, original: CntCiudadesModel): Observable<CntCiudadesModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntCiudadesModel): Observable<any> {
        const sUrl = `${this.cntCiudadesUrl}(CiudadDepartamentoId=${row.CiudadDepartamentoId}, Ciudadid=${row.Ciudadid})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntCiudades id=${row.CiudadDepartamentoId}`)),
            catchError((error) => this.handleError("deleteCntCiudades", error))
        );
    }

    saveRows(rows: Array<CntCiudadesModel>): Observable<any> {
        const _rows = rows.map((row) => CntCiudadesModel.clone(row));
        return this.http.post<any>(this.cntCiudadesUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntCiudadesModel) => this.log(`pasted rows in CntCiudades `)),
            catchError((error) => this.handleError("addCntCiudades", error))
        );
    }

    batch(row: CntCiudadesModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.CiudadDepartamentoId = row.CiudadDepartamentoId;
                detailRow.body.Ciudadid = row.Ciudadid;

            });

            return this.http.post<any>(`${this.cntCiudadesODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntCiudadesModel) => this.log(`executed batch in CntCiudades `)),
                catchError((error) => this.handleError("BatchCntCiudades", error))
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

    /** Log a CntCiudadesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntCiudadesService: ${message}`);
        console.log(`CntCiudadesService: ${message}`);
    }
}
