import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CntClientesModel } from './cnt.clientes.model';

declare var lastError;

@Injectable({ providedIn: 'root' })
export class CntClientesMockService {
    rows: Array<CntClientesModel> = [];
    autoincrement = this.rows.length;

    rowsCntCodigosCiiu: Array<any> = [{
        CodigoCiiuId: "165",
        CodigoCiiuDescripcion: "Venta Pasajes Aereos"
    }];

    rowsCntCiudades: Array<any> = [{
        CiudadDepartamentoId: 407,
        Ciudadid: 407,
        Cnt: "407",
        CiudadNombreCiudad: "Cali"
    }];

    constructor() { }

    getById(clienteId: number): Observable<any> {
        const _filtered = this.rows.filter((x) => x.ClienteId === clienteId);

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

    add(row: CntClientesModel): Observable<CntClientesModel> {
        let _row = CntClientesModel.clone(row);

        this.rows.push(_row);
        return of(_row);
    }

    update(row: CntClientesModel, original: CntClientesModel): Observable<CntClientesModel> {
        const inx = this.rows.findIndex((x) => x.ClienteId === original.ClienteId);

        let _row = null;

        if (inx >= 0) {
            this.rows[inx] = CntClientesModel.clone(row);
        } else {
            _row = {
                status: 404,
                statusText: "OK"
            };
            lastError = _row;
        }

        return of(_row);
    }

    save(row: CntClientesModel, original: CntClientesModel): Observable<CntClientesModel> {
        if (row._estado === 'N') {
            return this.add(row);
        } else {
            return this.update(row, original);
        }
    }

    delete(row: CntClientesModel): Observable<any> {
        const inx = this.rows.findIndex((x) => x.ClienteId === row.ClienteId);

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

    saveRows(rows: Array<CntClientesModel>): Observable<any> {
        const _rows = rows.map((row) => this.add(row));
        return of(_rows);
    }

    filterCodigoCiiuDescripcion(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsCntCodigosCiiu.filter((x) => x.CodigoCiiuDescripcion.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdCodigoCiiuDescripcion(codigoCiiuId: string): Observable<any> {
        let _filtered = this.rowsCntCodigosCiiu.filter((x) => x.CodigoCiiuId === codigoCiiuId);

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

    filterCiudadNombreCiudad(val: string, pageSize: number = 10): Observable<any> {
        let _filtered = this.rowsCntCiudades.filter((x) => x.CiudadNombreCiudad.includes(val)).slice(0, pageSize);
        
        return of(_filtered);
    }

    getByIdCiudadNombreCiudad(ciudadDepartamentoId: number, ciudadid: number): Observable<any> {
        let _filtered = this.rowsCntCiudades.filter((x) => x.CiudadDepartamentoId === ciudadDepartamentoId && x.Ciudadid === ciudadid);

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

    /** Log a CntClientesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`CntClientesService: ${message}`);
        console.log(`CntClientesService: ${message}`);
    }

}
