import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CntClientesTable } from './cnt.clientes.table';

const routes: Routes = [
    {
        path: '',
        component: CntClientesTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CntClientesRoutingModule { }
