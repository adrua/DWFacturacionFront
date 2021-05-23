import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { invProductosRoutingModule } from './inv.productos-routing.module';

import { invProductosTable } from './inv.productos.table';
import { invProductosDialog } from './inv.productos.dialog';

import { invSaldosTable } from './inv.saldos/inv.saldos.table';
import { invSaldosDialog } from './inv.saldos/inv.saldos.dialog';


@NgModule({
  declarations: [
    invProductosTable,
    invProductosDialog,
    invSaldosTable,
    invSaldosDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    invProductosRoutingModule
  ],
  entryComponents: [
    invProductosTable,
    invProductosDialog,
    invSaldosTable,
    invSaldosDialog
  ],
  exports: [
    invProductosTable,
    invProductosDialog,
    invSaldosTable,
    invSaldosDialog
  ]
})
export class invProductosModule { }
