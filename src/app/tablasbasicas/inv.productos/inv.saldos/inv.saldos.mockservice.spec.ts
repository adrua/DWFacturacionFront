import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { invProductosModel } from '../inv.productos.model';
import { invSaldosModel } from './inv.saldos.model';

declare var lastError;

@Injectable({ providedIn: 'root' })
export class invSaldosMockService {
    rows: Array<invSaldosModel> = [];
    autoincrement = this.rows.length;

    constructor() { }

    getById(row: invSaldosModel): Observable<any> {
        const _filtered = this.rows.filter((x) => x.ProductoLinea === row.ProductoLinea && x.PeriodoDescripcionx === row.PeriodoDescripcionx);

        let _row = <any>{};

        if (_filtered.length) {
            _row = _filtered[0];
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }
        
        return of(_row);
    }

    getAll(): Observable<any> {
        return of({
            "@odata.count": this.rows.length,
            value: this.rows        
        });
    }

    getList(masterRow: invProductosModel,
            filter: string,
            paginator: any,
            sort: any): Observable<any> {

        let _filtered = [...this.rows];

        if (filter) {
            const _filter = new Function("x", `return ${filter};`);
            _filtered = this.rows.filter((x) => _filter(x));
        }

        if (sort?.active) {
            const _sort = new Function("a", "b", `return (a.${sort.active.column} === b.${sort.active.column}])?0:((a.${sort.active.column}] > b.${sort.active.column}])?1:-1);`);
            _filtered = _filtered.sort((a, b) => _sort(a, b));
            if(sort.direction === "desc") {
                _filtered = _filtered.reverse();
            }
        }

        _filtered = _filtered.slice(paginator.pageIndex * paginator.pageSize, paginator.pageSize);
        return of({
            "@odata.count": _filtered.length,
            value: _filtered        
        });
    }

    add(row: invSaldosModel): Observable<invSaldosModel> {
        let _row = invSaldosModel.clone(row);

        this.rows.push(_row);
        return of(_row);
    }

    update(row: invSaldosModel, original: invSaldosModel): Observable<invSaldosModel> {
        const inx = this.rows.findIndex((x) => x.ProductoLinea === original.ProductoLinea && x.PeriodoDescripcionx === original.PeriodoDescripcionx);

        let _row = null;

        if (inx >= 0) {
            this.rows[inx] = invSaldosModel.clone(row);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    save(row: invSaldosModel, original: invSaldosModel): Observable<invSaldosModel> {
        if (row._estado === 'N') {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: invSaldosModel): Observable<any> {
        const inx = this.rows.findIndex((x) => x.ProductoLinea === row.ProductoLinea && x.PeriodoDescripcionx === row.PeriodoDescripcionx);

        let _row = null;

        if (inx >= 0) {
            this.rows.splice(inx, 1);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    saveRows(rows: Array<invSaldosModel>): Observable<any> {
        const _rows = rows.map((row) => this.add(row));
        return of(_rows);
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.error); // log to console instead

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
