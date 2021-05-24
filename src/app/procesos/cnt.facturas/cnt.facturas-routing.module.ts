import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CntFacturasTable } from './cnt.facturas.table';

const routes: Routes = [
    {
        path: '',
        component: CntFacturasTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CntFacturasRoutingModule { }
