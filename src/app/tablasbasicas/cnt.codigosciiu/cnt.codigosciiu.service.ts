import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntCodigosCiiuModel } from './cnt.codigosciiu.model';

@Injectable({ providedIn: 'root' })
export class CntCodigosCiiuService {
    private baseODataUrl = '';  // URL to web api
    private cntCodigosCiiuODataUrl = '';  // URL to web api
    private cntCodigosCiiuUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntCodigosCiiuODataUrl = `${this.baseODataUrl}/CntCodigosCiiu`;
        this.cntCodigosCiiuUrl = `${this.dataBrowserServiceUrl}/CntCodigosCiiu`;
    }

    getById(codigoCiiuId: string): Observable<any> {
        const sUrl = `${this.cntCodigosCiiuODataUrl}(CodigoCiiuId=${codigoCiiuId})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntCodigosCiiu")),
            catchError((error) => this.handleError("getCntCodigosCiiu", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        return this.http.get<any>(this.cntCodigosCiiuODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntCodigosCiiu')),
            catchError((error) => this.handleError('getCntCodigosCiiuList', error))
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

        return this.http.get<any>(this.cntCodigosCiiuODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntCodigosCiiu")),
            catchError((error) => this.handleError('getCntCodigosCiiuList', error))
        );
    }

    add(row: CntCodigosCiiuModel): Observable<CntCodigosCiiuModel> {
        return this.http.post<CntCodigosCiiuModel>(this.cntCodigosCiiuODataUrl, CntCodigosCiiuModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntCodigosCiiuModel) => this.log(`added CntCodigosCiiu w/ id=${_row.CodigoCiiuId}`)),
            catchError((error) => this.handleError("addCntCodigosCiiu", error))
        );
    }

    update(row: CntCodigosCiiuModel, original: CntCodigosCiiuModel): Observable<CntCodigosCiiuModel> {
        const sUrl = `${this.cntCodigosCiiuODataUrl}?keyCodigoCiiuId=${original.CodigoCiiuId}`;

        let changes = <any>{};
        let _current = CntCodigosCiiuModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntCodigosCiiuModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntCodigosCiiu id=${row.CodigoCiiuId}`)),
            catchError((error) => this.handleError("updateCntCodigosCiiu", error))
        );
    }

    save(row: CntCodigosCiiuModel, original: CntCodigosCiiuModel): Observable<CntCodigosCiiuModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntCodigosCiiuModel): Observable<any> {
        const sUrl = `${this.cntCodigosCiiuUrl}(CodigoCiiuId=${row.CodigoCiiuId})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntCodigosCiiu id=${row.CodigoCiiuId}`)),
            catchError((error) => this.handleError("deleteCntCodigosCiiu", error))
        );
    }

    saveRows(rows: Array<CntCodigosCiiuModel>): Observable<any> {
        const _rows = rows.map((row) => CntCodigosCiiuModel.clone(row));
        return this.http.post<any>(this.cntCodigosCiiuUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntCodigosCiiuModel) => this.log(`pasted rows in CntCodigosCiiu `)),
            catchError((error) => this.handleError("addCntCodigosCiiu", error))
        );
    }

    batch(row: CntCodigosCiiuModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.CodigoCiiuId = row.CodigoCiiuId;

            });

            return this.http.post<any>(`${this.cntCodigosCiiuODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntCodigosCiiuModel) => this.log(`executed batch in CntCodigosCiiu `)),
                catchError((error) => this.handleError("BatchCntCodigosCiiu", error))
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

    /** Log a CntCodigosCiiuService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntCodigosCiiuService: ${message}`);
        console.log(`CntCodigosCiiuService: ${message}`);
    }
}
