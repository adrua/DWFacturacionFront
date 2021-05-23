import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CntBancosTable } from './cnt.bancos.table';

const routes: Routes = [
    {
        path: '',
        component: CntBancosTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CntBancosRoutingModule { }
