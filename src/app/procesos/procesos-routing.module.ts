import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    // {
    //     path: 'COLMAG_Inscripciones',
    //     loadChildren: () => import('./colmag.inscripciones/colmag.inscripciones.module').then(mod => mod.ColmagInscripcionesModule)
    // },
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
