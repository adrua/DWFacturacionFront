// invProductos - Table - Angular Testing
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
import { invProductosModule } from './inv.productos.module';
import { invProductosModel, EnumProductoUnidad, EnumProductoTipo } from './inv.productos.model';
import { invProductosService } from './inv.productos.service';
import { invProductosMockService } from './inv.productos.mockservice.spec';
import { invProductosDialog } from './inv.productos.dialog';
import { invSaldosTable } from './inv.saldos/inv.saldos.table';
import { invSaldosDialog } from './inv.saldos/inv.saldos.dialog';
import { invSaldosService } from './inv.saldos/inv.saldos.service';
import { invSaldosMockService } from './inv.saldos/inv.saldos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('invProductosDialog', () => {
    let component: invProductosDialog;
    let fixture: ComponentFixture<invProductosDialog>;
    let service: invProductosService;
    let _service: invProductosService;
    let mockService: invProductosMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        ProductoLinea: `AA000001`,
        ProductoDescripcion: `Vericueto Acme`,
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                invProductosModule
            ],
            declarations: [
                invProductosDialog,
                invProductosDialog,              
                invSaldosTable,
                invSaldosDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new invProductosModel(),
                        original: new invProductosModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new invProductosMockService();
        TestBed.overrideProvider(invProductosService, { useValue: mockService });
        TestBed.overrideProvider(invSaldosService, { useValue: new invSaldosMockService() });

        service = TestBed.inject(invProductosService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(invProductosDialog);
        _service = fixture.debugElement.injector.get(invProductosService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("invProductosMockService")
        expect(_service.constructor.name).toBe("invProductosMockService")
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

            const formControls = component.invProductosForm.controls;

            formControls.ProductoLinea.setValue(rowBase.ProductoLinea);      
            formControls.ProductoDescripcion.setValue(rowBase.ProductoDescripcion);      
            formControls.ProductoPrecio.setValue(rowBase.ProductoPrecio);      
            formControls.Productoiva.setValue(rowBase.Productoiva);      
            formControls.ProductoUnidad.setValue(rowBase.ProductoUnidad);      
            formControls.ProductoCodigoBarra.setValue(rowBase.ProductoCodigoBarra);      
            formControls.ProductoCantidadMinima.setValue(rowBase.ProductoCantidadMinima);      
            formControls.ProductoCantidadMaxima.setValue(rowBase.ProductoCantidadMaxima);      
            formControls.ProductoUbicacion.setValue(rowBase.ProductoUbicacion);      
            formControls.ProductoTipo.setValue(rowBase.ProductoTipo);      
            formControls.ProductoControlSaldo.setValue(rowBase.ProductoControlSaldo);      
            formControls.ProductoObservaciones.setValue(rowBase.ProductoObservaciones);      

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

            formControls.ProductoSaldo.setValue(rowBase.ProductoSaldo);
            formControls.ProductoCosto.setValue(rowBase.ProductoCosto);

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
                expect(row.ProductoLinea).toBe(rowBase.ProductoLinea);
                expect(row.ProductoDescripcion).toBe(rowBase.ProductoDescripcion);
                expect(row.ProductoSaldo).toBe(rowBase.ProductoSaldo);
                expect(row.ProductoCosto).toBe(rowBase.ProductoCosto);
                expect(row.ProductoPrecio).toBe(rowBase.ProductoPrecio);
                expect(row.Productoiva).toBe(rowBase.Productoiva);
                expect(row.ProductoUnidad).toBe(rowBase.ProductoUnidad);
                expect(row.ProductoCodigoBarra).toBe(rowBase.ProductoCodigoBarra);
                expect(row.ProductoCantidadMinima).toBe(rowBase.ProductoCantidadMinima);
                expect(row.ProductoCantidadMaxima).toBe(rowBase.ProductoCantidadMaxima);
                expect(row.ProductoUbicacion).toBe(rowBase.ProductoUbicacion);
                expect(row.ProductoTipo).toBe(rowBase.ProductoTipo);
                expect(row.ProductoControlSaldo).toBe(rowBase.ProductoControlSaldo);
                expect(row.ProductoObservaciones).toBe(rowBase.ProductoObservaciones);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedinvProductos = new invProductosModel(rowBase);
        component.selectedinvProductos._estado = 'O';
        component.originalinvProductos = invProductosModel.clone(component.selectedinvProductos);
        component.originalinvProductos._estado = 'O';

        mockService.rows.push(component.selectedinvProductos);
    
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
                expect(row.ProductoLinea).toBe(rowBase.ProductoLinea);
                expect(row.ProductoDescripcion).toBe(rowBase.ProductoDescripcion);
                expect(row.ProductoSaldo).toBe(rowBase.ProductoSaldo);
                expect(row.ProductoCosto).toBe(rowBase.ProductoCosto);
                expect(row.ProductoPrecio).toBe(rowBase.ProductoPrecio);
                expect(row.Productoiva).toBe(rowBase.Productoiva);
                expect(row.ProductoUnidad).toBe(rowBase.ProductoUnidad);
                expect(row.ProductoCodigoBarra).toBe(rowBase.ProductoCodigoBarra);
                expect(row.ProductoCantidadMinima).toBe(rowBase.ProductoCantidadMinima);
                expect(row.ProductoCantidadMaxima).toBe(rowBase.ProductoCantidadMaxima);
                expect(row.ProductoUbicacion).toBe(rowBase.ProductoUbicacion);
                expect(row.ProductoTipo).toBe(rowBase.ProductoTipo);
                expect(row.ProductoControlSaldo).toBe(rowBase.ProductoControlSaldo);
                expect(row.ProductoObservaciones).toBe(rowBase.ProductoObservaciones);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedinvProductos = new invProductosModel(rowBase);
        component.selectedinvProductos._estado = 'O';
        component.originalinvProductos = invProductosModel.clone(component.selectedinvProductos);
        component.originalinvProductos._estado = 'O';

        mockService.rows.push(component.selectedinvProductos);
    
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
