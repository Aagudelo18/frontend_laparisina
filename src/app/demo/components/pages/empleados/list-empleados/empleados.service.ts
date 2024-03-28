import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from './empleados.model';
import { Observable } from 'rxjs';
import { tap  , catchError} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/';
  private apUrl = 'https://api-parisina-2tpy.onrender.com/api/empleados';

  constructor(private http: HttpClient) { }

  autualizarEmpleado(id:string, empleado:Empleado):Observable<void>{
    return this.http.put<void>(`${this.apiUrl}empleados/${id}`, empleado);
  }

  getEmpleado() {
    return this.http.get<Empleado[]>(this.apiUrl + 'empleados');
  }

  getEmpleadoDetalle(id: string): Observable<any> {
    return this.http.get<Empleado[]>(this.apiUrl + `empleados/${id}` );
  }

  updateEmpleado(id: string, empleado: Empleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}empleados/${id}`, empleado);

  }
  getEmpleadoPorCedula(cedula: string): Observable<Empleado> {
    const url = `${this.apiUrl}/buscarPorCedula/${cedula}`; // Ajusta la URL según tu implementación del servicio
    return this.http.get<Empleado>(url);
  }
  actualizarEstadoEmpleado(id:string): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/empleados_estado/${id}`,{})
    }
  
  getEmpleados(id:string): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.apiUrl}empleados/${id}`)


  }
  
  obtenerEmpleadoPorIdentificacion(identificacion_empleado: string): Observable<any> {
    const url = `${this.apiUrl}obtenerDatosEmpleado/${identificacion_empleado}`;
    
    console.log('URL:', url); // Agrega este log para verificar la URL
    
    return this.http.get(url).pipe(
      tap(data => console.log('Data from server:', data)), // Agrega este log para verificar la respuesta del servidor
      catchError(error => {
        console.error('Error fetching employee data:', error);
        throw error; // Puedes manejar el error según tus necesidades
      })
    );
  }
}


