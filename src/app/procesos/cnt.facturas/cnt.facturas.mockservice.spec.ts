import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CntFacturasModel } from './cnt.facturas.model';

declare var lastError;

@Injectable({ providedIn: 'root' })
export class CntFacturasMockService {
    rows: Array<CntFacturasModel> = [];
    autoincrement = this.rows.length;

    rowsCntClientes: Array<any> = [{
        ClienteId: 112,
        ClienteRazonSocial: "Armando escandalo de los rios"
    }];

    constructor() { }

    getById(facturaId: number, facturaSerie: number): Observable<any> {
        const _filtered = this.rows.filter((x) => x.FacturaId === facturaId && x.FacturaSerie === facturaSerie);

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

    getList(filter: string,
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

    add(row: CntFacturasModel): Observable<CntFacturasModel> {
        let _row = CntFacturasModel.clone(row);
        _row.FacturaId = ++this.autoincrement;       

        this.rows.push(_row);
        return of(_row);
    }

    update(row: CntFacturasModel, original: CntFacturasModel): Observable<CntFacturasModel> {
        const inx = this.rows.findIndex((x) => x.FacturaId === original.FacturaId && x.FacturaSerie === original.FacturaSerie);

        let _row = null;

        if (inx >= 0) {
            this.rows[inx] = CntFacturasModel.clone(row);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    save(row: CntFacturasModel, original: CntFacturasModel): Observable<CntFacturasModel> {
        if (row._estado === 'N') {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntFacturasModel): Observable<any> {
        const inx = this.rows.findIndex((x) => x.FacturaId === row.FacturaId && x.FacturaSerie === row.FacturaSerie);

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

    saveRows(rows: Array<CntFacturasModel>): Observable<any> {
        const _rows = rows.map((row) => this.add(row));
        return of(_rows);
    }

    filterClienteRazonSocial(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsCntClientes.filter((x) => x.ClienteRazonSocial.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdClienteRazonSocial(clienteId: number): Observable<any> {
        let _filtered = this.rowsCntClientes.filter((x) => x.ClienteId === clienteId);

        let _row = null;

        if (_filtered.length) {
            _row = _filtered[0];
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
        }

        return of(_row);
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.error(result.error); // log to console instead

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
