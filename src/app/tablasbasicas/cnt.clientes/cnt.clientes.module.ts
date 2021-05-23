import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { CntClientesRoutingModule } from './cnt.clientes-routing.module';

import { CntClientesTable } from './cnt.clientes.table';
import { CntClientesDialog } from './cnt.clientes.dialog';


@NgModule({
  declarations: [
    CntClientesTable,
    CntClientesDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CntClientesRoutingModule
  ],
  entryComponents: [
    CntClientesTable,
    CntClientesDialog
  ],
  exports: [
    CntClientesTable,
    CntClientesDialog
  ]
})
export class CntClientesModule { }
