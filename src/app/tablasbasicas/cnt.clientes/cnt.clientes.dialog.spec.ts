// CntClientes - Table - Angular Testing
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
import { CntClientesModule } from './cnt.clientes.module';
import { CntClientesModel, EnumClienteClasificacion, EnumClienteTipoID, EnumClienteEstado } from './cnt.clientes.model';
import { CntClientesService } from './cnt.clientes.service';
import { CntClientesMockService } from './cnt.clientes.mockservice.spec';
import { CntClientesDialog } from './cnt.clientes.dialog';

let rootLoader: HarnessLoader;
let loader: HarnessLoader;

describe('CntClientesDialog', () => {
    let component: CntClientesDialog;
    let fixture: ComponentFixture<CntClientesDialog>;
    let service: CntClientesService;
    let _service: CntClientesService;
    let mockService: CntClientesMockService;
    let translateService: TranslateService;

    let mockMatDialogRef = {
        close: (data: any) => null
    };

    let rowBase = {
        ClienteId: 123456,
        ClienteClasificacion: EnumClienteClasificacion['Juridica'],
        ClienteTipoID: EnumClienteTipoID['Numero_Identificacion_Tributaria'],
        ClienteNit: `1234567890123-1`,
        CodigoCiiuId: `155`,
        ClienteEstado: EnumClienteEstado['Activo'],
        ClienteRazonSocial: `Armando Escandalo de los rios`,
        ClienteDireccion: `Bulgaria #146 y Diego de Almagro Of. 065 Edif. Doral Almagro`,
        CiudadDepartamentoId: 397,
        Ciudadid: 397,
        CntCiudadesComp: '', //convert(varchar(max),CiudadDepartamentoId)|| '/' || convert(varchar(max),Ciudadid)
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
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                BrowserAnimationsModule,
                SharedModule.forRoot(),
                CntClientesModule
            ],
            declarations: [
                CntClientesDialog,
                CntClientesDialog
            ],
            providers: [
                { 
                    provide: MAT_DIALOG_DATA, useValue: {
                        selected: new CntClientesModel(),
                        original: new CntClientesModel()
                    } 
                },
                { provide: MatDialogRef, useValue: mockMatDialogRef},
                TranslateService, TranslateStore 
            ]
        });

        mockService = new CntClientesMockService();
        TestBed.overrideProvider(CntClientesService, { useValue: mockService });

        service = TestBed.inject(CntClientesService);
        translateService = TestBed.inject(TranslateService);

        fixture = TestBed.createComponent(CntClientesDialog);
        _service = fixture.debugElement.injector.get(CntClientesService);
        component = fixture.componentInstance;
        
        loader = TestbedHarnessEnvironment.loader(fixture);
        rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    }, 1);

    it('should create', () => {
        expect(component).toBeDefined();
        expect(service.constructor.name).toBe("CntClientesMockService")
        expect(_service.constructor.name).toBe("CntClientesMockService")
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

            const formControls = component.cntClientesForm.controls;

            formControls.ClienteId.setValue(rowBase.ClienteId);      
            formControls.ClienteClasificacion.setValue(rowBase.ClienteClasificacion);      
            formControls.ClienteTipoID.setValue(rowBase.ClienteTipoID);      
            formControls.ClienteNit.setValue(rowBase.ClienteNit);      
            formControls.CodigoCiiuId.setValue(rowBase.CodigoCiiuId);      
            formControls.ClienteEstado.setValue(rowBase.ClienteEstado);      
            formControls.ClienteRazonSocial.setValue(rowBase.ClienteRazonSocial);      
            formControls.ClienteDireccion.setValue(rowBase.ClienteDireccion);      
            formControls.CiudadDepartamentoId.setValue(rowBase.CiudadDepartamentoId);      
            formControls.Ciudadid.setValue(rowBase.Ciudadid);      
            formControls.ClienteTelefono.setValue(rowBase.ClienteTelefono);      
            formControls.ClienteCelular.setValue(rowBase.ClienteCelular);      
            formControls.ClienteEmail.setValue(rowBase.ClienteEmail);      

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

            formControls.ClienteContacto.setValue(rowBase.ClienteContacto);
            formControls.ClienteTelefonoContacto.setValue(rowBase.ClienteTelefonoContacto);
            formControls.ClienteEmailContacto.setValue(rowBase.ClienteEmailContacto);

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
                expect(row.ClienteId).toBe(rowBase.ClienteId);
                expect(row.ClienteClasificacion).toBe(rowBase.ClienteClasificacion);
                expect(row.ClienteTipoID).toBe(rowBase.ClienteTipoID);
                expect(row.ClienteNit).toBe(rowBase.ClienteNit);
                expect(row.CodigoCiiuId).toBe(rowBase.CodigoCiiuId);
                expect(row.ClienteEstado).toBe(rowBase.ClienteEstado);
                expect(row.ClienteRazonSocial).toBe(rowBase.ClienteRazonSocial);
                expect(row.ClienteDireccion).toBe(rowBase.ClienteDireccion);
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.ClienteTelefono).toBe(rowBase.ClienteTelefono);
                expect(row.ClienteCelular).toBe(rowBase.ClienteCelular);
                expect(row.ClienteEmail).toBe(rowBase.ClienteEmail);
                expect(row.ClienteContacto).toBe(rowBase.ClienteContacto);
                expect(row.ClienteTelefonoContacto).toBe(rowBase.ClienteTelefonoContacto);
                expect(row.ClienteEmailContacto).toBe(rowBase.ClienteEmailContacto);
            };

            await btnGuardar.click();
        }, 1);
    });


    it('should display a Dialog for Update', async () => {
        component.selectedCntClientes = new CntClientesModel(rowBase);
        component.selectedCntClientes._estado = 'O';
        component.originalCntClientes = CntClientesModel.clone(component.selectedCntClientes);
        component.originalCntClientes._estado = 'O';

        mockService.rows.push(component.selectedCntClientes);
    
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
                expect(row.ClienteId).toBe(rowBase.ClienteId);
                expect(row.ClienteClasificacion).toBe(rowBase.ClienteClasificacion);
                expect(row.ClienteTipoID).toBe(rowBase.ClienteTipoID);
                expect(row.ClienteNit).toBe(rowBase.ClienteNit);
                expect(row.CodigoCiiuId).toBe(rowBase.CodigoCiiuId);
                expect(row.ClienteEstado).toBe(rowBase.ClienteEstado);
                expect(row.ClienteRazonSocial).toBe(rowBase.ClienteRazonSocial);
                expect(row.ClienteDireccion).toBe(rowBase.ClienteDireccion);
                expect(row.CiudadDepartamentoId).toBe(rowBase.CiudadDepartamentoId);
                expect(row.Ciudadid).toBe(rowBase.Ciudadid);
                expect(row.ClienteTelefono).toBe(rowBase.ClienteTelefono);
                expect(row.ClienteCelular).toBe(rowBase.ClienteCelular);
                expect(row.ClienteEmail).toBe(rowBase.ClienteEmail);
                expect(row.ClienteContacto).toBe(rowBase.ClienteContacto);
                expect(row.ClienteTelefonoContacto).toBe(rowBase.ClienteTelefonoContacto);
                expect(row.ClienteEmailContacto).toBe(rowBase.ClienteEmailContacto);
            };

            await btnGuardar.click();
        }, 1);
    });

    it('should display a Dialog for Delete', async () => {
        component.selectedCntClientes = new CntClientesModel(rowBase);
        component.selectedCntClientes._estado = 'O';
        component.originalCntClientes = CntClientesModel.clone(component.selectedCntClientes);
        component.originalCntClientes._estado = 'O';

        mockService.rows.push(component.selectedCntClientes);
    
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