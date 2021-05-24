// CntFacturas - Table - Angular Testing
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
import { CntFacturasModule } from './cnt.facturas.module';
import { CntFacturasModel } from './cnt.facturas.model';
import { CntFacturasService } from './cnt.facturas.service';
import { CntFacturasMockService } from './cnt.facturas.mockservice.spec';
import { CntFacturasDialog } from './cnt.facturas.dialog';
import { CntFacturaMovimientosTable } from './cnt.facturamovimientos/cnt.facturamovimientos.table';
import { CntFacturaMovimientosDialog } from './cnt.facturamovimientos/cnt.facturamovimientos.dialog';
import { CntFacturaMovimientosService } from './cnt.facturamovimientos/cnt.facturamovimientos.service';
import { CntFacturaMovimientosMockService } from './cnt.facturamovimientos/cnt.facturamovimientos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntFacturasDialog', () => {
    let component: CntFacturasDialog;
    let fixture: ComponentFixture<CntFacturasDialog>;
    let service: CntFacturasService;
    let _service: CntFacturasService;
    let mockService: CntFacturasMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        FacturaId: 1234,
        FacturaSerie: 1,
        CntFacturasComp: '', //convert(varchar(max),FacturaId) || '/' || convert(varchar(max),FacturaSerie) 
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                CntFacturasModule
            ],
            declarations: [
                CntFacturasDialog,
                CntFacturasDialog,              
                CntFacturaMovimientosTable,
                CntFacturaMovimientosDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new CntFacturasModel(),
                        original: new CntFacturasModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new CntFacturasMockService();
        TestBed.overrideProvider(CntFacturasService, { useValue: mockService });
        TestBed.overrideProvider(CntFacturaMovimientosService, { useValue: new CntFacturaMovimientosMockService() });

        service = TestBed.inject(CntFacturasService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntFacturasDialog);
        _service = fixture.debugElement.injector.get(CntFacturasService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntFacturasMockService")
        expect(_service.constructor.name).toBe("CntFacturasMockService")
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

            const formControls = component.cntFacturasForm.controls;

            formControls.FacturaSerie.setValue(rowBase.FacturaSerie);      
            formControls.FacturaFecha.setValue(rowBase.FacturaFecha);      
            formControls.ClienteId.setValue(rowBase.ClienteId);      
            formControls.FacturaValor.setValue(rowBase.FacturaValor);      
            formControls.FacturaValorNoGravado.setValue(rowBase.FacturaValorNoGravado);      
            formControls.FacturaImpuestos.setValue(rowBase.FacturaImpuestos);      
            formControls.FacturaTotal.setValue(rowBase.FacturaTotal);      

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
                expect(row.FacturaId).toBe(mockService.autoincrement);
                expect(row.FacturaSerie).toBe(rowBase.FacturaSerie);
                expect(row.FacturaFecha).toBe(rowBase.FacturaFecha);
                expect(row.ClienteId).toBe(rowBase.ClienteId);
                expect(row.FacturaValor).toBe(rowBase.FacturaValor);
                expect(row.FacturaValorNoGravado).toBe(rowBase.FacturaValorNoGravado);
                expect(row.FacturaImpuestos).toBe(rowBase.FacturaImpuestos);
                expect(row.FacturaTotal).toBe(rowBase.FacturaTotal);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedCntFacturas = new CntFacturasModel(rowBase);
        component.selectedCntFacturas._estado = 'O';
        component.originalCntFacturas = CntFacturasModel.clone(component.selectedCntFacturas);
        component.originalCntFacturas._estado = 'O';

        mockService.rows.push(component.selectedCntFacturas);
    
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
                expect(row.FacturaFecha).toBe(rowBase.FacturaFecha);
                expect(row.ClienteId).toBe(rowBase.ClienteId);
                expect(row.FacturaValor).toBe(rowBase.FacturaValor);
                expect(row.FacturaValorNoGravado).toBe(rowBase.FacturaValorNoGravado);
                expect(row.FacturaImpuestos).toBe(rowBase.FacturaImpuestos);
                expect(row.FacturaTotal).toBe(rowBase.FacturaTotal);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedCntFacturas = new CntFacturasModel(rowBase);
        component.selectedCntFacturas._estado = 'O';
        component.originalCntFacturas = CntFacturasModel.clone(component.selectedCntFacturas);
        component.originalCntFacturas._estado = 'O';

        mockService.rows.push(component.selectedCntFacturas);
    
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
