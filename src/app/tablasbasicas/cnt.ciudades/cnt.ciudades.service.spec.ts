// CntCiudades - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { CntCiudadesModel } from './cnt.ciudades.model';
import { CntCiudadesService } from './cnt.ciudades.service';


describe('CntCiudadesService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: CntCiudadesService;

    let rowBase = {
        CiudadDepartamentoId: 5,
        Ciudadid: 5001,
        CntCiudades_Comp: '', //convert(varchar(max),CiudadDepartamentoId) || '/' || convert(varchar(max),Ciudadid) 
        CiudadCodigoPoblado: 5001001,
        CiudadNombreDepartamento: `Antioquia`,
        CiudadNombreCiudad: `Medellín`,
        CiudadNombrePoblado: `El Poblado`,
        CiudadTipoMunicipio: `CM`,
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new CntCiudadesService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new CntCiudadesModel(rowBase);

        service.getById(row.CiudadDepartamentoId, row.Ciudadid).subscribe((value) => {
		    expect(value.CiudadDepartamentoId).toBe(row.CiudadDepartamentoId);
		    expect(value.Ciudadid).toBe(row.Ciudadid);
		    expect(value.CiudadCodigoPoblado).toBe(row.CiudadCodigoPoblado);
		    expect(value.CiudadNombreDepartamento).toBe(row.CiudadNombreDepartamento);
		    expect(value.CiudadNombreCiudad).toBe(row.CiudadNombreCiudad);
		    expect(value.CiudadNombrePoblado).toBe(row.CiudadNombrePoblado);
		    expect(value.CiudadTipoMunicipio).toBe(row.CiudadTipoMunicipio);
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

        let row = new CntCiudadesModel(rowBase);

        service.getById(row.CiudadDepartamentoId, row.Ciudadid).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
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

        let row = new CntCiudadesModel(rowBase);
        row._estado = 'N';
        delete row.CiudadDepartamentoId;
        delete row.Ciudadid;

        //Add - CntCiudades
        service.save(row, row).subscribe(value => {
		    expect(value.CiudadCodigoPoblado).toBe(row.CiudadCodigoPoblado);
		    expect(value.CiudadNombreDepartamento).toBe(row.CiudadNombreDepartamento);
		    expect(value.CiudadNombreCiudad).toBe(row.CiudadNombreCiudad);
		    expect(value.CiudadNombrePoblado).toBe(row.CiudadNombrePoblado);
		    expect(value.CiudadTipoMunicipio).toBe(row.CiudadTipoMunicipio);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new CntCiudadesModel(rowBase);
        row._estado = 'O';
        delete row.CiudadDepartamentoId;
        delete row.Ciudadid;

        //Update - CntCiudades
        service.save(row, row).subscribe(value => {
		    expect(value.CiudadCodigoPoblado).toBe(row.CiudadCodigoPoblado);
		    expect(value.CiudadNombreDepartamento).toBe(row.CiudadNombreDepartamento);
		    expect(value.CiudadNombreCiudad).toBe(row.CiudadNombreCiudad);
		    expect(value.CiudadNombrePoblado).toBe(row.CiudadNombrePoblado);
		    expect(value.CiudadTipoMunicipio).toBe(row.CiudadTipoMunicipio);
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

        let row = new CntCiudadesModel({});
        row.CiudadDepartamentoId = -1;
        row.Ciudadid = -1;

        row._estado = 'O';

        //Update - CntCiudades
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not CntCiudadesModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new CntCiudadesModel(rowBase);
        row._estado = 'O';
        delete row.CiudadDepartamentoId;
        delete row.Ciudadid;

        //Delete - CntCiudades
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

        let row = new CntCiudadesModel({});
        row._estado = 'O';
        row.CiudadDepartamentoId = -1;
        row.Ciudadid = -1;

        //Delete - CntCiudades
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });
});
