export class CntBancosModel {
    public BancoId: number = 0;
    public BancoNombre: string;
    public BancoLongitud: number;
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.BancoId = json.BancoId;
            this.BancoNombre = json.BancoNombre;
            this.BancoLongitud = json.BancoLongitud;
        }
    }

    static clone(row: CntBancosModel): CntBancosModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;

        return rowCloned;
    }

    static cloneExcel(data: CntBancosModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              BancoId: dato.BancoId,
              BancoNombre: dato.BancoNombre,
              BancoLongitud: dato.BancoLongitud

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.BancoId}`;
        result += `${separator}${this.BancoNombre}`;
        result += `${separator}${this.BancoLongitud}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntBancosModel {
        const result = value.split(separator);

        this.BancoId = parseInt(result[0]);
        this.BancoNombre = result[1];
        this.BancoLongitud = parseInt(result[2]);

        return this;
    }

}
