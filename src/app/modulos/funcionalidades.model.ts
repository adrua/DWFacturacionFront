
export class funcionalidadesModel {
    public aplicacionCodigo: number;
    public moduloCodigo: number;
    public funcionalidadCodigo: number;
    public funcionalidadNombre: string;
    public tipoFuncionalidad: number;
    public ventanaNombre: string;
    public ventanaObjeto: string;
    public novedadLibranza: number;
    public tipoDatoSolicitar: number;
    public sentenciaSql: string;
    public grupo: string;
    public indMenuInicio: number;
    public indResponse: number;

    public secuencia: number;
    public estado: string = 'N';
    public _id: string;
    public _v: number;
    public relaciones: any;

    constructor(json: any = null) {
        this.relaciones = {};
        if (json !== null) {
            this.aplicacionCodigo = json.aplicacionCodigo;
            this.moduloCodigo = json.moduloCodigo;
            this.funcionalidadCodigo = json.funcionalidadCodigo;
            this.funcionalidadNombre = json.funcionalidadNombre;
            this.tipoFuncionalidad = json.tipoFuncionalidad;
            this.ventanaNombre = json.ventanaNombre;
            this.ventanaObjeto = json.ventanaObjeto;
            this.novedadLibranza = json.novedadLibranza;
            this.tipoDatoSolicitar = json.tipoDatoSolicitar;
            this.sentenciaSql = json.sentenciaSql;
            this.grupo = json.grupo;
            this.indMenuInicio = json.indMenuInicio;
            this.indResponse = json.indResponse;
        }
    }
}

