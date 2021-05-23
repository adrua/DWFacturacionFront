import { Component, HostListener } from '@angular/core';

import { ModuloService } from '../modulos/modulo.service';
import { FuncionalidadesService } from '../modulos/funcionalidades.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BusquedaComponent } from '../shared/busqueda/busqueda.dialog';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

declare var readOnly: boolean;
@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  opened: boolean = false;
  tipoLogoMenu: string = 'menu';
  altoVentana: string;

  modulos: ModuloModel[] = [];
  grupos: GrupoModel[] = [];
  funcionalidades: FuncionalidadModel[] = [];

  get usuario(): any {
    let _usuario;
    try {
      let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
      _usuario = jwt_decode(currentUser.token);
    } catch (error) {
      _usuario = {};
    };
    return _usuario;
  }

  get isInicio(): boolean {
    //Respuesta Mock
    var yaInicio = 'true';//sessionStorage.getItem("yaInicio");
    var _yaInicio = yaInicio != null && yaInicio == 'true';

    return _yaInicio;
  }

  get isLogin(): boolean {
    //Respuesta Mock
    var estaLogueado = 'true'; //sessionStorage.getItem("estaLogueado");
    var _isLogin = estaLogueado != null && estaLogueado == 'true';

    return _isLogin;
  }

  get isMenu(): boolean {
    let sIsMenu = sessionStorage.getItem("isMenu") || '';
    return sIsMenu === 'true';
  }

  modDescripcion: string = '';
  modNombre: string = '';
  modId: number = 0;
  grupoDescripcion: string = '';
  grupoNombre: string = '';
  grupoId: number = 0;
  funcDescripcion: string = '';
  funcNombre: string = '';

  _grupo: boolean = false;
  _funcionalidad: boolean = false;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private funcionalidadesService: FuncionalidadesService,
              private moduloService: ModuloService,
              private dialog: MatDialog,
              private router: Router) {}
  
  ngOnInit() {
    sessionStorage.setItem("isMenu", "true");
    if (this.isLogin) { this.setModulos(); }
  }

  setModulos() {
    readOnly = this.usuario.IsReadOnly === 'True';
    this.moduloService.getModulosByUser(this.usuario.id).subscribe((data) => {
      this.modulos = data;
      this.modulos.forEach(registro => {
        this.funcionalidadesService.getFuncionalidades(registro.id, this.usuario.id)
          .subscribe((data: any) => {
            registro.children = data;
          })
        });
    });
  }

  onVolverMenu() {
    sessionStorage.setItem("isMenu", "true");
    sessionStorage.removeItem("modulo");
    sessionStorage.removeItem("grupo");
    sessionStorage.removeItem("funcionalidad");
    this.grupos = [];
    this.funcionalidades = [];
    this.modDescripcion = '';
    this.modNombre = '';
    this.modId = 0;
    this.grupoDescripcion = '';
    this.grupoNombre = '';
    this.grupoId = 0;
    this.funcDescripcion = '';
    this.funcNombre = '';
    this.router.navigateByUrl('/');
    this.tipoLogoMenu = 'menu';
    this.setModulos();
  }

  onNavegacion(navegacion: any) {
    this.onSelectModulo(navegacion.modulo);
    this.onSelectGrupo(navegacion.grupo);
    this.onSelectFuncionalidad(navegacion.modulo, navegacion.grupo, navegacion.funcionalidad);
  }

  onCambiarIconoMenu() {
    if (this.tipoLogoMenu == 'more_vert') {
      this.tipoLogoMenu = 'menu';
      this.opened = false;
    } else {
      this.tipoLogoMenu = 'more_vert';
      this.opened = true;
    }
  }

  onSelectModulo(modulo: ModuloModel) {
    this._funcionalidad = false;
    if (this.modId == modulo.id) {
      this._grupo = !this._grupo;
    } else {
      this.modNombre = modulo.name;
      this.modId = modulo.id;
      this.grupos = modulo.children;
      this._grupo = true;
    }
  }

  onSelectGrupo(grupo: GrupoModel) {
    if (this.grupoId == grupo.id) {
      this._funcionalidad = !this._funcionalidad;
    } else {
      this.grupoNombre = grupo.name;
      this.grupoId = grupo.id;
      this.funcionalidades = grupo.children;
      this._funcionalidad = true;
    }
  }

  onSelectFuncionalidad(modulo: ModuloModel, grupo: GrupoModel, funcionalidad: FuncionalidadModel) {
    if (funcionalidad.name !== this.funcNombre) {
      this.grupoDescripcion = grupo.descripcion;
      this.modDescripcion = modulo.name;
      this.funcNombre = funcionalidad.name;
      this.funcDescripcion = funcionalidad.descripcion;
      this.router.navigateByUrl(`${modulo.name}/${grupo.name}/${funcionalidad.name}`);
      sessionStorage.setItem('isMenu', 'false');
      sessionStorage.setItem('modulo', modulo.name);
      sessionStorage.setItem('grupo', grupo.descripcion);
      sessionStorage.setItem('funcionalidad', funcionalidad.descripcion);
    }
  }

  onBusqueda() {
    const dialogRef = this.dialog.open(BusquedaComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        let funcionalidad: FuncionalidadModel = {
          check: result.data.State,
          children: null,
          descripcion: result.data.Description,
          id: result.data.IdTree,
          name: result.data.Name
        };

        let parent = result.data.Parent;
        let grupo: GrupoModel = {
          check: parent.State,
          children: null,
          descripcion: parent.Description,
          id: parent.IdTree,
          name: parent.Name
        };

        parent = result.data.Parent.Parent;
        let modulo: ModuloModel = {
          check: parent.State,
          children: null,
          descripcion: parent.Description,
          id: parent.IdTree,
          name: parent.Name
        };

        this.onSelectFuncionalidad(modulo, grupo, funcionalidad);
        
      }
    });
  }

  onCambiarClave() {
    // this.dialog.open(LOGIN_CambioClave_Dialog);
  }

  onCerrarSesion() {
    console.log('logged out');
    sessionStorage.setItem("isLogin", "false");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isMenu");
    sessionStorage.removeItem("modulo");
    sessionStorage.removeItem("grupo");
    sessionStorage.removeItem("funcionalidad");
    sessionStorage.setItem("estaLogueado", "false");
    this.opened = false;
    this.tipoLogoMenu = 'menu';

  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.blockUI.start();
      if (event.url == '/') { sessionStorage.setItem("isMenu", "true"); }
    }
    if (event instanceof NavigationEnd) { this.blockUI.stop(); }
    if (event instanceof NavigationCancel) { this.blockUI.stop(); }
    if (event instanceof NavigationError) { this.blockUI.stop(); }
  }
}

class ModuloModel {
  check: boolean;
  children: any[];
  descripcion: string;
  id: number;
  name: string;
}

class GrupoModel {
  check: boolean;
  children: FuncionalidadModel[];
  descripcion: string;
  id: number;
  name: string;
}

class FuncionalidadModel {
  check: boolean;
  children: any[];
  descripcion: string;
  id: number;
  name: string;
}
