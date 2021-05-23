import { NgModule } from '@angular/core';
import { SharedModule } from '../app.shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { BusquedaComponent } from '../shared/busqueda/busqueda.dialog';

@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule
    ],
    declarations: [
        HomeComponent,
        NavbarComponent,
        FooterComponent,
        BusquedaComponent
    ],
    entryComponents: [
        BusquedaComponent
    ]
})
export class HomeModule {}
