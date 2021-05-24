import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntFacturaMovimientosService } from './cnt.facturamovimientos.service';
import { CntFacturaMovimientosModel } from './cnt.facturamovimientos.model';

@Component({
  templateUrl: './cnt.facturamovimientos.dialog.html',
  // styleUrls: ['./cnt.facturamovimientos.dialog.css'],
  providers: [CntFacturaMovimientosService]
})
export class CntFacturaMovimientosDialog {
    selectedCntFacturaMovimientos: CntFacturaMovimientosModel;
    originalCntFacturaMovimientos: CntFacturaMovimientosModel;

    cntFacturaMovimientosForm: FormGroup;

    productoDescripcionCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"productoDescripcionCtrl": true };
            }
            return result;
        }] ]);

    filteredProductoDescripcion: Observable<Array<any>>;

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntFacturaMovimientosService: CntFacturaMovimientosService,
                public dialogRef: MatDialogRef<CntFacturaMovimientosDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        //this.selectedCNTFacturas = navParams.get('CNTFacturas');

        this.selectedCntFacturaMovimientos = data.selected;
        this.originalCntFacturaMovimientos = data.original;

        this.dialogRef.disableClose = true;

        this.cntFacturaMovimientosForm = this.builder.group({
            'FacturaId': [ this.selectedCntFacturaMovimientos.FacturaId, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaSerie': [ this.selectedCntFacturaMovimientos.FacturaSerie, [ Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'ProductoLinea': [ this.selectedCntFacturaMovimientos.ProductoLinea, [ Validators.required ] ],
            'FacturaMovimientoCantidad': [ this.selectedCntFacturaMovimientos.FacturaMovimientoCantidad, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaMovimientoValorUnidad': [ this.selectedCntFacturaMovimientos.FacturaMovimientoValorUnidad, [ Validators.required, Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaMovimientoTotal': [ this.selectedCntFacturaMovimientos.FacturaMovimientoTotal, [ Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            '_estado': [ this.selectedCntFacturaMovimientos._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.productoDescripcionCtrl.setValue(this.selectedCntFacturaMovimientos.invProductos?.ProductoDescripcion || '');
        this.productoDescripcionCtrl["invProductos"] = this.selectedCntFacturaMovimientos.invProductos;
        this.filteredProductoDescripcion = this.productoDescripcionCtrl.valueChanges
            .pipe(
                startWith(this.productoDescripcionCtrl.value),
                switchMap((data) => this.cntFacturaMovimientosService.filterProductoDescripcion(data)),
                map((result) => result.value)
            );

        this.cntFacturaMovimientosForm.valueChanges.subscribe((data) => {
			data.FacturaMovimientoTotal = data.FacturaMovimientoCantidad * data.FacturaMovimientoValorUnidad;

            this.cntFacturaMovimientosForm.patchValue({
				FacturaMovimientoTotal: data.FacturaMovimientoTotal
            }, {emitEvent: false, onlySelf: true});
        });
    }
    
    onSubmit(formData: CntFacturaMovimientosModel) {
        this._proc = true;
        if (this.cntFacturaMovimientosForm.valid) {
            formData = Object.assign(CntFacturaMovimientosModel.clone(this.originalCntFacturaMovimientos), formData);
            this.cntFacturaMovimientosService.save(formData, this.originalCntFacturaMovimientos).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntFacturaMovimientos, formData);
                    if(formData._estado === 'N') {
                        formData.FacturaId = data.FacturaId;
                        formData.FacturaSerie = data.FacturaSerie;
                        formData.ProductoLinea = data.ProductoLinea;

                    }

                    formData.invProductos = this.productoDescripcionCtrl["invProductos"];
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

    onDelete(formData: CntFacturaMovimientosModel) {
        if (this.cntFacturaMovimientosForm.valid) {
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
                    this.cntFacturaMovimientosService.delete(this.selectedCntFacturaMovimientos).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntFacturaMovimientos._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntFacturaMovimientos,
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

    onKeydownProductoDescripcion(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.productoDescripcionCtrl["selected"] = false;

        this.cntFacturaMovimientosForm.patchValue({
            ProductoLinea: null
        });
    }

    displayFnProductoDescripcion = (opt: any): string => {
        if(opt.ProductoDescripcion) {

            this.productoDescripcionCtrl["selected"] = true;
            this.productoDescripcionCtrl["invProductos"] = opt;

            this.cntFacturaMovimientosForm.patchValue({
                ProductoLinea: opt.ProductoLinea,
                FacturaMovimientoValorUnidad: opt.ProductoPrecio
            });

        } else {
            opt = this.productoDescripcionCtrl["invProductos"];
        }
        return opt.ProductoDescripcion;
    }

    getErrorMessages(): string {
        let errors = "";
        Object.keys(this.cntFacturaMovimientosForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntFacturaMovimientosForm.errors[key]}\n`;
        });

        let controls = this.cntFacturaMovimientosForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
