import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { httpInterceptorProviders } from './interceptors';
import { AppMaterialModule } from './app.material.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

declare var conditionsLists: any;
@NgModule({
    declarations: [
  ],
  imports: [ 
    CommonModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
 ],
 exports: [ 
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule
  ],
    entryComponents: [
  ],
})
export class SharedModule {

  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('es');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('es');

    for(var key in conditionsLists) {
      conditionsLists[key].map((x) => translate.get(`CONDITIONS_LIST_${key.toUpperCase()}.${x.value}`).subscribe((res: string) => {
        x.label = res;
      }));
    }
  }
  
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      //providers: [httpInterceptorProviders, TranslateService]
    }
  }
}
