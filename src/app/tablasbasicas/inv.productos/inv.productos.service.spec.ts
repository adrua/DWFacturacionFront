// invProductos - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { invProductosModel, EnumProductoUnidad, EnumProductoTipo } from './inv.productos.model';
import { invProductosService } from './inv.productos.service';


describe('invProductosService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: invProductosService;

    let rowBase = {
        ProductoLinea: `AA000001`,
        ProductoDescripcion: `Vericueto Acme `,
        ProductoSaldo: 100.00,
        ProductoCosto: 100.00,
        ProductoPrecio: 1100.00,
        Productoiva: 0.1,
        ProductoUnidad: EnumProductoUnidad['Unidades'],
        ProductoCodigoBarra: `A99770200400458`,
        ProductoCantidadMinima: 100.00,
        ProductoCantidadMaxima: 500.00,
        ProductoUbicacion: `Local 1`,
        ProductoTipo: EnumProductoTipo['Fisico'],
        ProductoControlSaldo: false,
        ProductoObservaciones: `No usar en ambientes cerrados
NO
aplicar
en
la
piel
Soluble
en
agua`,
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new invProductosService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new invProductosModel(rowBase);

        service.getById(row.ProductoLinea).subscribe((value) => {
		    expect(value.ProductoLinea).toBe(row.ProductoLinea);
		    expect(value.ProductoDescripcion).toBe(row.ProductoDescripcion);
		    expect(value.ProductoSaldo).toBe(row.ProductoSaldo);
		    expect(value.ProductoCosto).toBe(row.ProductoCosto);
		    expect(value.ProductoPrecio).toBe(row.ProductoPrecio);
		    expect(value.Productoiva).toBe(row.Productoiva);
		    expect(value.ProductoUnidad).toBe(row.ProductoUnidad);
		    expect(value.ProductoCodigoBarra).toBe(row.ProductoCodigoBarra);
		    expect(value.ProductoCantidadMinima).toBe(row.ProductoCantidadMinima);
		    expect(value.ProductoCantidadMaxima).toBe(row.ProductoCantidadMaxima);
		    expect(value.ProductoUbicacion).toBe(row.ProductoUbicacion);
		    expect(value.ProductoTipo).toBe(row.ProductoTipo);
		    expect(value.ProductoControlSaldo).toBe(row.ProductoControlSaldo);
		    expect(value.ProductoObservaciones).toBe(row.ProductoObservaciones);
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

        let row = new invProductosModel(rowBase);

        service.getById(row.ProductoLinea).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
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

        service.getList(filter, <any>paginator, <any>sort).subscribe(value => {
          let result = value?.value;
            expect(result?.length).toEqual(2);
            done();
        });
    });

    it('#save-Add should return a Add row', (done: DoneFn) => {
        httpClientSpy.post.and.returnValue(asyncData(rowBase));

        let row = new invProductosModel(rowBase);
        row._estado = 'N';

        //Add - invProductos
        service.save(row, row).subscribe(value => {
		    expect(value.ProductoDescripcion).toBe(row.ProductoDescripcion);
		    expect(value.ProductoSaldo).toBe(row.ProductoSaldo);
		    expect(value.ProductoCosto).toBe(row.ProductoCosto);
		    expect(value.ProductoPrecio).toBe(row.ProductoPrecio);
		    expect(value.Productoiva).toBe(row.Productoiva);
		    expect(value.ProductoUnidad).toBe(row.ProductoUnidad);
		    expect(value.ProductoCodigoBarra).toBe(row.ProductoCodigoBarra);
		    expect(value.ProductoCantidadMinima).toBe(row.ProductoCantidadMinima);
		    expect(value.ProductoCantidadMaxima).toBe(row.ProductoCantidadMaxima);
		    expect(value.ProductoUbicacion).toBe(row.ProductoUbicacion);
		    expect(value.ProductoTipo).toBe(row.ProductoTipo);
		    expect(value.ProductoControlSaldo).toBe(row.ProductoControlSaldo);
		    expect(value.ProductoObservaciones).toBe(row.ProductoObservaciones);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new invProductosModel(rowBase);
        row._estado = 'O';

        //Update - invProductos
        service.save(row, row).subscribe(value => {
		    expect(value.ProductoDescripcion).toBe(row.ProductoDescripcion);
		    expect(value.ProductoSaldo).toBe(row.ProductoSaldo);
		    expect(value.ProductoCosto).toBe(row.ProductoCosto);
		    expect(value.ProductoPrecio).toBe(row.ProductoPrecio);
		    expect(value.Productoiva).toBe(row.Productoiva);
		    expect(value.ProductoUnidad).toBe(row.ProductoUnidad);
		    expect(value.ProductoCodigoBarra).toBe(row.ProductoCodigoBarra);
		    expect(value.ProductoCantidadMinima).toBe(row.ProductoCantidadMinima);
		    expect(value.ProductoCantidadMaxima).toBe(row.ProductoCantidadMaxima);
		    expect(value.ProductoUbicacion).toBe(row.ProductoUbicacion);
		    expect(value.ProductoTipo).toBe(row.ProductoTipo);
		    expect(value.ProductoControlSaldo).toBe(row.ProductoControlSaldo);
		    expect(value.ProductoObservaciones).toBe(row.ProductoObservaciones);
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

        let row = new invProductosModel({});

        row._estado = 'O';

        //Update - invProductos
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not invProductosModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new invProductosModel(rowBase);
        row._estado = 'O';

        //Delete - invProductos
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

        let row = new invProductosModel({});
        row._estado = 'O';

        //Delete - invProductos
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });
});
