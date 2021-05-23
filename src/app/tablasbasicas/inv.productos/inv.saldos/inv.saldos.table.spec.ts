// invSaldos - Table - Angular Testing
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

import { invProductosModule } from '../inv.productos.module';
import { invProductosModel } from '../inv.productos.model';
import { invSaldosModel } from './inv.saldos.model';
import { invSaldosService } from './inv.saldos.service';
import { invSaldosMockService } from './inv.saldos.mockservice.spec';
import { invSaldosTable } from './inv.saldos.table';
import { invSaldosDialog } from './inv.saldos.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('invSaldosTable', () => {
    let component: invSaldosTable;
    let fixture: ComponentFixture<invSaldosTable>;
    let service: invSaldosService;
    let _service: invSaldosService;
    let mockService: invSaldosMockService;
    let translateService: TranslateService;

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

    beforeAll(() => {
        sessionStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODMyZTQ1MS1iNzljLTRlMGUtODFmNi1jMDg5MjkzYmM1ZDIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjZlNDUzLTZkZWQtNDVkMi1iNDIxLTE0ODk3M2IzN2FkMCIsImdpdmVuX25hbWUiOiJDcmlzdGlhbiBCcm9jaGVybyIsImlkIjoiZWI2NmU0NTMtNmRlZC00NWQyLWI0MjEtMTQ4OTczYjM3YWQwIiwibWFpbCI6ImNyaXN0aWFuYnJvY2hlcm9yQGdtYWlsLmNvbSIsImV4cCI6MTU5NjY1NTY1MywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.5KKYGhDyRW6q0ucWG3WBcdag3RNRZEKeX7gT-MAWbAY`);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                invProductosModule
            ],
            declarations: [
                invSaldosTable,
                invSaldosDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new invSaldosMockService();
        TestBed.overrideProvider(invSaldosService, { useValue: mockService });

        service = TestBed.inject(invSaldosService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(invSaldosTable);
        _service = fixture.debugElement.injector.get(invSaldosService);
        component = fixture.componentInstance;
        component.masterRow = new invProductosModel(rowBase);

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("invSaldosMockService")
        expect(_service.constructor.name).toBe("invSaldosMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows() ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new invSaldosModel(rowBase));
        mockService.rows.push(new invSaldosModel(rowBase));

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
            let _titulo = translateService.instant('invSaldos._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
