export enum EnumClienteClasificacion {
  'Natural' = '0',
  'Juridica' = '1'
}

export enum EnumClienteTipoID {
  'Numero_Identificacion_Tributaria' = '0',
  'Cedula_Ciudadania' = '1',
  'Pasaporte' = '2',
  'Tarjeta_de_Identidad' = '3',
  'Cedula_Extranjeria' = '4',
  'Tarjeta_Extranjeria' = '5'
}

export enum EnumClienteEstado {
  'Activo' = '0',
  'Anulado' = '1'
}

export class CntClientesModel {
    public ClienteId: number;
    public ClienteClasificacion: EnumClienteClasificacion = EnumClienteClasificacion['Persona_Natural'];
    public ClienteTipoID: EnumClienteTipoID = EnumClienteTipoID['Numero_Identificacion_Tributaria'];
    public ClienteNit: string;
    public ClienteEdad: number;
    public CodigoCiiuId: string;
    public ClienteEstado: EnumClienteEstado = EnumClienteEstado['Activo'];
    public ClienteRazonSocial: string;
    public ClienteDireccion: string;
    public CiudadDepartamentoId: number;
    public Ciudadid: number;
    public CntCiudadesComp: string;
    public ClienteTelefono: string;
    public ClienteCelular: string;
    public ClienteEmail: string;
    public ClienteContacto: string;
    public ClienteTelefonoContacto: string;
    public ClienteEmailContacto: string;
    public CntCodigosCiiu: any = {};
    public CntCiudades: any = {};
    public _secuencia?: number = 0;
    public _estado?: string = 'N';
    public _id?: string = '';
    public _v?: number = 0;

    constructor(json?: any) {
        if(json) {        
            this.ClienteId = json.ClienteId;
            this.ClienteClasificacion = json.ClienteClasificacion;
            this.ClienteTipoID = json.ClienteTipoID;
            this.ClienteNit = json.ClienteNit;
            this.ClienteEdad = json.ClienteEdad;
            this.CodigoCiiuId = json.CodigoCiiuId;
            this.ClienteEstado = json.ClienteEstado;
            this.ClienteRazonSocial = json.ClienteRazonSocial;
            this.ClienteDireccion = json.ClienteDireccion;
            this.CiudadDepartamentoId = json.CiudadDepartamentoId;
            this.Ciudadid = json.Ciudadid;
            this.CntCiudadesComp =  json.CntCiudadesComp;
            this.ClienteTelefono = json.ClienteTelefono;
            this.ClienteCelular = json.ClienteCelular;
            this.ClienteEmail = json.ClienteEmail;
            this.ClienteContacto = json.ClienteContacto;
            this.ClienteTelefonoContacto = json.ClienteTelefonoContacto;
            this.ClienteEmailContacto = json.ClienteEmailContacto;
            this.CntCodigosCiiu = json.CntCodigosCiiu;
            this.CntCiudades = json.CntCiudades;
        }
    }

    static clone(row: CntClientesModel): CntClientesModel {
        const rowCloned = Object.assign({}, row);

        delete rowCloned._secuencia;
        delete rowCloned._estado;
        delete rowCloned._id;
        delete rowCloned._v;
        delete rowCloned.CntCodigosCiiu;
        delete rowCloned.CntCiudades;

        return rowCloned;
    }

    static cloneExcel(data: CntClientesModel[]): any[] {		 
       let dataExcel: any[] = [];		 
       data.forEach(dato => {		 
           let registro = {		 

              ClienteId: dato.ClienteId,
              ClienteClasificacion: dato.ClienteClasificacion,
              ClienteTipoID: dato.ClienteTipoID,
              ClienteNit: dato.ClienteNit,
              ClienteEdad: dato.ClienteEdad,
              CodigoCiiuId: dato.CodigoCiiuId,
              ClienteEstado: dato.ClienteEstado,
              ClienteRazonSocial: dato.ClienteRazonSocial,
              ClienteDireccion: dato.ClienteDireccion,
              CiudadDepartamentoId: dato.CiudadDepartamentoId,
              Ciudadid: dato.Ciudadid,
              CntCiudadesComp:  dato.CntCiudadesComp,
              ClienteTelefono: dato.ClienteTelefono,
              ClienteCelular: dato.ClienteCelular,
              ClienteEmail: dato.ClienteEmail,
              ClienteContacto: dato.ClienteContacto,
              ClienteTelefonoContacto: dato.ClienteTelefonoContacto,
              ClienteEmailContacto: dato.ClienteEmailContacto,
              CntCodigosCiiu:  dato.CntCodigosCiiu,
              CntCiudades:  dato.CntCiudades

            };		 
            dataExcel.push(registro);		 
       });		 
       return dataExcel;		 
    }
   
    toClipboard(separator: string = '\t'): string {
        let result = '';

        result += `${separator}${this.ClienteId}`;
        result += `${separator}${this.ClienteClasificacion}`;
        result += `${separator}${this.ClienteTipoID}`;
        result += `${separator}${this.ClienteNit}`;
        result += `${separator}${this.ClienteEdad}`;
        result += `${separator}${this.CodigoCiiuId}`;
        result += `${separator}${this.ClienteEstado}`;
        result += `${separator}${this.ClienteRazonSocial}`;
        result += `${separator}${this.ClienteDireccion}`;
        result += `${separator}${this.CiudadDepartamentoId}`;
        result += `${separator}${this.Ciudadid}`;
        result += `${separator}${this.ClienteTelefono}`;
        result += `${separator}${this.ClienteCelular}`;
        result += `${separator}${this.ClienteEmail}`;
        result += `${separator}${this.ClienteContacto}`;
        result += `${separator}${this.ClienteTelefonoContacto}`;
        result += `${separator}${this.ClienteEmailContacto}`;

        return result.substring(separator.length);
    }

    fromClipboard(value: string, separator: string = '\t'): CntClientesModel {
        const result = value.split(separator);

        this.ClienteId = parseFloat(result[0]);
        this.ClienteClasificacion = EnumClienteClasificacion[result[1]];
        this.ClienteTipoID = EnumClienteTipoID[result[2]];
        this.ClienteNit = result[3];
        this.ClienteEdad = parseInt(result[4]);
        this.CodigoCiiuId = result[5];
        this.ClienteEstado = EnumClienteEstado[result[6]];
        this.ClienteRazonSocial = result[7];
        this.ClienteDireccion = result[8];
        this.CiudadDepartamentoId = parseInt(result[9]);
        this.Ciudadid = parseInt(result[10]);
        this.ClienteTelefono = result[11];
        this.ClienteCelular = result[12];
        this.ClienteEmail = result[13];
        this.ClienteContacto = result[14];
        this.ClienteTelefonoContacto = result[15];
        this.ClienteEmailContacto = result[16];

        return this;
    }

}
