import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { Busqueda_Service } from './busqueda.service';

declare var lastError: HttpErrorResponse;

@Component({
  templateUrl: './busqueda.dialog.html',
  providers: [Busqueda_Service]
})
export class BusquedaComponent {
    
    busquedaForm: FormGroup;
    selFuncionalidad: any;
    
    ESAPBOGFuncionalidadesNombreCtrl: FormControl = new FormControl(['', [ 
                (control: AbstractControl): {[key: string]: any} | null => {
                    const selected = !!control["selected"];
                    if (control.value == '') {
                        return null;
                    } else {
                        return !selected ? {'ESAPBOGFuncionalidadesCtrl': true } : null;
                    }
                }] ]);
                
    filteredESAPBOGFuncionalidadesNombre: Array<any> = [];

    _proc: boolean = false;
    _status: boolean = false;
    resultError: string = null;

    constructor(private builder: FormBuilder,
                private BusquedaService: Busqueda_Service,
                private _snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<BusquedaComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.dialogRef.disableClose = true; 
    }

    ngOnInit() {
        this.busquedaForm = this.builder.group({
            'ESAPBOGFuncionalidadesId': ['', Validators.required],
            'ESAPBOGGrupoNombre': [ { value: '', disabled: true } ],
            'ESAPBOGModuloNombre': [ { value: '', disabled: true } ],
        }, { 
            validators: (formGroup: FormGroup): ValidationErrors | null => {
                let validationErrors: any = null;
                return validationErrors;
            } 
        });
        
        this.ESAPBOGFuncionalidadesNombreCtrl.setValue('');
        this.ESAPBOGFuncionalidadesNombreCtrl.valueChanges
            .pipe(
                startWith(''),
                switchMap((data) => this.BusquedaService.filterESAPBOGFuncionalidadesNombre(data))
            ).subscribe((data) => this.filteredESAPBOGFuncionalidadesNombre = data.value);

        this.busquedaForm.valueChanges.subscribe((data) => {
            this.busquedaForm.patchValue({
            }, {emitEvent: false, onlySelf: true});
        });
    }

    onSubmit(formData: any) {
        this._proc = true;
        if (this.busquedaForm.valid) {
            this.dialogRef.close({ 
                data: this.selFuncionalidad
            });
        }
    }

    openNotificationDanger(message: string, action?: string) {
       this._snackBar.open(message, action, {
           duration: 10000,
           panelClass: 'dangerSnackBar',
       });
    }    

    onKeydown_ESAPBOGFuncionalidadesNombre(e: Event) {
        this.ESAPBOGFuncionalidadesNombreCtrl["selected"] = false;
        this.selFuncionalidad = null;
        
        this.busquedaForm.patchValue({
            ESAPBOGFuncionalidadesId: null,
            ESAPBOGGrupoNombre: null,
            ESAPBOGModuloNombre: null
        });
    }
    
    onSelect_ESAPBOGFuncionalidadesNombre(opt: any){
        this.ESAPBOGFuncionalidadesNombreCtrl["selected"] = true;
        this.ESAPBOGFuncionalidadesNombreCtrl["ESAPBOG_Funcionalidades"] = opt;
        this.selFuncionalidad = opt;

        this.busquedaForm.patchValue({
            ESAPBOGFuncionalidadesId: opt.IdTree,
            ESAPBOGGrupoNombre: opt.Parent.Description,
            ESAPBOGModuloNombre: opt.Parent.Parent.Description
        });        
    }    

    getErrorMessages(): string {
        let errors = "";
        Object.keys(this.busquedaForm.errors || {}).forEach(key => {
            errors += `, ${key}: ${this.busquedaForm.errors[key]}\n`; 
        });
        
        let controls = this.busquedaForm.controls;
        
        Object.keys(controls).forEach(key => {
            Object.keys(controls[key].errors || {}).forEach(errKey => {
                errors += `, ${key}: ${errKey}`; 
            });
        });        
        
        return (errors || ', No hay errores. Listo para salvar').substr(2);
    }
}
