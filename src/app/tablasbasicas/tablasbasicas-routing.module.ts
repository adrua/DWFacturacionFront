import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CntCodigosCiiuModule } from './cnt.codigosciiu/cnt.codigosciiu.module';

const routes: Routes = [
    {
        path: 'CNT_Bancos',
        loadChildren: () => import('./cnt.bancos/cnt.bancos.module').then(mod => mod.CntBancosModule),
        //canActivate: [AuthGuard]
    },
    {
        path: 'CNT_CodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule),
        //canActivate: [AuthGuard]
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModuleModule)
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
