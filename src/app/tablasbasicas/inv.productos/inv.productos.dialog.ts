import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { invProductosService } from './inv.productos.service';
import { invProductosModel } from './inv.productos.model';
//import { invSaldosComponent } from './inv.saldos';

@Component({
  templateUrl: './inv.productos.dialog.html',
  // styleUrls: ['./inv.productos.dialog.css'],
  providers: [invProductosService]
})
export class invProductosDialog {
    selectedinvProductos: invProductosModel;
    originalinvProductos: invProductosModel;

    invProductosForm: FormGroup;


    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private invProductosService: invProductosService,
                public dialogRef: MatDialogRef<invProductosDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedinvProductos = data.selected;
        this.originalinvProductos = data.original;

        this.dialogRef.disableClose = true;

        this.invProductosForm = this.builder.group({
            'ProductoLinea': [ this.selectedinvProductos.ProductoLinea, [ Validators.required ] ],
            'ProductoDescripcion': [ this.selectedinvProductos.ProductoDescripcion, [ Validators.required ] ],
            'ProductoSaldo': [ this.selectedinvProductos.ProductoSaldo, [ Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoCosto': [ this.selectedinvProductos.ProductoCosto, [ Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoPrecio': [ this.selectedinvProductos.ProductoPrecio, [ Validators.required, Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'Productoiva': [ this.selectedinvProductos.Productoiva, [ Validators.required, Validators.maxLength(8), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoUnidad': [ this.selectedinvProductos.ProductoUnidad, [ Validators.required ] ],
            'ProductoCodigoBarra': [ this.selectedinvProductos.ProductoCodigoBarra, [ Validators.required ] ],
            'ProductoCantidadMinima': [ this.selectedinvProductos.ProductoCantidadMinima, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoCantidadMaxima': [ this.selectedinvProductos.ProductoCantidadMaxima, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoUbicacion': [ this.selectedinvProductos.ProductoUbicacion, [ Validators.required ] ],
            'ProductoTipo': [ this.selectedinvProductos.ProductoTipo, [ Validators.required ] ],
            'ProductoControlSaldo': [ this.selectedinvProductos.ProductoControlSaldo, [ Validators.required ] ],
            'ProductoObservaciones': [ this.selectedinvProductos.ProductoObservaciones, [ Validators.required ] ],
            '_estado': [ this.selectedinvProductos._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.invProductosForm.valueChanges.subscribe((data) => {

            this.invProductosForm.patchValue({

            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: invProductosModel) {
        this._proc = true;
        if (this.invProductosForm.valid) {
            formData = Object.assign(invProductosModel.clone(this.originalinvProductos), formData);
            this.invProductosService.save(formData, this.originalinvProductos).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalinvProductos, formData);
                    if(formData._estado === 'N') {
                        formData.ProductoLinea = data.ProductoLinea;

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

    onDelete(formData: invProductosModel) {
        if (this.invProductosForm.valid) {
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
                    this.invProductosService.delete(this.selectedinvProductos).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalinvProductos._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalinvProductos,
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
        Object.keys(this.invProductosForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.invProductosForm.errors[key]}\n`;
        });

        let controls = this.invProductosForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
