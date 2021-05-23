import {  Component, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from './_helpers/authentication.service';
import { environment } from 'src/environments/environment';

declare var conditionsLists: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  currentUser: any;

  title = `Inscripciones v${environment.VERSION}`;
  
  constructor(private authenticationService: AuthenticationService,
        readonly translate: TranslateService) {
    window.document.title = this.title;

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('es');
    
    // the lang to use, if the lang isn't available, it will use the current loader to get them

    for(var key in conditionsLists) {
      conditionsLists[key].map((x) => translate.get(`CONDITIONS_LIST_${key.toUpperCase()}.${x.value}`).subscribe((res: string) => {
        x.label = res;
      }));
    }

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    
  }

}
