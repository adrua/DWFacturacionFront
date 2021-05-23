// CntClientes - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { CntClientesModel, EnumClienteClasificacion, EnumClienteTipoID, EnumClienteEstado } from './cnt.clientes.model';
import { CntClientesService } from './cnt.clientes.service';


describe('CntClientesService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: CntClientesService;

    let rowBase = {
        ClienteId: 123456,
        ClienteClasificacion: EnumClienteClasificacion['Juridica'],
        ClienteTipoID: EnumClienteTipoID['Numero_Identificacion_Tributaria'],
        ClienteNit: `1234567890123-1`,
        CodigoCiiuId: `155`,
        ClienteEstado: EnumClienteEstado['Activo'],
        ClienteRazonSocial: `Armando Escandalo de los rios `,
        ClienteDireccion: `Bulgaria #146 y Diego de Almagro Of. 065 Edif. Doral Almagro`,
        CiudadDepartamentoId: 397,
        Ciudadid: 397,
        CntCiudades_Comp: '', //convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
        ClienteTelefono: `02-948-326`,
        ClienteCelular: `57-311 282 42 63`,
        ClienteEmail: `amontes40@hotmail.com`,
        ClienteContacto: `Lucio Quincio Cinccinato`,
        ClienteTelefonoContacto: `02-948-322`,
        ClienteEmailContacto: `adrua@hotmail.com`,
        CntCodigosCiiu: {
            CodigoCiiuId: `155`,
            CodigoCiiuDescripcion: `Venta Pasajes Aereos`
        },
        CntCiudades: {
            CiudadDepartamentoId: 397,
            Ciudadid: 397,
            Cnt: `397`,
            CiudadNombreCiudad: `Cali`
        },
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new CntClientesService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new CntClientesModel(rowBase);

        service.getById(row.ClienteId).subscribe((value) => {
		    expect(value.ClienteId).toBe(row.ClienteId);
		    expect(value.ClienteClasificacion).toBe(row.ClienteClasificacion);
		    expect(value.ClienteTipoID).toBe(row.ClienteTipoID);
		    expect(value.ClienteNit).toBe(row.ClienteNit);
		    expect(value.CodigoCiiuId).toBe(row.CodigoCiiuId);
		    expect(value.ClienteEstado).toBe(row.ClienteEstado);
		    expect(value.ClienteRazonSocial).toBe(row.ClienteRazonSocial);
		    expect(value.ClienteDireccion).toBe(row.ClienteDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.ClienteTelefono).toBe(row.ClienteTelefono);
		    expect(value.ClienteCelular).toBe(row.ClienteCelular);
		    expect(value.ClienteEmail).toBe(row.ClienteEmail);
		    expect(value.ClienteContacto).toBe(row.ClienteContacto);
		    expect(value.ClienteTelefonoContacto).toBe(row.ClienteTelefonoContacto);
		    expect(value.ClienteEmailContacto).toBe(row.ClienteEmailContacto);
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

        let row = new CntClientesModel(rowBase);

        service.getById(row.ClienteId).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
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

        let row = new CntClientesModel(rowBase);
        row._estado = 'N';
        delete row.ClienteId;

        //Add - CntClientes
        service.save(row, row).subscribe(value => {
		    expect(value.ClienteClasificacion).toBe(row.ClienteClasificacion);
		    expect(value.ClienteTipoID).toBe(row.ClienteTipoID);
		    expect(value.ClienteNit).toBe(row.ClienteNit);
		    expect(value.CodigoCiiuId).toBe(row.CodigoCiiuId);
		    expect(value.ClienteEstado).toBe(row.ClienteEstado);
		    expect(value.ClienteRazonSocial).toBe(row.ClienteRazonSocial);
		    expect(value.ClienteDireccion).toBe(row.ClienteDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.ClienteTelefono).toBe(row.ClienteTelefono);
		    expect(value.ClienteCelular).toBe(row.ClienteCelular);
		    expect(value.ClienteEmail).toBe(row.ClienteEmail);
		    expect(value.ClienteContacto).toBe(row.ClienteContacto);
		    expect(value.ClienteTelefonoContacto).toBe(row.ClienteTelefonoContacto);
		    expect(value.ClienteEmailContacto).toBe(row.ClienteEmailContacto);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new CntClientesModel(rowBase);
        row._estado = 'O';
        delete row.ClienteId;

        //Update - CntClientes
        service.save(row, row).subscribe(value => {
		    expect(value.ClienteClasificacion).toBe(row.ClienteClasificacion);
		    expect(value.ClienteTipoID).toBe(row.ClienteTipoID);
		    expect(value.ClienteNit).toBe(row.ClienteNit);
		    expect(value.CodigoCiiuId).toBe(row.CodigoCiiuId);
		    expect(value.ClienteEstado).toBe(row.ClienteEstado);
		    expect(value.ClienteRazonSocial).toBe(row.ClienteRazonSocial);
		    expect(value.ClienteDireccion).toBe(row.ClienteDireccion);
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.ClienteTelefono).toBe(row.ClienteTelefono);
		    expect(value.ClienteCelular).toBe(row.ClienteCelular);
		    expect(value.ClienteEmail).toBe(row.ClienteEmail);
		    expect(value.ClienteContacto).toBe(row.ClienteContacto);
		    expect(value.ClienteTelefonoContacto).toBe(row.ClienteTelefonoContacto);
		    expect(value.ClienteEmailContacto).toBe(row.ClienteEmailContacto);
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

        let row = new CntClientesModel({});
        row.ClienteId = -1;

        row._estado = 'O';

        //Update - CntClientes
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not CntClientesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new CntClientesModel(rowBase);
        row._estado = 'O';
        delete row.ClienteId;

        //Delete - CntClientes
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

        let row = new CntClientesModel({});
        row._estado = 'O';
        row.ClienteId = -1;

        //Delete - CntClientes
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });

    it('#filterCodigoCiiuDescripcion should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.CntCodigosCiiu]}));

        service.filterCodigoCiiuDescripcion(`Venta Pasajes Aereos`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].CodigoCiiuDescripcion).toBe(`Venta Pasajes Aereos`);
            done();
        });
    });

    it('#getByIdCodigoCiiuDescripcion should return One Row', (done: DoneFn) => {
        let row = rowBase.CntCodigosCiiu;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdCodigoCiiuDescripcion(row.CodigoCiiuId).subscribe((value) => {
		    expect(value.CodigoCiiuId).toBe(row.CodigoCiiuId);
			expect(value.CodigoCiiuDescripcion).toBe(row.CodigoCiiuDescripcion);
            done();
        });
    });

    it('#getByIdCodigoCiiuDescripcion should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.CntCodigosCiiu;

        service.getByIdCodigoCiiuDescripcion(row.CodigoCiiuId).subscribe(
            (value) => {
                console.log(`#getByIdCodigoCiiuDescripcion.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntCodigosCiiuModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#filterCiudadNombreCiudad should return value from observable', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData({value : [rowBase.CntCiudades]}));

        service.filterCiudadNombreCiudad(`Cali`).subscribe(value => {
            expect(value?.value?.length).toBe(1);
            expect(value.value[0].CiudadNombreCiudad).toBe(`Cali`);
            done();
        });
    });

    it('#getByIdCiudadNombreCiudad should return One Row', (done: DoneFn) => {
        let row = rowBase.CntCiudades;

        httpClientSpy.get.and.returnValue(asyncData(row));

        service.getByIdCiudadNombreCiudad(row.CiudadDepartamentoId, row.Ciudadid).subscribe((value) => {
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
			expect(value.CiudadNombreCiudad).toBe(row.CiudadNombreCiudad);
            done();
        });
    });

    it('#getByIdCiudadNombreCiudad should return 404 Not found', (done: DoneFn) => {
        const errorResponse = new HttpErrorResponse({
            error: 'Not Found',
            status: 404,
            statusText: 'Not Found'
        });

        httpClientSpy.get.and.returnValue(asyncError(errorResponse));

        let row = rowBase.CntCiudades;

        service.getByIdCiudadNombreCiudad(row.CiudadDepartamentoId, row.Ciudadid).subscribe(
            (value) => {
                console.log(`#getByIdCiudadNombreCiudad.Error: ${JSON.stringify(value)}`);
                expect(value.statusText).toEqual('Not Found')
                expect(value.status).toBe(404)
                done();
            },
            (error) => {
                fail(`expected an error, not CntCiudadesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });

});
