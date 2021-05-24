// CntFacturaMovimientos - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { CntFacturasModel } from '../cnt.facturas.model';
import { CntFacturaMovimientosModel } from './cnt.facturamovimientos.model';
import { CntFacturasService } from '../cnt.facturas.service';
import { CntFacturaMovimientosService } from './cnt.facturamovimientos.service';


describe('CntFacturaMovimientosService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: CntFacturaMovimientosService;

    let rowBase = {
        FacturaId: 1234,
        FacturaSerie: 1,
        ProductoLinea: `331`,
        CntFacturaMovimientos_Comp: '', //convert(varchar(max),FacturaId) || '/' || convert(varchar(max),FacturaSerie) || '/' || convert(varchar(max),ProductoLinea) 
        FacturaMovimientoCantidad: 5.00,
        FacturaMovimientoValorUnidad: 12345.50,
        FacturaMovimientoTotal: 65000.00,
        invProductos: {
            ProductoLinea: `331`,
            ProductoDescripcion: `MacBook Pro 17 Pulgadas`
        },
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new CntFacturaMovimientosService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new CntFacturaMovimientosModel(rowBase);

        service.getById(row).subscribe((value) => {
		    expect(value.FacturaId).toBe(row.FacturaId);
		    expect(value.FacturaSerie).toBe(row.FacturaSerie);
		    expect(value.ProductoLinea).toBe(row.ProductoLinea);
		    expect(value.FacturaMovimientoCantidad).toBe(row.FacturaMovimientoCantidad);
		    expect(value.FacturaMovimientoValorUnidad).toBe(row.FacturaMovimientoValorUnidad);
		    expect(value.FacturaMovimientoTotal).toBe(row.FacturaMovimientoTotal);
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

        let row = new CntFacturaMovimientosModel(rowBase);

        service.getById(row).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntFacturaMovimientosModel ${JSON.stringify(error)}`);
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

        let row = new CntFacturasModel(rowBase);

        service.getList(row, filter, <any>paginator, <any>sort).subscribe(value => {
          let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#save-Add should return a Add row', (done: DoneFn) => {
        httpClientSpy.post.and.returnValue(asyncData(rowBase));

        let row = new CntFacturaMovimientosModel(rowBase);
        row._estado = 'N';
        delete row.FacturaId;

        //Add - CntFacturaMovimientos
        service.save(row, row).subscribe(value => {
		    expect(value.FacturaMovimientoCantidad).toBe(row.FacturaMovimientoCantidad);
		    expect(value.FacturaMovimientoValorUnidad).toBe(row.FacturaMovimientoValorUnidad);
		    expect(value.FacturaMovimientoTotal).toBe(row.FacturaMovimientoTotal);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new CntFacturaMovimientosModel(rowBase);
        row._estado = 'O';
        delete row.FacturaId;

        //Update - CntFacturaMovimientos
        service.save(row, row).subscribe(value => {
		    expect(value.FacturaMovimientoCantidad).toBe(row.FacturaMovimientoCantidad);
		    expect(value.FacturaMovimientoValorUnidad).toBe(row.FacturaMovimientoValorUnidad);
		    expect(value.FacturaMovimientoTotal).toBe(row.FacturaMovimientoTotal);
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

        let row = new CntFacturaMovimientosModel({});
        row.FacturaId = -1;

        row._estado = 'O';

        //Update - CntFacturaMovimientos
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not CntFacturaMovimientosModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new CntFacturaMovimientosModel(rowBase);
        row._estado = 'O';
        delete row.FacturaId;

        //Delete - CntFacturaMovimientos
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

        let row = new CntFacturaMovimientosModel({});
        row._estado = 'O';
        row.FacturaId = -1;

        //Delete - CntFacturaMovimientos
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });

    it('#filterProductoDescripcion should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.invProductos]}));

        service.filterProductoDescripcion(`MacBook Pro 17 Pulgadas`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].ProductoDescripcion).toBe(`MacBook Pro 17 Pulgadas`);
            done();
        });
    });

    it('#getByIdProductoDescripcion should return One Row', (done: DoneFn) => {
        let row = rowBase.invProductos;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdProductoDescripcion(row.ProductoLinea).subscribe((value) => {
		    expect(value.ProductoLinea).toBe(row.ProductoLinea);
			expect(value.ProductoDescripcion).toBe(row.ProductoDescripcion);
            done();
        });
    });

    it('#getByIdProductoDescripcion should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.invProductos;

        service.getByIdProductoDescripcion(row.ProductoLinea).subscribe(
            (value) => {
                console.log(`#getByIdProductoDescripcion.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not invProductosModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

});
