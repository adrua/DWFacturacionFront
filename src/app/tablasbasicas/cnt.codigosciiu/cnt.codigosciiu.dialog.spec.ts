// CntCodigosCiiu - Table - Angular Testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SharedModule } from 'src/app/app.shared.module';
import { CntCodigosCiiuModule } from './cnt.codigosciiu.module';
import { CntCodigosCiiuModel } from './cnt.codigosciiu.model';
import { CntCodigosCiiuService } from './cnt.codigosciiu.service';
import { CntCodigosCiiuMockService } from './cnt.codigosciiu.mockservice.spec';
import { CntCodigosCiiuDialog } from './cnt.codigosciiu.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntCodigosCiiuDialog', () => {
    let component: CntCodigosCiiuDialog;
    let fixture: ComponentFixture<CntCodigosCiiuDialog>;
    let service: CntCodigosCiiuService;
    let _service: CntCodigosCiiuService;
    let mockService: CntCodigosCiiuMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        CodigoCiiuId: `.02234`,
        CodigoCiiuDescripcion: `Fabricación de artículos de viaje bolsos de mano y artículos similares elaborados en cuero y fabricación de artículos de talabartería`,
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                CntCodigosCiiuModule
            ],
            declarations: [
                CntCodigosCiiuDialog,
                CntCodigosCiiuDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new CntCodigosCiiuModel(),
                        original: new CntCodigosCiiuModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new CntCodigosCiiuMockService();
        TestBed.overrideProvider(CntCodigosCiiuService, { useValue: mockService });

        service = TestBed.inject(CntCodigosCiiuService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntCodigosCiiuDialog);
        _service = fixture.debugElement.injector.get(CntCodigosCiiuService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntCodigosCiiuMockService")
        expect(_service.constructor.name).toBe("CntCodigosCiiuMockService")
    });

    it('should display a Dialog for Add', async () => {
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);

            const [btnGuardar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);

            let btnEliminar: HarnessLoader;
            try {
                [btnEliminar] = await parallel(() => [ 
                    matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar }))
                ]);    
            } catch {    
                //No Hacer nada
            }
        
            expect(await btnGuardar.isDisabled()).toBeTruthy();
            expect(btnEliminar).toBeUndefined();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            const formControls = component.cntCodigosCiiuForm.controls;

            formControls.CodigoCiiuId.setValue(rowBase.CodigoCiiuId);      
            formControls.CodigoCiiuDescripcion.setValue(rowBase.CodigoCiiuDescripcion);      
            formControls.CodigoCiiuclase.setValue(rowBase.CodigoCiiuclase);      
            formControls.CodigoCiiugrupo.setValue(rowBase.CodigoCiiugrupo);      
            formControls.CodigoCiiudivision.setValue(rowBase.CodigoCiiudivision);      
            formControls.CodigoCiiuBloqueo.setValue(rowBase.CodigoCiiuBloqueo);      

            expect(component.getErrorMessages()).toBe(_sinErrores);

            try {
                [btnEliminar] = await parallel(() => [ 
                    matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar }))
                ]);    
            } catch {
                //No Hacer nada
            }

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(btnEliminar).toBeUndefined();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

        
            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('N');
                expect(mockService.rows.length).toBe(1, 'No se guardo la fila');
        
                let row = mockService.rows[0];
                expect(row.CodigoCiiuId).toBe(rowBase.CodigoCiiuId);
                expect(row.CodigoCiiuDescripcion).toBe(rowBase.CodigoCiiuDescripcion);
                expect(row.CodigoCiiuclase).toBe(rowBase.CodigoCiiuclase);
                expect(row.CodigoCiiugrupo).toBe(rowBase.CodigoCiiugrupo);
                expect(row.CodigoCiiudivision).toBe(rowBase.CodigoCiiudivision);
                expect(row.CodigoCiiuBloqueo).toBe(rowBase.CodigoCiiuBloqueo);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedCntCodigosCiiu = new CntCodigosCiiuModel(rowBase);
        component.selectedCntCodigosCiiu._estado = 'O';
        component.originalCntCodigosCiiu = CntCodigosCiiuModel.clone(component.selectedCntCodigosCiiu);
        component.originalCntCodigosCiiu._estado = 'O';

        mockService.rows.push(component.selectedCntCodigosCiiu);
    
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);
            
            let [btnGuardar, btnEliminar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);

            expect(component.getErrorMessages()).toBe(_sinErrores);

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(await btnEliminar.isDisabled()).toBeFalsy();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('O');
                expect(mockService.rows.length).toBe(1, 'No se guardo la fila');
            
                let row = mockService.rows[0];
                expect(row.CodigoCiiuId).toBe(rowBase.CodigoCiiuId);
                expect(row.CodigoCiiuDescripcion).toBe(rowBase.CodigoCiiuDescripcion);
                expect(row.CodigoCiiuclase).toBe(rowBase.CodigoCiiuclase);
                expect(row.CodigoCiiugrupo).toBe(rowBase.CodigoCiiugrupo);
                expect(row.CodigoCiiudivision).toBe(rowBase.CodigoCiiudivision);
                expect(row.CodigoCiiuBloqueo).toBe(rowBase.CodigoCiiuBloqueo);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedCntCodigosCiiu = new CntCodigosCiiuModel(rowBase);
        component.selectedCntCodigosCiiu._estado = 'O';
        component.originalCntCodigosCiiu = CntCodigosCiiuModel.clone(component.selectedCntCodigosCiiu);
        component.originalCntCodigosCiiu._estado = 'O';

        mockService.rows.push(component.selectedCntCodigosCiiu);
    
        fixture.autoDetectChanges(true);

        setTimeout(async () => {
            let _guardar = translateService.instant('sktmngrModules._guardar');
            let _eliminar = translateService.instant('sktmngrModules._eliminar');
            let _cancelar = translateService.instant('sktmngrModules._cancelar');
            let _sinErrores = translateService.instant('alertas._sinErrores');
            let _alertaAceptar = translateService.instant('alertasBotones.aceptar');

            const [matCardActions] = await parallel(() => [ loader.getChildLoader('mat-card mat-card-actions') ]);
            
            let [btnGuardar, btnEliminar, btnCancelar] = await parallel(() => [ 
                matCardActions.getHarness(MatButtonHarness.with({ text: _guardar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _eliminar })),
                matCardActions.getHarness(MatButtonHarness.with({ text: _cancelar })),
            ]);
        
            expect(component.getErrorMessages()).toBe(_sinErrores);

            expect(await btnGuardar.isDisabled()).toBeFalsy();
            expect(await btnEliminar.isDisabled()).toBeFalsy();
            expect(await btnCancelar.isDisabled()).toBeFalsy();

            await btnEliminar.click();

            const [matDialog] = await parallel(() => [ rootLoader.getHarness(MatDialogHarness) ]);

            const okButton = await matDialog.getHarness(MatButtonHarness.with({ text: _alertaAceptar }));

            mockMatDialogRef.close = (result) => {
                expect(result.data._estado).toBe('D');
                expect(mockService.rows.length).toBe(0, 'No se elimino la fila');
            };

            await okButton.click();
        }, 1);
    });
});
