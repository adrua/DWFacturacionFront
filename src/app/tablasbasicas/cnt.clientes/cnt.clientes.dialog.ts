import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntClientesService } from './cnt.clientes.service';
import { CntClientesModel } from './cnt.clientes.model';

@Component({
  templateUrl: './cnt.clientes.dialog.html',
  // styleUrls: ['./cnt.clientes.dialog.css'],
  providers: [CntClientesService]
})
export class CntClientesDialog {
    selectedCntClientes: CntClientesModel;
    originalCntClientes: CntClientesModel;

    cntClientesForm: FormGroup;

    codigoCiiuDescripcionCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"codigoCiiuDescripcionCtrl": true };
            }
            return result;
        }] ]);

    filteredCodigoCiiuDescripcion: Observable<Array<any>>;
    ciudadNombreCiudadCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"ciudadNombreCiudadCtrl": true };
            }
            return result;
        }] ]);

    filteredCiudadNombreCiudad: Observable<Array<any>>;

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntClientesService: CntClientesService,
                public dialogRef: MatDialogRef<CntClientesDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedCntClientes = data.selected;
        this.originalCntClientes = data.original;

        this.dialogRef.disableClose = true;

        this.cntClientesForm = this.builder.group({
            'ClienteId': [ this.selectedCntClientes.ClienteId, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ClienteClasificacion': [ this.selectedCntClientes.ClienteClasificacion, [ Validators.required ] ],
            'ClienteTipoID': [ this.selectedCntClientes.ClienteTipoID, [ Validators.required ] ],
            'ClienteNit': [ this.selectedCntClientes.ClienteNit, [ Validators.required ] ],
            'CodigoCiiuId': [ this.selectedCntClientes.CodigoCiiuId, [ Validators.required ] ],
            'ClienteEstado': [ this.selectedCntClientes.ClienteEstado, [ Validators.required ] ],
            'ClienteRazonSocial': [ this.selectedCntClientes.ClienteRazonSocial, [ Validators.required ] ],
            'ClienteDireccion': [ this.selectedCntClientes.ClienteDireccion, [ Validators.required ] ],
            'CiudadDepartamentoId': [ this.selectedCntClientes.CiudadDepartamentoId, [ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'Ciudadid': [ this.selectedCntClientes.Ciudadid, [ Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ClienteTelefono': [ this.selectedCntClientes.ClienteTelefono, [ Validators.required ] ],
            'ClienteCelular': [ this.selectedCntClientes.ClienteCelular, [ Validators.required ] ],
            'ClienteEmail': [ this.selectedCntClientes.ClienteEmail, [ Validators.required, Validators.email ] ],
            'ClienteContacto': [ this.selectedCntClientes.ClienteContacto, [  ] ],
            'ClienteTelefonoContacto': [ this.selectedCntClientes.ClienteTelefonoContacto, [  ] ],
            'ClienteEmailContacto': [ this.selectedCntClientes.ClienteEmailContacto, [ Validators.email ] ],
            '_estado': [ this.selectedCntClientes._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.codigoCiiuDescripcionCtrl.setValue(this.selectedCntClientes.CntCodigosCiiu?.CodigoCiiuDescripcion || '');
        this.codigoCiiuDescripcionCtrl["CntCodigosCiiu"] = this.selectedCntClientes.CntCodigosCiiu;
        this.filteredCodigoCiiuDescripcion = this.codigoCiiuDescripcionCtrl.valueChanges
            .pipe(
                startWith(this.codigoCiiuDescripcionCtrl.value),
                switchMap((data) => this.cntClientesService.filterCodigoCiiuDescripcion(data)),
                map((result) => result.value)
            );

        this.ciudadNombreCiudadCtrl.setValue(this.selectedCntClientes.CntCiudades?.CiudadNombreCiudad || '');
        this.ciudadNombreCiudadCtrl["CntCiudades"] = this.selectedCntClientes.CntCiudades;
        this.filteredCiudadNombreCiudad = this.ciudadNombreCiudadCtrl.valueChanges
            .pipe(
                startWith(this.ciudadNombreCiudadCtrl.value),
                switchMap((data) => this.cntClientesService.filterCiudadNombreCiudad(data)),
                map((result) => result.value)
            );

        this.cntClientesForm.valueChanges.subscribe((data) => {

            this.cntClientesForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: CntClientesModel) {
        this._proc = true;
        if (this.cntClientesForm.valid) {
            formData = Object.assign(CntClientesModel.clone(this.originalCntClientes), formData);
            this.cntClientesService.save(formData, this.originalCntClientes).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntClientes, formData);
                    if(formData._estado === 'N') {
                        formData.ClienteId = data.ClienteId;

                    }

                    formData.CntCodigosCiiu = this.codigoCiiuDescripcionCtrl["CntCodigosCiiu"];
                    formData.CntCiudades = this.ciudadNombreCiudadCtrl["CntCiudades"];
                    this.dialogRef.close({
                        data: formData
                    });
                } else {
                   this.resultError = data.error?.value || data.message;
                   this.openNotificationDanger('alertas.guardar.error', this.resultError)
                }
            });
        }
    }

    onDelete(formData: CntClientesModel) {
        if (this.cntClientesForm.valid) {
            const dialogRef = this.dialog.open(AlertaComponent, {
                data: {
                    tipo: 'error',
                    titulo: this.translateService.instant('alertas.eliminar.titulo'),
                    mensaje: this.translateService.instant('alertas.eliminar.mensaje')
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result.data) {
                    this._proc = true;
                    this.cntClientesService.delete(this.selectedCntClientes).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntClientes._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntClientes,
                                delete: true
                            });
                        } else {
                            this.resultError = data.error?.value || data.message;
                            this.openNotificationDanger('alertas.eliminar.error', this.resultError);
                        }
                    });
                }
            });
        }
    }

    openNotificationDanger(titulo: string, mensaje: string) {
        const dialogRef = this.dialog.open(AlertaComponent, {
            data: {
                tipo: 'error',
                titulo: this.translateService.instant(titulo),
                mensaje: mensaje
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result.data) {
                this.dialogRef.close();
            }
        });
    }

    onKeydownCodigoCiiuDescripcion(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.codigoCiiuDescripcionCtrl["selected"] = false;

        this.cntClientesForm.patchValue({
            CodigoCiiuId: null
        });
    }

    displayFnCodigoCiiuDescripcion = (opt: any): string => {
        if(opt.CodigoCiiuDescripcion) {

            this.codigoCiiuDescripcionCtrl["selected"] = true;
            this.codigoCiiuDescripcionCtrl["CntCodigosCiiu"] = opt;

            this.cntClientesForm.patchValue({
                CodigoCiiuId: opt.CodigoCiiuId
            });

        } else {
            opt = this.codigoCiiuDescripcionCtrl["CntCodigosCiiu"];
        }
        return opt.CodigoCiiuDescripcion;
    }

    onKeydownCiudadNombreCiudad(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.ciudadNombreCiudadCtrl["selected"] = false;

        this.cntClientesForm.patchValue({
            CiudadDepartamentoId: null,
            Ciudadid: null
        });
    }

    displayFnCiudadNombreCiudad = (opt: any): string => {
        if(opt.CiudadNombreCiudad) {

            this.ciudadNombreCiudadCtrl["selected"] = true;
            this.ciudadNombreCiudadCtrl["CntCiudades"] = opt;

            this.cntClientesForm.patchValue({
                CiudadDepartamentoId: opt.CiudadDepartamentoId,
                Ciudadid: opt.Ciudadid
            });

        } else {
            opt = this.ciudadNombreCiudadCtrl["CntCiudades"];
        }
        return opt.CiudadNombreCiudad;
    }

    getErrorMessages(): string {
        let errors = "";
        Object.keys(this.cntClientesForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntClientesForm.errors[key]}\n`;
        });

        let controls = this.cntClientesForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
