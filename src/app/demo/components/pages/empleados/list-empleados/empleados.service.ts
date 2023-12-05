import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from './empleados.model';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  
  private apiUrl = 'http://localhost:3000/api/';
  private apUrl = 'http://localhost:3000/api/empleados';

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

  getEmpleadosPendientes(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}empleados/pendientes`);
  }

  getEmpleadosTerminados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}empleados/terminados`);
  }
  
  getEmpleados(id:string): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.apiUrl}empleados/${id}`)


  }
}
