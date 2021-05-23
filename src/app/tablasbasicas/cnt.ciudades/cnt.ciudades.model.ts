export class CntCiudadesModel {
    public CiudadDepartamentoId: number;
    public Ciudadid: number;
    public CntCiudadesComp: string;
    public CiudadCodigoPoblado: number;
    public CiudadNombreDepartamento: string;
    public CiudadNombreCiudad: string;
    public CiudadNombrePoblado: string;
    public CiudadTipoMunicipio: string;
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.CiudadDepartamentoId = json.CiudadDepartamentoId;
            this.Ciudadid = json.Ciudadid;
            this.CntCiudadesComp =  json.CntCiudadesComp;
            this.CiudadCodigoPoblado = json.CiudadCodigoPoblado;
            this.CiudadNombreDepartamento = json.CiudadNombreDepartamento;
            this.CiudadNombreCiudad = json.CiudadNombreCiudad;
            this.CiudadNombrePoblado = json.CiudadNombrePoblado;
            this.CiudadTipoMunicipio = json.CiudadTipoMunicipio;
        }
    }

    static clone(row: CntCiudadesModel): CntCiudadesModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;

        return rowCloned;
    }

    static cloneExcel(data: CntCiudadesModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              CiudadDepartamentoId: dato.CiudadDepartamentoId,
              Ciudadid: dato.Ciudadid,
              CntCiudadesComp:  dato.CntCiudadesComp,
              CiudadCodigoPoblado: dato.CiudadCodigoPoblado,
              CiudadNombreDepartamento: dato.CiudadNombreDepartamento,
              CiudadNombreCiudad: dato.CiudadNombreCiudad,
              CiudadNombrePoblado: dato.CiudadNombrePoblado,
              CiudadTipoMunicipio: dato.CiudadTipoMunicipio

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.CiudadDepartamentoId}`;
        result += `${separator}${this.Ciudadid}`;
        result += `${separator}${this.CiudadCodigoPoblado}`;
        result += `${separator}${this.CiudadNombreDepartamento}`;
        result += `${separator}${this.CiudadNombreCiudad}`;
        result += `${separator}${this.CiudadNombrePoblado}`;
        result += `${separator}${this.CiudadTipoMunicipio}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntCiudadesModel {
        const result = value.split(separator);

        this.CiudadDepartamentoId = parseInt(result[0]);
        this.Ciudadid = parseInt(result[1]);
        this.CiudadCodigoPoblado = parseFloat(result[2]);
        this.CiudadNombreDepartamento = result[3];
        this.CiudadNombreCiudad = result[4];
        this.CiudadNombrePoblado = result[5];
        this.CiudadTipoMunicipio = result[6];

        return this;
    }

}
