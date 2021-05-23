import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { CntCiudadesRoutingModule } from './cnt.ciudades-routing.module';

import { CntCiudadesTable } from './cnt.ciudades.table';
import { CntCiudadesDialog } from './cnt.ciudades.dialog';


@NgModule({
  declarations: [
    CntCiudadesTable,
    CntCiudadesDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CntCiudadesRoutingModule
  ],
  entryComponents: [
    CntCiudadesTable,
    CntCiudadesDialog
  ],
  exports: [
    CntCiudadesTable,
    CntCiudadesDialog
  ]
})
export class CntCiudadesModule { }
