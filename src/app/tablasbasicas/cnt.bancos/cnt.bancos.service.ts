import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, retry } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { CntBancosModel } from './cnt.bancos.model';

@Injectable({ providedIn: 'root' })
export class CntBancosService {
    private baseODataUrl = '';  // URL to web api
    private cntBancosODataUrl = '';  // URL to web api
    private cntBancosUrl = '';  // URL to web api

    constructor(private http: HttpClient,
                @Inject('dataBrowserServiceUrl') private dataBrowserServiceUrl: string,
                @Inject('production') private production: boolean) {
        this.baseODataUrl = `${this.dataBrowserServiceUrl}/odata/${this.production ? 'v1' : 'test'}`;
        this.cntBancosODataUrl = `${this.baseODataUrl}/CntBancos`;
        this.cntBancosUrl = `${this.dataBrowserServiceUrl}/CntBancos`;
    }

    getById(bancoId: number): Observable<any> {
        const sUrl = `${this.cntBancosODataUrl}(BancoId=${bancoId})`;

        return this.http.get<any>(sUrl).pipe(
            retry(3),
            tap(() => this.log("fetched CntBancos")),
            catchError((error) => this.handleError("getCntBancos", error))
        );
    }

    getAll(): Observable<any> {
        const params: any = {};

        return this.http.get<any>(this.cntBancosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log('fetched CntBancos')),
            catchError((error) => this.handleError('getCntBancosList', error))
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

        return this.http.get<any>(this.cntBancosODataUrl, { params }).pipe(
            retry(3),
            tap(row => this.log("fetched CntBancos")),
            catchError((error) => this.handleError('getCntBancosList', error))
        );
    }

    add(row: CntBancosModel): Observable<CntBancosModel> {
        return this.http.post<CntBancosModel>(this.cntBancosODataUrl, CntBancosModel.clone(row)).pipe(
            retry(3),
            tap((_row: CntBancosModel) => this.log(`added CntBancos w/ id=${_row.BancoId}`)),
            catchError((error) => this.handleError("addCntBancos", error))
        );
    }

    update(row: CntBancosModel, original: CntBancosModel): Observable<CntBancosModel> {
        const sUrl = `${this.cntBancosUrl}(BancoId=${original.BancoId})`;

        let changes = <any>{};
        let _current = CntBancosModel.clone(row);

        for(var key in _current) {
            if(original[key] !== _current[key]) {
                changes[key] = _current[key];
            }
        }

        return this.http.patch<CntBancosModel>(sUrl, changes).pipe(
            retry(3),
            tap(_ => this.log(`update CntBancos id=${row.BancoId}`)),
            catchError((error) => this.handleError("updateCntBancos", error))
        );
    }

    save(row: CntBancosModel, original: CntBancosModel): Observable<CntBancosModel> {
        if (row._estado === "N") {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntBancosModel): Observable<any> {
        const sUrl = `${this.cntBancosUrl}(BancoId=${row.BancoId})`;

        return this.http.delete(sUrl).pipe(
            retry(3),
            tap(_ => this.log(`filter CntBancos id=${row.BancoId}`)),
            catchError((error) => this.handleError("deleteCntBancos", error))
        );
    }

    saveRows(rows: Array<CntBancosModel>): Observable<any> {
        const _rows = rows.map((row) => CntBancosModel.clone(row));
        return this.http.post<any>(this.cntBancosUrl, _rows).pipe(
            retry(3),
            tap((rrows: CntBancosModel) => this.log(`pasted rows in CntBancos `)),
            catchError((error) => this.handleError("addCntBancos", error))
        );
    }

    batch(row: CntBancosModel, detailRows: Array<any>): Observable<any> {
        if (detailRows.length) {
            detailRows.forEach((detailRow) => {
                detailRow.body.BancoId = row.BancoId;

            });

            return this.http.post<any>(`${this.cntBancosODataUrl}/$batch`,  { requests: detailRows }).pipe(
                retry(3),
                tap((rrows: CntBancosModel) => this.log(`executed batch in CntBancos `)),
                catchError((error) => this.handleError("BatchCntBancos", error))
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

    /** Log a CntBancosService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntBancosService: ${message}`);
        console.log(`CntBancosService: ${message}`);
    }
}
