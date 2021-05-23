import { invSaldosModel } from './inv.saldos/inv.saldos.model';

export enum EnumProductoUnidad {
  'Unidades' = '1',
  'Metros' = '2',
  'Docenas' = '3',
  'Litros' = '4',
  'Gramos' = '5'
}

export enum EnumProductoTipo {
  'Fisico' = '1',
  'uso_ocasional' = '2',
  'Producto_Similar' = '3',
  'Proveedores' = '4'
}

export class invProductosModel {
    public ProductoLinea: string;
    public ProductoDescripcion: string;
    public ProductoSaldo: number = 0.0;
    public ProductoCosto: number = 0.0;
    public ProductoPrecio: number = 0.0;
    public Productoiva: number;
    public ProductoUnidad: EnumProductoUnidad = EnumProductoUnidad['Metros'];
    public ProductoCodigoBarra: string;
    public ProductoCantidadMinima: number = 0.0;
    public ProductoCantidadMaxima: number = 0.0;
    public ProductoUbicacion: string;
    public ProductoTipo: EnumProductoTipo = EnumProductoTipo['Servicio'];
    public ProductoControlSaldo: Boolean = false;
    public ProductoObservaciones: string;
    public invSaldos: Array<invSaldosModel> = [];
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.ProductoLinea = json.ProductoLinea;
            this.ProductoDescripcion = json.ProductoDescripcion;
            this.ProductoSaldo = json.ProductoSaldo;
            this.ProductoCosto = json.ProductoCosto;
            this.ProductoPrecio = json.ProductoPrecio;
            this.Productoiva = json.Productoiva;
            this.ProductoUnidad = json.ProductoUnidad;
            this.ProductoCodigoBarra = json.ProductoCodigoBarra;
            this.ProductoCantidadMinima = json.ProductoCantidadMinima;
            this.ProductoCantidadMaxima = json.ProductoCantidadMaxima;
            this.ProductoUbicacion = json.ProductoUbicacion;
            this.ProductoTipo = json.ProductoTipo;
            this.ProductoControlSaldo = json.ProductoControlSaldo;
            this.ProductoObservaciones = json.ProductoObservaciones;
            this.invSaldos = json.invSaldos;
        }
    }

    static clone(row: invProductosModel): invProductosModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.invSaldos;

        return rowCloned;
    }

    static cloneExcel(data: invProductosModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              ProductoLinea: dato.ProductoLinea,
              ProductoDescripcion: dato.ProductoDescripcion,
              ProductoSaldo: dato.ProductoSaldo,
              ProductoCosto: dato.ProductoCosto,
              ProductoPrecio: dato.ProductoPrecio,
              Productoiva: dato.Productoiva,
              ProductoUnidad: dato.ProductoUnidad,
              ProductoCodigoBarra: dato.ProductoCodigoBarra,
              ProductoCantidadMinima: dato.ProductoCantidadMinima,
              ProductoCantidadMaxima: dato.ProductoCantidadMaxima,
              ProductoUbicacion: dato.ProductoUbicacion,
              ProductoTipo: dato.ProductoTipo,
              ProductoControlSaldo: dato.ProductoControlSaldo,
              ProductoObservaciones: dato.ProductoObservaciones

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.ProductoLinea}`;
        result += `${separator}${this.ProductoDescripcion}`;
        result += `${separator}${this.ProductoSaldo}`;
        result += `${separator}${this.ProductoCosto}`;
        result += `${separator}${this.ProductoPrecio}`;
        result += `${separator}${this.Productoiva}`;
        result += `${separator}${this.ProductoUnidad}`;
        result += `${separator}${this.ProductoCodigoBarra}`;
        result += `${separator}${this.ProductoCantidadMinima}`;
        result += `${separator}${this.ProductoCantidadMaxima}`;
        result += `${separator}${this.ProductoUbicacion}`;
        result += `${separator}${this.ProductoTipo}`;
        result += `${separator}${this.ProductoControlSaldo}`;
        result += `${separator}${this.ProductoObservaciones}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): invProductosModel {
        const result = value.split(separator);

        this.ProductoLinea = result[0];
        this.ProductoDescripcion = result[1];
        this.ProductoSaldo = parseFloat(result[2]);
        this.ProductoCosto = parseFloat(result[3]);
        this.ProductoPrecio = parseFloat(result[4]);
        this.Productoiva = parseFloat(result[5]);
        this.ProductoUnidad = EnumProductoUnidad[result[6]];
        this.ProductoCodigoBarra = result[7];
        this.ProductoCantidadMinima = parseFloat(result[8]);
        this.ProductoCantidadMaxima = parseFloat(result[9]);
        this.ProductoUbicacion = result[10];
        this.ProductoTipo = EnumProductoTipo[result[11]];
        this.ProductoControlSaldo = new Boolean(result[12]);
        this.ProductoObservaciones = result[13];

        return this;
    }

}
