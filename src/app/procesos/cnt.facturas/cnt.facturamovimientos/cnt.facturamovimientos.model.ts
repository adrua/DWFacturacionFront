export class CntFacturaMovimientosModel {
    public FacturaId: number;
    public FacturaSerie: number;
    public ProductoLinea: string;
    public CntFacturaMovimientosComp: string;
    public FacturaMovimientoCantidad: number = 1.0;
    public FacturaMovimientoValorUnidad: number = 0.0;
    public FacturaMovimientoTotal: number = 0.0;
    public invProductos: any = {};
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.FacturaId = json.FacturaId;
            this.FacturaSerie = json.FacturaSerie;
            this.ProductoLinea = json.ProductoLinea;
            this.CntFacturaMovimientosComp =  json.CntFacturaMovimientosComp;
            this.FacturaMovimientoCantidad = json.FacturaMovimientoCantidad;
            this.FacturaMovimientoValorUnidad = json.FacturaMovimientoValorUnidad;
            this.FacturaMovimientoTotal = json.FacturaMovimientoTotal;
            this.invProductos = json.invProductos;
        }
    }

    static clone(row: CntFacturaMovimientosModel): CntFacturaMovimientosModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.invProductos;

        return rowCloned;
    }

    static cloneExcel(data: CntFacturaMovimientosModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              FacturaId: dato.FacturaId,
              FacturaSerie: dato.FacturaSerie,
              ProductoLinea: dato.ProductoLinea,
              CntFacturaMovimientosComp:  dato.CntFacturaMovimientosComp,
              FacturaMovimientoCantidad: dato.FacturaMovimientoCantidad,
              FacturaMovimientoValorUnidad: dato.FacturaMovimientoValorUnidad,
              FacturaMovimientoTotal: dato.FacturaMovimientoTotal,
              invProductos:  dato.invProductos

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.FacturaId}`;
        result += `${separator}${this.FacturaSerie}`;
        result += `${separator}${this.ProductoLinea}`;
        result += `${separator}${this.FacturaMovimientoCantidad}`;
        result += `${separator}${this.FacturaMovimientoValorUnidad}`;
        result += `${separator}${this.FacturaMovimientoTotal}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntFacturaMovimientosModel {
        const result = value.split(separator);

        this.FacturaId = parseInt(result[0]);
        this.FacturaSerie = parseInt(result[1]);
        this.ProductoLinea = result[2];
        this.FacturaMovimientoCantidad = parseFloat(result[3]);
        this.FacturaMovimientoValorUnidad = parseFloat(result[4]);
        this.FacturaMovimientoTotal = parseFloat(result[5]);

        return this;
    }

}
