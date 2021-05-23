import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CntCiudadesTable } from './cnt.ciudades.table';

const routes: Routes = [
    {
        path: '',
        component: CntCiudadesTable
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CntCiudadesRoutingModule { }
