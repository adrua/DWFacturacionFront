import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'CNT_Bancos',
        loadChildren: () => import('./cnt.bancos/cnt.bancos.module').then(mod => mod.CntBancosModule),
        //canActivate: [AuthGuard]
    },
    {
        path: '',
        children: [ ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TablasBasicasRoutingModule { }
