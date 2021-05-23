export class invSaldosModel {
    public ProductoLinea: string;
    public PeriodoDescripcionx: string;
    public invSaldosComp: string;
    public InvSaldosCantidad: number = 0.0;
    public InvSaldosValor: number = 0.0;
    public InvSaldosTotal: number = 0.0;
    public InvSaldosValorPromedio: number = 0.0;
    public InvSaldosUltimoValor: number = 0.0;
    public InvSaldosMaximoValor: number = 0.0;
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.ProductoLinea = json.ProductoLinea;
            this.PeriodoDescripcionx = json.PeriodoDescripcionx;
            this.invSaldosComp =  json.invSaldosComp;
            this.InvSaldosCantidad = json.InvSaldosCantidad;
            this.InvSaldosValor = json.InvSaldosValor;
            this.InvSaldosTotal = json.InvSaldosTotal;
            this.InvSaldosValorPromedio = json.InvSaldosValorPromedio;
            this.InvSaldosUltimoValor = json.InvSaldosUltimoValor;
            this.InvSaldosMaximoValor = json.InvSaldosMaximoValor;
        }
    }

    static clone(row: invSaldosModel): invSaldosModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;

        return rowCloned;
    }

    static cloneExcel(data: invSaldosModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              ProductoLinea: dato.ProductoLinea,
              PeriodoDescripcionx: dato.PeriodoDescripcionx,
              invSaldosComp:  dato.invSaldosComp,
              InvSaldosCantidad: dato.InvSaldosCantidad,
              InvSaldosValor: dato.InvSaldosValor,
              InvSaldosTotal: dato.InvSaldosTotal,
              InvSaldosValorPromedio: dato.InvSaldosValorPromedio,
              InvSaldosUltimoValor: dato.InvSaldosUltimoValor,
              InvSaldosMaximoValor: dato.InvSaldosMaximoValor

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.ProductoLinea}`;
        result += `${separator}${this.PeriodoDescripcionx}`;
        result += `${separator}${this.InvSaldosCantidad}`;
        result += `${separator}${this.InvSaldosValor}`;
        result += `${separator}${this.InvSaldosTotal}`;
        result += `${separator}${this.InvSaldosValorPromedio}`;
        result += `${separator}${this.InvSaldosUltimoValor}`;
        result += `${separator}${this.InvSaldosMaximoValor}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): invSaldosModel {
        const result = value.split(separator);

        this.ProductoLinea = result[0];
        this.PeriodoDescripcionx = result[1];
        this.InvSaldosCantidad = parseFloat(result[2]);
        this.InvSaldosValor = parseFloat(result[3]);
        this.InvSaldosTotal = parseFloat(result[4]);
        this.InvSaldosValorPromedio = parseFloat(result[5]);
        this.InvSaldosUltimoValor = parseFloat(result[6]);
        this.InvSaldosMaximoValor = parseFloat(result[7]);

        return this;
    }

}
