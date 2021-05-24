import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { CntFacturasRoutingModule } from './cnt.facturas-routing.module';

import { CntFacturasTable } from './cnt.facturas.table';
import { CntFacturasDialog } from './cnt.facturas.dialog';

import { CntFacturaMovimientosTable } from './cnt.facturamovimientos/cnt.facturamovimientos.table';
import { CntFacturaMovimientosDialog } from './cnt.facturamovimientos/cnt.facturamovimientos.dialog';


@NgModule({
  declarations: [
    CntFacturasTable,
    CntFacturasDialog,
    CntFacturaMovimientosTable,
    CntFacturaMovimientosDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CntFacturasRoutingModule
  ],
  entryComponents: [
    CntFacturasTable,
    CntFacturasDialog,
    CntFacturaMovimientosTable,
    CntFacturaMovimientosDialog
  ],
  exports: [
    CntFacturasTable,
    CntFacturasDialog,
    CntFacturaMovimientosTable,
    CntFacturaMovimientosDialog
  ]
})
export class CntFacturasModule { }
