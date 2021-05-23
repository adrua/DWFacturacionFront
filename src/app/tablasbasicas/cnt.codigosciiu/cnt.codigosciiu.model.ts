export class CntCodigosCiiuModel {
    public CodigoCiiuId: string;
    public CodigoCiiuDescripcion: string;
    public CodigoCiiuclase: Boolean = true;
    public CodigoCiiugrupo: Boolean = false;
    public CodigoCiiudivision: Boolean = false;
    public CodigoCiiuBloqueo: Boolean = false;
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.CodigoCiiuId = json.CodigoCiiuId;
            this.CodigoCiiuDescripcion = json.CodigoCiiuDescripcion;
            this.CodigoCiiuclase = json.CodigoCiiuclase;
            this.CodigoCiiugrupo = json.CodigoCiiugrupo;
            this.CodigoCiiudivision = json.CodigoCiiudivision;
            this.CodigoCiiuBloqueo = json.CodigoCiiuBloqueo;
        }
    }

    static clone(row: CntCodigosCiiuModel): CntCodigosCiiuModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;

        return rowCloned;
    }

    static cloneExcel(data: CntCodigosCiiuModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              CodigoCiiuId: dato.CodigoCiiuId,
              CodigoCiiuDescripcion: dato.CodigoCiiuDescripcion,
              CodigoCiiuclase: dato.CodigoCiiuclase,
              CodigoCiiugrupo: dato.CodigoCiiugrupo,
              CodigoCiiudivision: dato.CodigoCiiudivision,
              CodigoCiiuBloqueo: dato.CodigoCiiuBloqueo

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.CodigoCiiuId}`;
        result += `${separator}${this.CodigoCiiuDescripcion}`;
        result += `${separator}${this.CodigoCiiuclase}`;
        result += `${separator}${this.CodigoCiiugrupo}`;
        result += `${separator}${this.CodigoCiiudivision}`;
        result += `${separator}${this.CodigoCiiuBloqueo}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntCodigosCiiuModel {
        const result = value.split(separator);

        this.CodigoCiiuId = result[0];
        this.CodigoCiiuDescripcion = result[1];
        this.CodigoCiiuclase = new Boolean(result[2]);
        this.CodigoCiiugrupo = new Boolean(result[3]);
        this.CodigoCiiudivision = new Boolean(result[4]);
        this.CodigoCiiuBloqueo = new Boolean(result[5]);

        return this;
    }

}
