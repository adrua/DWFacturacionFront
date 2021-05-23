import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { invSaldosService } from './inv.saldos.service';
import { invSaldosModel } from './inv.saldos.model';

@Component({
  templateUrl: './inv.saldos.dialog.html',
  // styleUrls: ['./inv.saldos.dialog.css'],
  providers: [invSaldosService]
})
export class invSaldosDialog {
    selectedinvSaldos: invSaldosModel;
    originalinvSaldos: invSaldosModel;

    invSaldosForm: FormGroup;


    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private invSaldosService: invSaldosService,
                public dialogRef: MatDialogRef<invSaldosDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        //this.selectedinvProductos = navParams.get('invProductos');

        this.selectedinvSaldos = data.selected;
        this.originalinvSaldos = data.original;

        this.dialogRef.disableClose = true;

        this.invSaldosForm = this.builder.group({
            'ProductoLinea': [ this.selectedinvSaldos.ProductoLinea, [ Validators.required ] ],
            'PeriodoDescripcionx': [ this.selectedinvSaldos.PeriodoDescripcionx, [ Validators.required ] ],
            'InvSaldosCantidad': [ this.selectedinvSaldos.InvSaldosCantidad, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'InvSaldosValor': [ this.selectedinvSaldos.InvSaldosValor, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'InvSaldosTotal': [ this.selectedinvSaldos.InvSaldosTotal, [ Validators.maxLength(7), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'InvSaldosValorPromedio': [ this.selectedinvSaldos.InvSaldosValorPromedio, [ Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'InvSaldosUltimoValor': [ this.selectedinvSaldos.InvSaldosUltimoValor, [ Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'InvSaldosMaximoValor': [ this.selectedinvSaldos.InvSaldosMaximoValor, [ Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            '_estado': [ this.selectedinvSaldos._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.invSaldosForm.valueChanges.subscribe((data) => {

            this.invSaldosForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: invSaldosModel) {
        this._proc = true;
        if (this.invSaldosForm.valid) {
            formData = Object.assign(invSaldosModel.clone(this.originalinvSaldos), formData);
            this.invSaldosService.save(formData, this.originalinvSaldos).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalinvSaldos, formData);
                    if(formData._estado === 'N') {
                        formData.ProductoLinea = data.ProductoLinea;
                        formData.PeriodoDescripcionx = data.PeriodoDescripcionx;

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

    onDelete(formData: invSaldosModel) {
        if (this.invSaldosForm.valid) {
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
                    this.invSaldosService.delete(this.selectedinvSaldos).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalinvSaldos._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalinvSaldos,
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
        Object.keys(this.invSaldosForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.invSaldosForm.errors[key]}\n`;
        });

        let controls = this.invSaldosForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
