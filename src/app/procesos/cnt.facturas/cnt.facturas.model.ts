import { CntFacturaMovimientosModel } from './cnt.facturamovimientos/cnt.facturamovimientos.model';

export class CntFacturasModel {
    public FacturaId: number = 0;
    public FacturaSerie: number;
    public CntFacturasComp: string;
    public FacturaFecha: Date;
    public ClienteId: number;
    public FacturaValor: number = 0.0;
    public FacturaValorNoGravado: number = 0.0;
    public FacturaImpuestos: number = 0.0;
    public FacturaTotal: number = 0.0;
    public CntClientes: any = {};
    public CntFacturaMovimientos: Array<CntFacturaMovimientosModel> = [];
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.FacturaId = json.FacturaId;
            this.FacturaSerie = json.FacturaSerie;
            this.CntFacturasComp =  json.CntFacturasComp;
            this.FacturaFecha = json.FacturaFecha;
            this.ClienteId = json.ClienteId;
            this.FacturaValor = json.FacturaValor;
            this.FacturaValorNoGravado = json.FacturaValorNoGravado;
            this.FacturaImpuestos = json.FacturaImpuestos;
            this.FacturaTotal = json.FacturaTotal;
            this.CntClientes = json.CntClientes;
            this.CntFacturaMovimientos = json.CntFacturaMovimientos;
        }
    }

    static clone(row: CntFacturasModel): CntFacturasModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.CntClientes;
        delete rowCloned.CntFacturaMovimientos;

        return rowCloned;
    }

    static cloneExcel(data: CntFacturasModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              FacturaId: dato.FacturaId,
              FacturaSerie: dato.FacturaSerie,
              CntFacturasComp:  dato.CntFacturasComp,
              FacturaFecha: dato.FacturaFecha,
              ClienteId: dato.ClienteId,
              FacturaValor: dato.FacturaValor,
              FacturaValorNoGravado: dato.FacturaValorNoGravado,
              FacturaImpuestos: dato.FacturaImpuestos,
              FacturaTotal: dato.FacturaTotal,
              CntClientes:  dato.CntClientes

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.FacturaId}`;
        result += `${separator}${this.FacturaSerie}`;
        result += `${separator}${this.FacturaFecha}`;
        result += `${separator}${this.ClienteId}`;
        result += `${separator}${this.FacturaValor}`;
        result += `${separator}${this.FacturaValorNoGravado}`;
        result += `${separator}${this.FacturaImpuestos}`;
        result += `${separator}${this.FacturaTotal}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntFacturasModel {
        const result = value.split(separator);

        this.FacturaId = parseInt(result[0]);
        this.FacturaSerie = parseInt(result[1]);
        this.FacturaFecha = new Date(result[2]);
        this.ClienteId = parseFloat(result[3]);
        this.FacturaValor = parseFloat(result[4]);
        this.FacturaValorNoGravado = parseFloat(result[5]);
        this.FacturaImpuestos = parseFloat(result[6]);
        this.FacturaTotal = parseFloat(result[7]);

        return this;
    }

}
