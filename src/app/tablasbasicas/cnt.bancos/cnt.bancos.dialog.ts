import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntBancosService } from './cnt.bancos.service';
import { CntBancosModel } from './cnt.bancos.model';

@Component({
  templateUrl: './cnt.bancos.dialog.html',
  // styleUrls: ['./cnt.bancos.dialog.css'],
  providers: [CntBancosService]
})
export class CntBancosDialog {
    selectedCntBancos: CntBancosModel;
    originalCntBancos: CntBancosModel;

    cntBancosForm: FormGroup;


    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntBancosService: CntBancosService,
                public dialogRef: MatDialogRef<CntBancosDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedCntBancos = data.selected;
        this.originalCntBancos = data.original;

        this.dialogRef.disableClose = true;

        this.cntBancosForm = this.builder.group({
            'BancoId': [ this.selectedCntBancos.BancoId, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'BancoNombre': [ this.selectedCntBancos.BancoNombre, [ Validators.required ] ],
            'BancoLongitud': [ this.selectedCntBancos.BancoLongitud, [ Validators.required, Validators.maxLength(2), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            '_estado': [ this.selectedCntBancos._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.cntBancosForm.valueChanges.subscribe((data) => {

            this.cntBancosForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: CntBancosModel) {
        this._proc = true;
        if (this.cntBancosForm.valid) {
            formData = Object.assign(CntBancosModel.clone(this.originalCntBancos), formData);
            this.cntBancosService.save(formData, this.originalCntBancos).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntBancos, formData);
                    if(formData._estado === 'N') {
                        formData.BancoId = data.BancoId;

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

    onDelete(formData: CntBancosModel) {
        if (this.cntBancosForm.valid) {
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
                    this.cntBancosService.delete(this.selectedCntBancos).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntBancos._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntBancos,
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
        Object.keys(this.cntBancosForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntBancosForm.errors[key]}\n`;
        });

        let controls = this.cntBancosForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
