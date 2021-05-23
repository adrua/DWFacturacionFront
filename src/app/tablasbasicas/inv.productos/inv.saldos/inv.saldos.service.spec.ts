// invSaldos - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { invProductosModel } from '../inv.productos.model';
import { invSaldosModel } from './inv.saldos.model';
import { invProductosService } from '../inv.productos.service';
import { invSaldosService } from './inv.saldos.service';


describe('invSaldosService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: invSaldosService;

    let rowBase = {
        ProductoLinea: `AA000001`,
        PeriodoDescripcionx: `Enero 2014`,
        invSaldos_Comp: '', //convert(varchar(max),ProductoLinea) || '/' || convert(varchar(max),PeriodoDescripcionx) 
        InvSaldosCantidad: 200.00,
        InvSaldosValor: 100.00,
        InvSaldosTotal: 2000.00,
        InvSaldosValorPromedio: 100.00,
        InvSaldosUltimoValor: 120.00,
        InvSaldosMaximoValor: 180.00,
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new invSaldosService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new invSaldosModel(rowBase);

        service.getById(row).subscribe((value) => {
		    expect(value.ProductoLinea).toBe(row.ProductoLinea);
		    expect(value.PeriodoDescripcionx).toBe(row.PeriodoDescripcionx);
		    expect(value.InvSaldosCantidad).toBe(row.InvSaldosCantidad);
		    expect(value.InvSaldosValor).toBe(row.InvSaldosValor);
		    expect(value.InvSaldosTotal).toBe(row.InvSaldosTotal);
		    expect(value.InvSaldosValorPromedio).toBe(row.InvSaldosValorPromedio);
		    expect(value.InvSaldosUltimoValor).toBe(row.InvSaldosUltimoValor);
		    expect(value.InvSaldosMaximoValor).toBe(row.InvSaldosMaximoValor);
            done();
        });
    });

    it('#getById should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = new invSaldosModel(rowBase);

        service.getById(row).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not invSaldosModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

    it('#getAll should return array of rows', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({ value: [rowBase, rowBase] }));

        service.getAll().subscribe(value => {
            let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#getList return array of rows', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({ value: [rowBase, rowBase] }));

        let filter = '';

        let paginator = {
            pageIndex: 0,
            pageSize: 10
        };

        let sort = {
            active: '',
            direction: ''
        };

        let row = new invProductosModel(rowBase);

        service.getList(row, filter, <any>paginator, <any>sort).subscribe(value => {
          let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#save-Add should return a Add row', (done: DoneFn) => {
        httpClientSpy.post.and.returnValue(asyncData(rowBase));

        let row = new invSaldosModel(rowBase);
        row._estado = 'N';

        //Add - invSaldos
        service.save(row, row).subscribe(value => {
		    expect(value.InvSaldosCantidad).toBe(row.InvSaldosCantidad);
		    expect(value.InvSaldosValor).toBe(row.InvSaldosValor);
		    expect(value.InvSaldosTotal).toBe(row.InvSaldosTotal);
		    expect(value.InvSaldosValorPromedio).toBe(row.InvSaldosValorPromedio);
		    expect(value.InvSaldosUltimoValor).toBe(row.InvSaldosUltimoValor);
		    expect(value.InvSaldosMaximoValor).toBe(row.InvSaldosMaximoValor);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new invSaldosModel(rowBase);
        row._estado = 'O';

        //Update - invSaldos
        service.save(row, row).subscribe(value => {
		    expect(value.InvSaldosCantidad).toBe(row.InvSaldosCantidad);
		    expect(value.InvSaldosValor).toBe(row.InvSaldosValor);
		    expect(value.InvSaldosTotal).toBe(row.InvSaldosTotal);
		    expect(value.InvSaldosValorPromedio).toBe(row.InvSaldosValorPromedio);
		    expect(value.InvSaldosUltimoValor).toBe(row.InvSaldosUltimoValor);
		    expect(value.InvSaldosMaximoValor).toBe(row.InvSaldosMaximoValor);
            done();
        });
    });

    it('#save-update should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.patch.and.returnValue(asyncError(errorResponse));

        let row = new invSaldosModel({});

        row._estado = 'O';

        //Update - invSaldos
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not invSaldosModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new invSaldosModel(rowBase);
        row._estado = 'O';

        //Delete - invSaldos
        service.delete(row).subscribe(value => {
            expect(value).toBe(true);
            done();
        });
    });

    it('#delete should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.delete.and.returnValue(asyncError(errorResponse));

        let row = new invSaldosModel({});
        row._estado = 'O';

        //Delete - invSaldos
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });
});
