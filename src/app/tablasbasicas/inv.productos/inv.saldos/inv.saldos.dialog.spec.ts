// invSaldos - Table - Angular Testing
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
import { invProductosModule } from '../inv.productos.module';
import { invProductosModel } from '../inv.productos.model';
import { invSaldosModel } from './inv.saldos.model';
import { invSaldosDialog } from './inv.saldos.dialog';
import { invSaldosService } from './inv.saldos.service';
import { invSaldosMockService } from './inv.saldos.mockservice.spec';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('invSaldosDialog', () => {
    let component: invSaldosDialog;
    let fixture: ComponentFixture<invSaldosDialog>;
    let service: invSaldosService;
    let _service: invSaldosService;
    let mockService: invSaldosMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        ProductoLinea: `AA000001`,
        PeriodoDescripcionx: `Enero 2014`,
        invSaldosComp: '', //convert(varchar(max),ProductoLinea) || '/' || convert(varchar(max),PeriodoDescripcionx) 
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                invProductosModule
            ],
            declarations: [
                invSaldosDialog,
                invSaldosDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new invSaldosModel(),
                        original: new invSaldosModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new invSaldosMockService();
        TestBed.overrideProvider(invSaldosService, { useValue: mockService });

        service = TestBed.inject(invSaldosService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(invSaldosDialog);
        _service = fixture.debugElement.injector.get(invSaldosService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("invSaldosMockService")
        expect(_service.constructor.name).toBe("invSaldosMockService")
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

            const formControls = component.invSaldosForm.controls;

            formControls.ProductoLinea.setValue(rowBase.ProductoLinea);      
            formControls.PeriodoDescripcionx.setValue(rowBase.PeriodoDescripcionx);      
            formControls.InvSaldosCantidad.setValue(rowBase.InvSaldosCantidad);      
            formControls.InvSaldosValor.setValue(rowBase.InvSaldosValor);      

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

            formControls.InvSaldosTotal.setValue(rowBase.InvSaldosTotal);
            formControls.InvSaldosValorPromedio.setValue(rowBase.InvSaldosValorPromedio);
            formControls.InvSaldosUltimoValor.setValue(rowBase.InvSaldosUltimoValor);
            formControls.InvSaldosMaximoValor.setValue(rowBase.InvSaldosMaximoValor);

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
                expect(row.PeriodoDescripcionx).toBe(rowBase.PeriodoDescripcionx);
                expect(row.InvSaldosCantidad).toBe(rowBase.InvSaldosCantidad);
                expect(row.InvSaldosValor).toBe(rowBase.InvSaldosValor);
                expect(row.InvSaldosTotal).toBe(rowBase.InvSaldosTotal);
                expect(row.InvSaldosValorPromedio).toBe(rowBase.InvSaldosValorPromedio);
                expect(row.InvSaldosUltimoValor).toBe(rowBase.InvSaldosUltimoValor);
                expect(row.InvSaldosMaximoValor).toBe(rowBase.InvSaldosMaximoValor);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedinvSaldos = new invSaldosModel(rowBase);
        component.selectedinvSaldos._estado = 'O';
        component.originalinvSaldos = invSaldosModel.clone(component.selectedinvSaldos);
        component.originalinvSaldos._estado = 'O';

        mockService.rows.push(component.selectedinvSaldos);
    
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
                expect(row.PeriodoDescripcionx).toBe(rowBase.PeriodoDescripcionx);
                expect(row.InvSaldosCantidad).toBe(rowBase.InvSaldosCantidad);
                expect(row.InvSaldosValor).toBe(rowBase.InvSaldosValor);
                expect(row.InvSaldosTotal).toBe(rowBase.InvSaldosTotal);
                expect(row.InvSaldosValorPromedio).toBe(rowBase.InvSaldosValorPromedio);
                expect(row.InvSaldosUltimoValor).toBe(rowBase.InvSaldosUltimoValor);
                expect(row.InvSaldosMaximoValor).toBe(rowBase.InvSaldosMaximoValor);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedinvSaldos = new invSaldosModel(rowBase);
        component.selectedinvSaldos._estado = 'O';
        component.originalinvSaldos = invSaldosModel.clone(component.selectedinvSaldos);
        component.originalinvSaldos._estado = 'O';

        mockService.rows.push(component.selectedinvSaldos);
    
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
