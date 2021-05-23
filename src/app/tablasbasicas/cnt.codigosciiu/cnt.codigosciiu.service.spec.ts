// CntCodigosCiiu - Service - Angular Testing
import { asyncData, asyncError } from 'src/testing/async-observable-helpers';
import { HttpErrorResponse } from '@angular/common/http';

import { CntCodigosCiiuModel } from './cnt.codigosciiu.model';
import { CntCodigosCiiuService } from './cnt.codigosciiu.service';


describe('CntCodigosCiiuService', () => {
    let httpClientSpy: {
      get: jasmine.Spy,
      post: jasmine.Spy,
      put: jasmine.Spy,
      patch: jasmine.Spy,
      delete: jasmine.Spy
    };

    let service: CntCodigosCiiuService;

    let rowBase = {
        CodigoCiiuId: `.02234`,
        CodigoCiiuDescripcion: `Fabricación de artículos de viaje bolsos de mano y artículos similares elaborados en cuero y fabricación de artículos de talabartería `,
        CodigoCiiuclase: true,
        CodigoCiiugrupo: false,
        CodigoCiiudivision: false,
        CodigoCiiuBloqueo: false,
        _estado: ''
    };

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'patch', 'delete']);
        service = new CntCodigosCiiuService(httpClientSpy as any);
    });

    it('#getById should return One Row', (done: DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(rowBase));

        let row = new CntCodigosCiiuModel(rowBase);

        service.getById(row.CodigoCiiuId).subscribe((value) => {
		    expect(value.CodigoCiiuId).toBe(row.CodigoCiiuId);
		    expect(value.CodigoCiiuDescripcion).toBe(row.CodigoCiiuDescripcion);
		    expect(value.CodigoCiiuclase).toBe(row.CodigoCiiuclase);
		    expect(value.CodigoCiiugrupo).toBe(row.CodigoCiiugrupo);
		    expect(value.CodigoCiiudivision).toBe(row.CodigoCiiudivision);
		    expect(value.CodigoCiiuBloqueo).toBe(row.CodigoCiiuBloqueo);
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

        let row = new CntCodigosCiiuModel(rowBase);

        service.getById(row.CodigoCiiuId).subscribe((value) => {
                console.log(`#getById.Error: ${JSON.stringify(value)}`);
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

        let row = new CntCodigosCiiuModel(rowBase);
        row._estado = 'N';
        delete row.CodigoCiiuId;

        //Add - CntCodigosCiiu
        service.save(row, row).subscribe(value => {
		    expect(value.CodigoCiiuDescripcion).toBe(row.CodigoCiiuDescripcion);
		    expect(value.CodigoCiiuclase).toBe(row.CodigoCiiuclase);
		    expect(value.CodigoCiiugrupo).toBe(row.CodigoCiiugrupo);
		    expect(value.CodigoCiiudivision).toBe(row.CodigoCiiudivision);
		    expect(value.CodigoCiiuBloqueo).toBe(row.CodigoCiiuBloqueo);
            done();
        });
    });

    it('#save-Update should return a updated row', (done: DoneFn) => {
        httpClientSpy.patch.and.returnValue(asyncData(rowBase));

        let row = new CntCodigosCiiuModel(rowBase);
        row._estado = 'O';
        delete row.CodigoCiiuId;

        //Update - CntCodigosCiiu
        service.save(row, row).subscribe(value => {
		    expect(value.CodigoCiiuDescripcion).toBe(row.CodigoCiiuDescripcion);
		    expect(value.CodigoCiiuclase).toBe(row.CodigoCiiuclase);
		    expect(value.CodigoCiiugrupo).toBe(row.CodigoCiiugrupo);
		    expect(value.CodigoCiiudivision).toBe(row.CodigoCiiudivision);
		    expect(value.CodigoCiiuBloqueo).toBe(row.CodigoCiiuBloqueo);
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

        let row = new CntCodigosCiiuModel({});
        row.CodigoCiiuId = ".";

        row._estado = 'O';

        //Update - CntCodigosCiiu
        service.save(row, row).subscribe(
            (value) => {
                expect((<any>value).statusText).toEqual("Not Found");
                expect((<any>value).status).toEqual(404);
                done();
            },
            (error) => {
                fail(`expected an error for update, not CntCodigosCiiuModel ${JSON.stringify(error)}`);
                done();
            }
        );
    });


    it('#delete should return null', (done: DoneFn) => {
        httpClientSpy.delete.and.returnValue(asyncData(true));

        let row = new CntCodigosCiiuModel(rowBase);
        row._estado = 'O';
        delete row.CodigoCiiuId;

        //Delete - CntCodigosCiiu
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

        let row = new CntCodigosCiiuModel({});
        row._estado = 'O';
        row.CodigoCiiuId = ".";

        //Delete - CntCodigosCiiu
        service.delete(row).subscribe(value => {
            expect(value.statusText).toEqual("Not Found");
            expect(value.status).toEqual(404);
            done();
        });
    });
});
