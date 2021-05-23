import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { CntBancosRoutingModule } from './cnt.bancos-routing.module';

import { CntBancosTable } from './cnt.bancos.table';
import { CntBancosDialog } from './cnt.bancos.dialog';


@NgModule({
  declarations: [
    CntBancosTable,
    CntBancosDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CntBancosRoutingModule
  ],
  entryComponents: [
    CntBancosTable,
    CntBancosDialog
  ],
  exports: [
    CntBancosTable,
    CntBancosDialog
  ]
})
export class CntBancosModule { }
