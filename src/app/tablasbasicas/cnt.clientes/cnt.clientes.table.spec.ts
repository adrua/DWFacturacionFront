// CntClientes - Table - Angular Testing
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

import { CntClientesModule } from './cnt.clientes.module';
import { CntClientesModel, EnumClienteClasificacion, EnumClienteTipoID, EnumClienteEstado } from './cnt.clientes.model';
import { CntClientesService } from './cnt.clientes.service';
import { CntClientesMockService } from './cnt.clientes.mockservice.spec';
import { CntClientesTable } from './cnt.clientes.table';
import { CntClientesDialog } from './cnt.clientes.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntClientesTable', () => {
    let component: CntClientesTable;
    let fixture: ComponentFixture<CntClientesTable>;
    let service: CntClientesService;
    let _service: CntClientesService;
    let mockService: CntClientesMockService;
    let translateService: TranslateService;

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

    beforeAll(() => {
        sessionStorage.setItem("token", `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODMyZTQ1MS1iNzljLTRlMGUtODFmNi1jMDg5MjkzYmM1ZDIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjZlNDUzLTZkZWQtNDVkMi1iNDIxLTE0ODk3M2IzN2FkMCIsImdpdmVuX25hbWUiOiJDcmlzdGlhbiBCcm9jaGVybyIsImlkIjoiZWI2NmU0NTMtNmRlZC00NWQyLWI0MjEtMTQ4OTczYjM3YWQwIiwibWFpbCI6ImNyaXN0aWFuYnJvY2hlcm9yQGdtYWlsLmNvbSIsImV4cCI6MTU5NjY1NTY1MywiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.5KKYGhDyRW6q0ucWG3WBcdag3RNRZEKeX7gT-MAWbAY`);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                CntClientesModule
            ],
            declarations: [
                CntClientesTable,
                CntClientesDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new CntClientesMockService();
        TestBed.overrideProvider(CntClientesService, { useValue: mockService });

        service = TestBed.inject(CntClientesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntClientesTable);
        _service = fixture.debugElement.injector.get(CntClientesService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntClientesMockService")
        expect(_service.constructor.name).toBe("CntClientesMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows() ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new CntClientesModel(rowBase));
        mockService.rows.push(new CntClientesModel(rowBase));

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
            let _titulo = translateService.instant('cntClientes._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
