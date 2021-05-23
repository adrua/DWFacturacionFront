
export class ModuloModel {
    public aplicacionCodigo: number;
    public moduloCodigo: number;
    public moduloNombre: string;
    public moduloDescripcion: string;
    public indTipoSeguridad: number;
    public indActivo: number;
    public rutaImagen: string;
    public indUtilidad: number;
    public rutaEjecutable: string;
    public ventanaPrincipal: string;

    public secuencia: number;
    public estado: string = 'N';
    public _id: string;
    public _v: number;
    public _funcionalidades: boolean = false;
    public _funcionalidadesShow: boolean = false;
    public relaciones: any;

    constructor(json: any = null) {
        this.relaciones = {};
        if (json !== null) {
            this.aplicacionCodigo = json.aplicacionCodigo;
            this.moduloCodigo = json.moduloCodigo;
            this.moduloNombre = json.moduloNombre;
            this.moduloDescripcion = json.moduloDescripcion;
            this.indTipoSeguridad = json.indTipoSeguridad;
            this.indActivo = json.indActivo;
            this.rutaImagen = json.rutaImagen;
            this.indUtilidad = json.indUtilidad;
            this.rutaEjecutable = json.rutaEjecutable;
            this.ventanaPrincipal = json.ventanaPrincipal;
        }
    }
}
