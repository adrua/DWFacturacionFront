import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntCodigosCiiuService } from './cnt.codigosciiu.service';
import { CntCodigosCiiuModel } from './cnt.codigosciiu.model';

@Component({
  templateUrl: './cnt.codigosciiu.dialog.html',
  // styleUrls: ['./cnt.codigosciiu.dialog.css'],
  providers: [CntCodigosCiiuService]
})
export class CntCodigosCiiuDialog {
    selectedCntCodigosCiiu: CntCodigosCiiuModel;
    originalCntCodigosCiiu: CntCodigosCiiuModel;

    cntCodigosCiiuForm: FormGroup;


    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntCodigosCiiuService: CntCodigosCiiuService,
                public dialogRef: MatDialogRef<CntCodigosCiiuDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedCntCodigosCiiu = data.selected;
        this.originalCntCodigosCiiu = data.original;

        this.dialogRef.disableClose = true;

        this.cntCodigosCiiuForm = this.builder.group({
            'CodigoCiiuId': [ this.selectedCntCodigosCiiu.CodigoCiiuId, [ Validators.required ] ],
            'CodigoCiiuDescripcion': [ this.selectedCntCodigosCiiu.CodigoCiiuDescripcion, [ Validators.required ] ],
            'CodigoCiiuclase': [ this.selectedCntCodigosCiiu.CodigoCiiuclase, [ Validators.required ] ],
            'CodigoCiiugrupo': [ this.selectedCntCodigosCiiu.CodigoCiiugrupo, [ Validators.required ] ],
            'CodigoCiiudivision': [ this.selectedCntCodigosCiiu.CodigoCiiudivision, [ Validators.required ] ],
            'CodigoCiiuBloqueo': [ this.selectedCntCodigosCiiu.CodigoCiiuBloqueo, [ Validators.required ] ],
            '_estado': [ this.selectedCntCodigosCiiu._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.cntCodigosCiiuForm.valueChanges.subscribe((data) => {

            this.cntCodigosCiiuForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: CntCodigosCiiuModel) {
        this._proc = true;
        if (this.cntCodigosCiiuForm.valid) {
            formData = Object.assign(CntCodigosCiiuModel.clone(this.originalCntCodigosCiiu), formData);
            this.cntCodigosCiiuService.save(formData, this.originalCntCodigosCiiu).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntCodigosCiiu, formData);
                    if(formData._estado === 'N') {
                        formData.CodigoCiiuId = data.CodigoCiiuId;

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

    onDelete(formData: CntCodigosCiiuModel) {
        if (this.cntCodigosCiiuForm.valid) {
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
                    this.cntCodigosCiiuService.delete(this.selectedCntCodigosCiiu).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntCodigosCiiu._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntCodigosCiiu,
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
        Object.keys(this.cntCodigosCiiuForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntCodigosCiiuForm.errors[key]}\n`;
        });

        let controls = this.cntCodigosCiiuForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
