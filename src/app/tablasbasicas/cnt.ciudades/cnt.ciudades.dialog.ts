import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntCiudadesService } from './cnt.ciudades.service';
import { CntCiudadesModel } from './cnt.ciudades.model';

@Component({
  templateUrl: './cnt.ciudades.dialog.html',
  // styleUrls: ['./cnt.ciudades.dialog.css'],
  providers: [CntCiudadesService]
})
export class CntCiudadesDialog {
    selectedCntCiudades: CntCiudadesModel;
    originalCntCiudades: CntCiudadesModel;

    cntCiudadesForm: FormGroup;


    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntCiudadesService: CntCiudadesService,
                public dialogRef: MatDialogRef<CntCiudadesDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedCntCiudades = data.selected;
        this.originalCntCiudades = data.original;

        this.dialogRef.disableClose = true;

        this.cntCiudadesForm = this.builder.group({
            'CiudadDepartamentoId': [ this.selectedCntCiudades.CiudadDepartamentoId, [ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'Ciudadid': [ this.selectedCntCiudades.Ciudadid, [ Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'CiudadCodigoPoblado': [ this.selectedCntCiudades.CiudadCodigoPoblado, [ Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'CiudadNombreDepartamento': [ this.selectedCntCiudades.CiudadNombreDepartamento, [ Validators.required ] ],
            'CiudadNombreCiudad': [ this.selectedCntCiudades.CiudadNombreCiudad, [ Validators.required ] ],
            'CiudadNombrePoblado': [ this.selectedCntCiudades.CiudadNombrePoblado, [ Validators.required ] ],
            'CiudadTipoMunicipio': [ this.selectedCntCiudades.CiudadTipoMunicipio, [ Validators.required ] ],
            '_estado': [ this.selectedCntCiudades._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.cntCiudadesForm.valueChanges.subscribe((data) => {

            this.cntCiudadesForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: CntCiudadesModel) {
        this._proc = true;
        if (this.cntCiudadesForm.valid) {
            formData = Object.assign(CntCiudadesModel.clone(this.originalCntCiudades), formData);
            this.cntCiudadesService.save(formData, this.originalCntCiudades).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntCiudades, formData);
                    if(formData._estado === 'N') {
                        formData.CiudadDepartamentoId = data.CiudadDepartamentoId;
                        formData.Ciudadid = data.Ciudadid;

                    }

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

    onDelete(formData: CntCiudadesModel) {
        if (this.cntCiudadesForm.valid) {
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
                    this.cntCiudadesService.delete(this.selectedCntCiudades).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntCiudades._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntCiudades,
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

    getErrorMessages(): string {
        let errors = "";
        Object.keys(this.cntCiudadesForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntCiudadesForm.errors[key]}\n`;
        });

        let controls = this.cntCiudadesForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
