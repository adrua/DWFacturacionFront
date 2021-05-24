import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AlertaComponent } from 'arkeos-components';

import { CntFacturasService } from './cnt.facturas.service';
import { CntFacturasModel } from './cnt.facturas.model';
//import { CNTFacturaMovimientosComponent } from './cnt.facturamovimientos';

@Component({
  templateUrl: './cnt.facturas.dialog.html',
  // styleUrls: ['./cnt.facturas.dialog.css'],
  providers: [CntFacturasService]
})
export class CntFacturasDialog {
    selectedCntFacturas: CntFacturasModel;
    originalCntFacturas: CntFacturasModel;

    cntFacturasForm: FormGroup;

    clienteRazonSocialCtrl: FormControl = new FormControl(["", [
        (control: AbstractControl): {[key: string]: any} | null => {
            const selected = !!control["selected"];
            let result = null;
            if (control.value !== "" && !selected) {
                result = {"clienteRazonSocialCtrl": true };
            }
            return result;
        }] ]);

    filteredClienteRazonSocial: Observable<Array<any>>;

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(public dialog: MatDialog,
 		        private builder: FormBuilder,
                private translateService: TranslateService,
                private cntFacturasService: CntFacturasService,
                public dialogRef: MatDialogRef<CntFacturasDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.selectedCntFacturas = data.selected;
        this.originalCntFacturas = data.original;

        this.dialogRef.disableClose = true;

        this.cntFacturasForm = this.builder.group({
            'FacturaId': [ this.selectedCntFacturas.FacturaId, [ Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaSerie': [ this.selectedCntFacturas.FacturaSerie, [ Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaFecha': [ this.selectedCntFacturas.FacturaFecha, [ Validators.required ] ],
            'ClienteId': [ this.selectedCntFacturas.ClienteId, [ Validators.required, Validators.maxLength(6), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaValor': [ this.selectedCntFacturas.FacturaValor, [ Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaValorNoGravado': [ this.selectedCntFacturas.FacturaValorNoGravado, [ Validators.required, Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaImpuestos': [ this.selectedCntFacturas.FacturaImpuestos, [ Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            'FacturaTotal': [ this.selectedCntFacturas.FacturaTotal, [ Validators.maxLength(18), Validators.pattern('^[0-9]+(\\.[0-9]*)?$') ] ],
            '_estado': [ this.selectedCntFacturas._estado, Validators.required ]
        }, {
                validators: (formGroup: AbstractControl): ValidationErrors | null => {

                    let validationErrors: any = null;

                    return validationErrors;
                }
        });  
    }

    ngOnInit() {
        this.clienteRazonSocialCtrl.setValue(this.selectedCntFacturas.CntClientes?.ClienteRazonSocial || '');
        this.clienteRazonSocialCtrl["CntClientes"] = this.selectedCntFacturas.CntClientes;
        this.filteredClienteRazonSocial = this.clienteRazonSocialCtrl.valueChanges
            .pipe(
                startWith(this.clienteRazonSocialCtrl.value),
                switchMap((data) => this.cntFacturasService.filterClienteRazonSocial(data)),
                map((result) => result.value)
            );

        this.cntFacturasForm.valueChanges.subscribe((data) => {
			data.FacturaImpuestos = data.FacturaValor * 0.19;
			data.FacturaTotal = data.FacturaImpuestos + data.FacturaValor;

            this.cntFacturasForm.patchValue({
				FacturaImpuestos: data.FacturaImpuestos,
				FacturaTotal: data.FacturaTotal
            }, {emitEvent: false, onlySelf: true});
        });
    }
    onSubmit(formData: CntFacturasModel) {
        this._proc = true;
        if (this.cntFacturasForm.valid) {
            formData = Object.assign(CntFacturasModel.clone(this.originalCntFacturas), formData);
            this.cntFacturasService.save(formData, this.originalCntFacturas).subscribe((data: any) => {
                this._proc = false;
                this._status = !data?.error && !data?.message;
                this.resultError = null;

                if (this._status) {
                    formData = Object.assign(this.originalCntFacturas, formData);
                    if(formData._estado === 'N') {
                        formData.FacturaId = data.FacturaId;
                        formData.FacturaSerie = data.FacturaSerie;

                    }

                    formData.CntClientes = this.clienteRazonSocialCtrl["CntClientes"];
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

    onDelete(formData: CntFacturasModel) {
        if (this.cntFacturasForm.valid) {
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
                    this.cntFacturasService.delete(this.selectedCntFacturas).subscribe((data: any) => {
                        this._proc = false;
                        this._status = !data?.error && !data?.message;
                        this.resultError = null;

                        if (this._status) {
                            this.originalCntFacturas._estado = 'D';
                            this.dialogRef.close({
                                data: this.originalCntFacturas,
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

    onKeydownClienteRazonSocial(e: KeyboardEvent) {
        if (e.key === 'Tab' || e.key === 'Enter') {
            return;
        }

        this.clienteRazonSocialCtrl["selected"] = false;

        this.cntFacturasForm.patchValue({
            ClienteId: null
        });
    }

    displayFnClienteRazonSocial = (opt: any): string => {
        if(opt.ClienteRazonSocial) {

            this.clienteRazonSocialCtrl["selected"] = true;
            this.clienteRazonSocialCtrl["CntClientes"] = opt;

            this.cntFacturasForm.patchValue({
                ClienteId: opt.ClienteId
            });

        } else {
            opt = this.clienteRazonSocialCtrl["CntClientes"];
        }
        return opt.ClienteRazonSocial;
    }

    getErrorMessages(): string {
        let errors = "";
        Object.keys(this.cntFacturasForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.cntFacturasForm.errors[key]}\n`;
        });

        let controls = this.cntFacturasForm.controls;

        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}
`;
            });
        });

        return (errors || `, ${this.translateService.instant('alertas._sinErrores')}`).substr(2);
    }
}
