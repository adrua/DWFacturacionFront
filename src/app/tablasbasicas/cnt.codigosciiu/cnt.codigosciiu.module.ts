import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/app.shared.module';
import { AppMaterialModule } from 'src/app/app.material.module';

import { CntCodigosCiiuRoutingModule } from './cnt.codigosciiu-routing.module';

import { CntCodigosCiiuTable } from './cnt.codigosciiu.table';
import { CntCodigosCiiuDialog } from './cnt.codigosciiu.dialog';


@NgModule({
  declarations: [
    CntCodigosCiiuTable,
    CntCodigosCiiuDialog
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CntCodigosCiiuRoutingModule
  ],
  entryComponents: [
    CntCodigosCiiuTable,
    CntCodigosCiiuDialog
  ],
  exports: [
    CntCodigosCiiuTable,
    CntCodigosCiiuDialog
  ]
})
export class CntCodigosCiiuModule { }
