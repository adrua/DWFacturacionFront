import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'CNTFacturas',
        loadChildren: () => import('./cnt.facturas/cnt.facturas.module').then(mod => mod.CntFacturasModule)
    },
    {
        path: 'CNTFacturas',
        loadChildren: () => import('./cnt.facturas/cnt.facturas.module').then(mod => mod.CntFacturasModule)
    },
    {
        path: '',
        children: [
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcesosRoutingModule { }
