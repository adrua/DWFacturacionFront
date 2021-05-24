// CntFacturas - Table - Angular Testing
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

import { CntFacturasModule } from './cnt.facturas.module';
import { CntFacturasModel } from './cnt.facturas.model';
import { CntFacturasService } from './cnt.facturas.service';
import { CntFacturasMockService } from './cnt.facturas.mockservice.spec';
import { CntFacturasTable } from './cnt.facturas.table';
import { CntFacturasDialog } from './cnt.facturas.dialog';
import { CntFacturaMovimientosTable } from './cnt.facturamovimientos/cnt.facturamovimientos.table';
import { CntFacturaMovimientosDialog } from './cnt.facturamovimientos/cnt.facturamovimientos.dialog';
import { CntFacturaMovimientosService } from './cnt.facturamovimientos/cnt.facturamovimientos.service';
import { CntFacturaMovimientosMockService } from './cnt.facturamovimientos/cnt.facturamovimientos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntFacturasTable', () => {
    let component: CntFacturasTable;
    let fixture: ComponentFixture<CntFacturasTable>;
    let service: CntFacturasService;
    let _service: CntFacturasService;
    let mockService: CntFacturasMockService;
    let translateService: TranslateService;

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

    beforeAll(() => {
        sessionStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODMyZTQ1MS1iNzljLTRlMGUtODFmNi1jMDg5MjkzYmM1ZDIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjZlNDUzLTZkZWQtNDVkMi1iNDIxLTE0ODk3M2IzN2FkMCIsImdpdmVuX25hbWUiOiJDcmlzdGlhbiBCcm9jaGVybyIsImlkIjoiZWI2NmU0NTMtNmRlZC00NWQyLWI0MjEtMTQ4OTczYjM3YWQwIiwibWFpbCI6ImNyaXN0aWFuYnJvY2hlcm9yQGdtYWlsLmNvbSIsImV4cCI6MTU5NjY1NTY1MywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.5KKYGhDyRW6q0ucWG3WBcdag3RNRZEKeX7gT-MAWbAY`);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                CntFacturasModule
            ],
            declarations: [
                CntFacturasTable,
                CntFacturasDialog,
                CntFacturaMovimientosTable,
                CntFacturaMovimientosDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new CntFacturasMockService();
        TestBed.overrideProvider(CntFacturasService, { useValue: mockService });
        TestBed.overrideProvider(CntFacturaMovimientosService, { useValue: new CntFacturaMovimientosMockService() });

        service = TestBed.inject(CntFacturasService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntFacturasTable);
        _service = fixture.debugElement.injector.get(CntFacturasService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntFacturasMockService")
        expect(_service.constructor.name).toBe("CntFacturasMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows({ selector: ".element-row" }) ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new CntFacturasModel(rowBase));
        mockService.rows.push(new CntFacturasModel(rowBase));

        const toolbarLoader = await loader.getChildLoader('mat-toolbar');
        const toolbarRowLoader = await toolbarLoader.getChildLoader('mat-toolbar-row');
        const refreshIcon = await toolbarRowLoader.getHarness(MatIconHarness.with({name: 'refresh'}));
        const refreshIconHost = await refreshIcon.host();

        await refreshIconHost.click();

        setTimeout(async () => {
            [matTableRows] = await parallel(() => [ matTable.getRows({ selector: ".element-row" }) ]);

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
            let _titulo = translateService.instant('cntFacturas._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
