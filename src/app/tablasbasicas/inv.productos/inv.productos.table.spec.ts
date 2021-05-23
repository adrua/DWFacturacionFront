// invProductos - Table - Angular Testing
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

import { invProductosModule } from './inv.productos.module';
import { invProductosModel, EnumProductoUnidad, EnumProductoTipo } from './inv.productos.model';
import { invProductosService } from './inv.productos.service';
import { invProductosMockService } from './inv.productos.mockservice.spec';
import { invProductosTable } from './inv.productos.table';
import { invProductosDialog } from './inv.productos.dialog';
import { invSaldosTable } from './inv.saldos/inv.saldos.table';
import { invSaldosDialog } from './inv.saldos/inv.saldos.dialog';
import { invSaldosService } from './inv.saldos/inv.saldos.service';
import { invSaldosMockService } from './inv.saldos/inv.saldos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('invProductosTable', () => {
    let component: invProductosTable;
    let fixture: ComponentFixture<invProductosTable>;
    let service: invProductosService;
    let _service: invProductosService;
    let mockService: invProductosMockService;
    let translateService: TranslateService;

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
                invProductosTable,
                invProductosDialog,
                invSaldosTable,
                invSaldosDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new invProductosMockService();
        TestBed.overrideProvider(invProductosService, { useValue: mockService });
        TestBed.overrideProvider(invSaldosService, { useValue: new invSaldosMockService() });

        service = TestBed.inject(invProductosService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(invProductosTable);
        _service = fixture.debugElement.injector.get(invProductosService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("invProductosMockService")
        expect(_service.constructor.name).toBe("invProductosMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows({ selector: ".element-row" }) ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new invProductosModel(rowBase));
        mockService.rows.push(new invProductosModel(rowBase));

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
            let _titulo = translateService.instant('invProductos._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
