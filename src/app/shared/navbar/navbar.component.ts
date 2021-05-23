import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'navbar-component',
    templateUrl: './navbar.component.html',
    styleUrls: [ './navbar.component.css']
})
export class NavbarComponent {

    constructor(private router: Router) {}

    onPrincipal() {
        this.router.navigateByUrl('/DAI');
    }
}