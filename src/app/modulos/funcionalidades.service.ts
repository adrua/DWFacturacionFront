import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FuncionalidadesService {
    private rolUrl = '';  // URL to web api

    get usuario(): any {
      return 'prueba@demo.com'
    }
      
    constructor(private http: HttpClient) {
        this.rolUrl = `${environment.dataServiceUrl}/odata/ApplicationTree`;
    }

    getFuncionalidades(moduloId: any, userId: string): Observable<any[]> {
        let data = [
          {
            "id": 8,
            "name": "TablasBasicas",
            "descripcion": "Tablas Básicas",
            "check": true,
            "children": [
              {
                "id": 251,
                "name": "CNT_Bancos", 
                "descripcion": "Bancos",
                "check": true,
                "children": []
              },
              {
                "id": 261,
                "name": "COLMAG_Personajes", 
                "descripcion": "Personajes",
                "check": true,
                "children": []
              },
              {
                "id": 271,
                "name": "COLMAG_Estudiantes", 
                "descripcion": "Estudiantes",
                "check": true,
                "children": []
              },
              {
                "id": 281,
                "name": "COLMAG_Profesores", 
                "descripcion": "Profesores",
                "check": true,
                "children": []
              }

            ]
          },
          {
            "id": 179,
            "name": "Procesos",
            "descripcion": "Procesos",
            "check": true,
            "children": [
              {
                "id": 250,
                "name": "COLMAG_Inscripciones",
                "descripcion": "Inscripciones",
                "check": true,
                "children": []
              }
            ]
          }
        ]; 

        data = data.map((x) => {
          x.children = x.children.sort((y, z) => {
            let res = 0;
            switch(true) {
              case (y.descripcion > z.descripcion):
                res = 1;
                break;
              case (y.descripcion < z.descripcion):
                res = -1;
                break;
            }
            return res;
          });
          return x;
       });

       return of(data);
    }

    private handleError(operation = 'operation', result?: any) {

          // TODO: send the error to remote logging infrastructure
          console.log(result.error); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${result.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
    }

    /** Log a INVCO_BienesService message with the MessageService */
    private log(message: string) {
        // this.messageService.add(`loginService: ${message}`);
        console.log(`funcionalidadesService: ${message}`);
    }

}
