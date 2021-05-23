// CntCiudades - Table - Angular Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService, TranslateStore } from '@ngx-translate/core';

import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatCardHarness } from '@angular/material/card/testing';

import { CntCiudadesModule } from './cnt.ciudades.module';
import { CntCiudadesModel } from './cnt.ciudades.model';
import { CntCiudadesService } from './cnt.ciudades.service';
import { CntCiudadesMockService } from './cnt.ciudades.mockservice.spec';
import { CntCiudadesTable } from './cnt.ciudades.table';
import { CntCiudadesDialog } from './cnt.ciudades.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntCiudadesTable', () => {
    let component: CntCiudadesTable;
    let fixture: ComponentFixture<CntCiudadesTable>;
    let service: CntCiudadesService;
    let _service: CntCiudadesService;
    let mockService: CntCiudadesMockService;
    let translateService: TranslateService;

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

    beforeAll(() => {
        sessionStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODMyZTQ1MS1iNzljLTRlMGUtODFmNi1jMDg5MjkzYmM1ZDIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjZlNDUzLTZkZWQtNDVkMi1iNDIxLTE0ODk3M2IzN2FkMCIsImdpdmVuX25hbWUiOiJDcmlzdGlhbiBCcm9jaGVybyIsImlkIjoiZWI2NmU0NTMtNmRlZC00NWQyLWI0MjEtMTQ4OTczYjM3YWQwIiwibWFpbCI6ImNyaXN0aWFuYnJvY2hlcm9yQGdtYWlsLmNvbSIsImV4cCI6MTU5NjY1NTY1MywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.5KKYGhDyRW6q0ucWG3WBcdag3RNRZEKeX7gT-MAWbAY`);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                CntCiudadesModule
            ],
            declarations: [
                CntCiudadesTable,
                CntCiudadesDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new CntCiudadesMockService();
        TestBed.overrideProvider(CntCiudadesService, { useValue: mockService });

        service = TestBed.inject(CntCiudadesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntCiudadesTable);
        _service = fixture.debugElement.injector.get(CntCiudadesService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntCiudadesMockService")
        expect(_service.constructor.name).toBe("CntCiudadesMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows() ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new CntCiudadesModel(rowBase));
        mockService.rows.push(new CntCiudadesModel(rowBase));

        const toolbarLoader = await loader.getChildLoader('mat-toolbar');
        const toolbarRowLoader = await toolbarLoader.getChildLoader('mat-toolbar-row');
        const refreshIcon = await toolbarRowLoader.getHarness(MatIconHarness.with({name: 'refresh'}));
        const refreshIconHost = await refreshIcon.host();

        await refreshIconHost.click();

        setTimeout(async () => {
            [matTableRows] = await parallel(() => [ matTable.getRows() ]);

            expect(matTableRows.length).toBe(2);
        }, 1);
    });

    it('should display a Dialog for Add', async () => {
        const toolbarLoader = await loader.getChildLoader('mat-toolbar');
        const toolbarRowLoader = await toolbarLoader.getChildLoader('mat-toolbar-row');
        const addIcon = await toolbarRowLoader.getHarness(MatIconHarness.with({name: 'add'}));
        const addIconHost = await addIcon.host();

        await addIconHost.click();

        setTimeout(async () => {
            let _titulo = translateService.instant('cntCiudades._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
