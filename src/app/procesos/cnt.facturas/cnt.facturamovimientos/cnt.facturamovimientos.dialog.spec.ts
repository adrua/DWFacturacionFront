// CntFacturaMovimientos - Table - Angular Testing
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
import { CntFacturasModule } from '../cnt.facturas.module';
import { CntFacturasModel } from '../cnt.facturas.model';
import { CntFacturaMovimientosModel } from './cnt.facturamovimientos.model';
import { CntFacturaMovimientosDialog } from './cnt.facturamovimientos.dialog';
import { CntFacturaMovimientosService } from './cnt.facturamovimientos.service';
import { CntFacturaMovimientosMockService } from './cnt.facturamovimientos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntFacturaMovimientosDialog', () => {
    let component: CntFacturaMovimientosDialog;
    let fixture: ComponentFixture<CntFacturaMovimientosDialog>;
    let service: CntFacturaMovimientosService;
    let _service: CntFacturaMovimientosService;
    let mockService: CntFacturaMovimientosMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        FacturaId: 1234,
        FacturaSerie: 1,
        ProductoLinea: `331`,
        CntFacturaMovimientosComp: '', //convert(varchar(max),FacturaId) || '/' || convert(varchar(max),FacturaSerie) || '/' || convert(varchar(max),ProductoLinea) 
        FacturaMovimientoCantidad: 5.00,
        FacturaMovimientoValorUnidad: 12345.50,
        FacturaMovimientoTotal: 65000.00,
        invProductos: {
            ProductoLinea: `331`,
            ProductoDescripcion: `MacBook Pro 17 Pulgadas`
        },
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
                CntFacturasModule
            ],
            declarations: [
                CntFacturaMovimientosDialog,
                CntFacturaMovimientosDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new CntFacturaMovimientosModel(),
                        original: new CntFacturaMovimientosModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new CntFacturaMovimientosMockService();
        TestBed.overrideProvider(CntFacturaMovimientosService, { useValue: mockService });

        service = TestBed.inject(CntFacturaMovimientosService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntFacturaMovimientosDialog);
        _service = fixture.debugElement.injector.get(CntFacturaMovimientosService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntFacturaMovimientosMockService")
        expect(_service.constructor.name).toBe("CntFacturaMovimientosMockService")
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

            const formControls = component.cntFacturaMovimientosForm.controls;

            formControls.FacturaId.setValue(rowBase.FacturaId);      
            formControls.FacturaSerie.setValue(rowBase.FacturaSerie);      
            formControls.ProductoLinea.setValue(rowBase.ProductoLinea);      
            formControls.FacturaMovimientoCantidad.setValue(rowBase.FacturaMovimientoCantidad);      
            formControls.FacturaMovimientoValorUnidad.setValue(rowBase.FacturaMovimientoValorUnidad);      

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

            formControls.FacturaMovimientoTotal.setValue(rowBase.FacturaMovimientoTotal);

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
                expect(row.FacturaId).toBe(rowBase.FacturaId);
                expect(row.FacturaSerie).toBe(rowBase.FacturaSerie);
                expect(row.ProductoLinea).toBe(rowBase.ProductoLinea);
                expect(row.FacturaMovimientoCantidad).toBe(rowBase.FacturaMovimientoCantidad);
                expect(row.FacturaMovimientoValorUnidad).toBe(rowBase.FacturaMovimientoValorUnidad);
                expect(row.FacturaMovimientoTotal).toBe(rowBase.FacturaMovimientoTotal);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedCntFacturaMovimientos = new CntFacturaMovimientosModel(rowBase);
        component.selectedCntFacturaMovimientos._estado = 'O';
        component.originalCntFacturaMovimientos = CntFacturaMovimientosModel.clone(component.selectedCntFacturaMovimientos);
        component.originalCntFacturaMovimientos._estado = 'O';

        mockService.rows.push(component.selectedCntFacturaMovimientos);
    
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
                expect(row.FacturaId).toBe(rowBase.FacturaId);
                expect(row.FacturaSerie).toBe(rowBase.FacturaSerie);
                expect(row.ProductoLinea).toBe(rowBase.ProductoLinea);
                expect(row.FacturaMovimientoCantidad).toBe(rowBase.FacturaMovimientoCantidad);
                expect(row.FacturaMovimientoValorUnidad).toBe(rowBase.FacturaMovimientoValorUnidad);
                expect(row.FacturaMovimientoTotal).toBe(rowBase.FacturaMovimientoTotal);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedCntFacturaMovimientos = new CntFacturaMovimientosModel(rowBase);
        component.selectedCntFacturaMovimientos._estado = 'O';
        component.originalCntFacturaMovimientos = CntFacturaMovimientosModel.clone(component.selectedCntFacturaMovimientos);
        component.originalCntFacturaMovimientos._estado = 'O';

        mockService.rows.push(component.selectedCntFacturaMovimientos);
    
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
