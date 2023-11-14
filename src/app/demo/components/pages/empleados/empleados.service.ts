import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from './empleado.model';
import { EmpleadosComponent } from './empleados.component';
import { FormControl, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class empleadosService {
  form: any;
  open(EmpleadosComponent: EmpleadosComponent, arg1: { data: { employeeToEdit: any; }; header: string; width: string; }) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api';
  private apUrl =  'https://api-parisina-2tpy.onrender.com/api/empleados'; // Reemplaza con la URL real de tu API

  constructor(private http: HttpClient) {
    // this.crearEmpleado();

    // this.form = this.fb.group({
    //   nombreRol: new FormControl('', Validators.required),
    //   PermisosRol: ['', Validators.required],
    //   estadorol: new FormControl('', Validators.required),
    // });


  }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }
  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apUrl}/`, empleado);

  }
  actualizarEmpleado(empleado: any): Observable<any> {
    // Realiza una solicitud PUT para actualizar el empleado
    return this.http.put(`${this.apiUrl}/${empleado.id}`, empleado);
  }
}
