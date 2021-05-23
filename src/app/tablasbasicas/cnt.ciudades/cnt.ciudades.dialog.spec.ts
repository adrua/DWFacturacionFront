// CntCiudades - Table - Angular Testing
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
import { CntCiudadesModule } from './cnt.ciudades.module';
import { CntCiudadesModel } from './cnt.ciudades.model';
import { CntCiudadesService } from './cnt.ciudades.service';
import { CntCiudadesMockService } from './cnt.ciudades.mockservice.spec';
import { CntCiudadesDialog } from './cnt.ciudades.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntCiudadesDialog', () => {
    let component: CntCiudadesDialog;
    let fixture: ComponentFixture<CntCiudadesDialog>;
    let service: CntCiudadesService;
    let _service: CntCiudadesService;
    let mockService: CntCiudadesMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        CiudadDepartamentoId: 5,
        Ciudadid: 5001,
        CntCiudadesComp: '', //convert(varchar(max),CiudadDepartamentoId) || '/' || convert(varchar(max),Ciudadid) 
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                CntCiudadesModule
            ],
            declarations: [
                CntCiudadesDialog,
                CntCiudadesDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new CntCiudadesModel(),
                        original: new CntCiudadesModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new CntCiudadesMockService();
        TestBed.overrideProvider(CntCiudadesService, { useValue: mockService });

        service = TestBed.inject(CntCiudadesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntCiudadesDialog);
        _service = fixture.debugElement.injector.get(CntCiudadesService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntCiudadesMockService")
        expect(_service.constructor.name).toBe("CntCiudadesMockService")
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

            const formControls = component.cntCiudadesForm.controls;

            formControls.CiudadDepartamentoId.setValue(rowBase.CiudadDepartamentoId);      
            formControls.Ciudadid.setValue(rowBase.Ciudadid);      
            formControls.CiudadCodigoPoblado.setValue(rowBase.CiudadCodigoPoblado);      
            formControls.CiudadNombreDepartamento.setValue(rowBase.CiudadNombreDepartamento);      
            formControls.CiudadNombreCiudad.setValue(rowBase.CiudadNombreCiudad);      
            formControls.CiudadNombrePoblado.setValue(rowBase.CiudadNombrePoblado);      
            formControls.CiudadTipoMunicipio.setValue(rowBase.CiudadTipoMunicipio);      

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
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.CiudadCodigoPoblado).toBe(rowBase.CiudadCodigoPoblado);
                expect(row.CiudadNombreDepartamento).toBe(rowBase.CiudadNombreDepartamento);
                expect(row.CiudadNombreCiudad).toBe(rowBase.CiudadNombreCiudad);
                expect(row.CiudadNombrePoblado).toBe(rowBase.CiudadNombrePoblado);
                expect(row.CiudadTipoMunicipio).toBe(rowBase.CiudadTipoMunicipio);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedCntCiudades = new CntCiudadesModel(rowBase);
        component.selectedCntCiudades._estado = 'O';
        component.originalCntCiudades = CntCiudadesModel.clone(component.selectedCntCiudades);
        component.originalCntCiudades._estado = 'O';

        mockService.rows.push(component.selectedCntCiudades);
    
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
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.CiudadCodigoPoblado).toBe(rowBase.CiudadCodigoPoblado);
                expect(row.CiudadNombreDepartamento).toBe(rowBase.CiudadNombreDepartamento);
                expect(row.CiudadNombreCiudad).toBe(rowBase.CiudadNombreCiudad);
                expect(row.CiudadNombrePoblado).toBe(rowBase.CiudadNombrePoblado);
                expect(row.CiudadTipoMunicipio).toBe(rowBase.CiudadTipoMunicipio);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedCntCiudades = new CntCiudadesModel(rowBase);
        component.selectedCntCiudades._estado = 'O';
        component.originalCntCiudades = CntCiudadesModel.clone(component.selectedCntCiudades);
        component.originalCntCiudades._estado = 'O';

        mockService.rows.push(component.selectedCntCiudades);
    
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
