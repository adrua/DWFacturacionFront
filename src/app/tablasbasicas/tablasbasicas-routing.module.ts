import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CntCodigosCiiuModule } from './cnt.codigosciiu/cnt.codigosciiu.module';

const routes: Routes = [
    {
        path: 'CNTBancos',
        loadChildren: () => import('./cnt.bancos/cnt.bancos.module').then(mod => mod.CntBancosModule),
        //canActivate: [AuthGuard]
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
    },
    {
        path: 'CNTCodigosCiiu',
        loadChildren: () => import('./cnt.codigosciiu/cnt.codigosciiu.module').then(mod => mod.CntCodigosCiiuModule)
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
