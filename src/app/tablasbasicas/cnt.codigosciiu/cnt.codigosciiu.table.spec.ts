// CntCodigosCiiu - Table - Angular Testing
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

import { CntCodigosCiiuModule } from './cnt.codigosciiu.module';
import { CntCodigosCiiuModel } from './cnt.codigosciiu.model';
import { CntCodigosCiiuService } from './cnt.codigosciiu.service';
import { CntCodigosCiiuMockService } from './cnt.codigosciiu.mockservice.spec';
import { CntCodigosCiiuTable } from './cnt.codigosciiu.table';
import { CntCodigosCiiuDialog } from './cnt.codigosciiu.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntCodigosCiiuTable', () => {
    let component: CntCodigosCiiuTable;
    let fixture: ComponentFixture<CntCodigosCiiuTable>;
    let service: CntCodigosCiiuService;
    let _service: CntCodigosCiiuService;
    let mockService: CntCodigosCiiuMockService;
    let translateService: TranslateService;

    let rowBase = {
        CodigoCiiuId: `.02234`,
        CodigoCiiuDescripcion: `Fabricación de artículos de viaje bolsos de mano y artículos similares elaborados en cuero y fabricación de artículos de talabartería `,
        CodigoCiiuclase: true,
        CodigoCiiugrupo: false,
        CodigoCiiudivision: false,
        CodigoCiiuBloqueo: false,
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
                CntCodigosCiiuModule
            ],
            declarations: [
                CntCodigosCiiuTable,
                CntCodigosCiiuDialog
            ],
            providers: [
                TranslateService, TranslateStore
            ]
        });

        mockService = new CntCodigosCiiuMockService();
        TestBed.overrideProvider(CntCodigosCiiuService, { useValue: mockService });

        service = TestBed.inject(CntCodigosCiiuService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntCodigosCiiuTable);
        _service = fixture.debugElement.injector.get(CntCodigosCiiuService);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        fixture.autoDetectChanges(true);

    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntCodigosCiiuMockService")
        expect(_service.constructor.name).toBe("CntCodigosCiiuMockService")
    });

    it('should display a rows', async () => {
        const [divLoader] = await parallel(() => [ loader.getChildLoader('div.mat-table-scroll') ]);

        const matTable = await divLoader.getHarness(MatTableHarness);
        let [matTableRows] = await parallel(() => [ matTable.getRows() ]);

        expect(matTableRows.length).toBe(0)

        mockService.rows.push(new CntCodigosCiiuModel(rowBase));
        mockService.rows.push(new CntCodigosCiiuModel(rowBase));

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
            let _titulo = translateService.instant('cntCodigosCiiu._titulo');

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);
            expect(matDialog).toBeTruthy();

            const [matCard] = await parallel(() => [ matDialog.getHarness(MatCardHarness) ]);
            expect(await matCard.getTitleText()).toBe(_titulo);
            await matDialog.close();
        }, 1);
    });

});
