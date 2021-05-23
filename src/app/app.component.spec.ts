import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app.material.module';
import { SharedModule } from './app.shared.module';

window["lastError"] = null;
var genericFilterString = (filter) => `${filter.column} ${filter.condition} '${filter.value}'`;
var genericFilterNumber = (filter) => `${filter.column} ${filter.condition} ${filter.value}`;
var genericFilterDate = (filter) => `${filter.column} ${filter.condition} ${filter.value.toISOString()}`;

const CONDITIONS_LIST = [
  { value: 'like', label: 'Contains', filter: (filter) => `indexof(${filter.column}, '${filter.value}') ge 0`},
  { value: 'not like', label: 'Not Contains', filter: (filter) => `indexof(${filter.column}, ${filter.value}) lt 0` },
  { value: 'Eq', label: 'Is equal', filter: genericFilterString },
  { value: 'Ne', label: 'Is not equal', filter: genericFilterString }
];

const CONDITIONS_LIST_NUMBER = [
  { value: 'Gt', label: 'Greater Than', filter: genericFilterNumber },
  { value: 'Ge', label: 'Greater or Equal', filter: genericFilterNumber },
  { value: 'Lt', label: 'Less Than', filter: genericFilterNumber },
  { value: 'Le', label: 'Less or Equal', filter: genericFilterNumber },
  { value: 'Eq', label: 'Is equal', filter: genericFilterNumber },
  { value: 'Ne', label: 'Is not equal', filter: genericFilterNumber }
];

const CONDITIONS_LIST_DATE = [
  { value: 'Gt', label: 'Greater Than', filter: genericFilterDate },
  { value: 'Ge', label: 'Greater or Equal', filter: genericFilterDate },
  { value: 'Lt', label: 'Less Than', filter: genericFilterDate },
  { value: 'Le', label: 'Less or Equal', filter: genericFilterDate },
  { value: 'Eq', label: 'Is equal', filter: genericFilterDate },
  { value: 'Ne', label: 'Is not equal', filter: genericFilterDate }
];

window["conditionsLists"] = {
  "Date": CONDITIONS_LIST_DATE,
  "Number": CONDITIONS_LIST_NUMBER,
  "Varchar": CONDITIONS_LIST,
}

window["readOnly"] = false;

describe('AppComponent', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AppMaterialModule,
        SharedModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: []
    }).compileComponents();

  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'SICEQ-front'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('esap-front');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('esap-front app is running!');
  // });
});
