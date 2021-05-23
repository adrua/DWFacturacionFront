import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { invProductosTable } from './inv.productos.table';

const routes: Routes = [
    {
        path: '',
        component: invProductosTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class invProductosRoutingModule { }
