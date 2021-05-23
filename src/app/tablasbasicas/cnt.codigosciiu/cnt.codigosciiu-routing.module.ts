import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CntCodigosCiiuTable } from './cnt.codigosciiu.table';

const routes: Routes = [
    {
        path: '',
        component: CntCodigosCiiuTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CntCodigosCiiuRoutingModule { }
