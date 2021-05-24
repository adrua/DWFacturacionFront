// CntFacturas - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { CntFacturasModel } from './cnt.facturas.model';
import { CntFacturasService } from './cnt.facturas.service';


describe('CntFacturasService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: CntFacturasService;

    let rowBase = {
        FacturaId: 1234,
        FacturaSerie: 1,
        CntFacturas_Comp: '', //convert(varchar(max),FacturaId) || '/' || convert(varchar(max),FacturaSerie) 
        FacturaFecha: new Date(2011, 12, 12, 12, 0, 0),
        ClienteId: 112,
        FacturaValor: 123455.00,
        FacturaValorNoGravado: 1000.00,
        FacturaImpuestos: 1234.55,
        FacturaTotal: 1456788.00,
        CntClientes: {
            ClienteId: 112,
            ClienteRazonSocial: `Armando escandalo de los rios`
        },
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new CntFacturasService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new CntFacturasModel(rowBase);

        service.getById(row.FacturaId, row.FacturaSerie).subscribe((value) => {
		    expect(value.FacturaId).toBe(row.FacturaId);
		    expect(value.FacturaSerie).toBe(row.FacturaSerie);
		    expect(new Date(value.FacturaFecha)).toEqual(row.FacturaFecha);
		    expect(value.ClienteId).toBe(row.ClienteId);
		    expect(value.FacturaValor).toBe(row.FacturaValor);
		    expect(value.FacturaValorNoGravado).toBe(row.FacturaValorNoGravado);
		    expect(value.FacturaImpuestos).toBe(row.FacturaImpuestos);
		    expect(value.FacturaTotal).toBe(row.FacturaTotal);
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

        let row = new CntFacturasModel(rowBase);

        service.getById(row.FacturaId, row.FacturaSerie).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntFacturasModel ${JSON.stringify(error)}`);
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

        let row = new CntFacturasModel(rowBase);
        row._estado = 'N';
        delete row.FacturaId;

        //Add - CntFacturas
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.FacturaFecha)).toEqual(row.FacturaFecha);
		    expect(value.ClienteId).toBe(row.ClienteId);
		    expect(value.FacturaValor).toBe(row.FacturaValor);
		    expect(value.FacturaValorNoGravado).toBe(row.FacturaValorNoGravado);
		    expect(value.FacturaImpuestos).toBe(row.FacturaImpuestos);
		    expect(value.FacturaTotal).toBe(row.FacturaTotal);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new CntFacturasModel(rowBase);
        row._estado = 'O';
        delete row.FacturaId;

        //Update - CntFacturas
        service.save(row, row).subscribe(value => {
		    expect(new Date(value.FacturaFecha)).toEqual(row.FacturaFecha);
		    expect(value.ClienteId).toBe(row.ClienteId);
		    expect(value.FacturaValor).toBe(row.FacturaValor);
		    expect(value.FacturaValorNoGravado).toBe(row.FacturaValorNoGravado);
		    expect(value.FacturaImpuestos).toBe(row.FacturaImpuestos);
		    expect(value.FacturaTotal).toBe(row.FacturaTotal);
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

        let row = new CntFacturasModel({});
        row.FacturaId = -1;

        row._estado = 'O';

        //Update - CntFacturas
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not CntFacturasModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new CntFacturasModel(rowBase);
        row._estado = 'O';
        delete row.FacturaId;

        //Delete - CntFacturas
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

        let row = new CntFacturasModel({});
        row._estado = 'O';
        row.FacturaId = -1;

        //Delete - CntFacturas
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });

    it('#filterClienteRazonSocial should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.CntClientes]}));

        service.filterClienteRazonSocial(`Armando escandalo de los rios`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].ClienteRazonSocial).toBe(`Armando escandalo de los rios`);
            done();
        });
    });

    it('#getByIdClienteRazonSocial should return One Row', (done: DoneFn) => {
        let row = rowBase.CntClientes;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdClienteRazonSocial(row.ClienteId).subscribe((value) => {
		    expect(value.ClienteId).toBe(row.ClienteId);
			expect(value.ClienteRazonSocial).toBe(row.ClienteRazonSocial);
            done();
        });
    });

    it('#getByIdClienteRazonSocial should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.CntClientes;

        service.getByIdClienteRazonSocial(row.ClienteId).subscribe(
            (value) => {
                console.log(`#getByIdClienteRazonSocial.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntClientesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

});
