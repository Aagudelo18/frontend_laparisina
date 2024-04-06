import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap  , catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewEmpleadosService {

  private apiUrl = 'https://api-parisina-2tpy.onrender.com/api/';
  private apiUrl1 = 'https://api-parisina-2tpy.onrender.com/api/obtenerEmpleadoPorIdentificacion/';

  constructor(private http: HttpClient) { }

  public createEmpleado(empleados: any): Observable<any>{
    // Obtener el token y el rol del local storage
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    // Crear el encabezado con el token y el rol
    const headers = {
      'token': token || '',
      'rol': rol || ''
    };
    
    return this.http.post(this.apiUrl + 'empleados', empleados, {headers})
  
  
  }
  
  obtenerEmpleadoPorIdentificacion(identificacion: string): Observable<any> {
    const url = `${this.apiUrl1}${identificacion}`;
    
    console.log('URL:', url);
  
    return this.http.get(url).pipe(
      tap(data => console.log('Data from server:', data)),
      catchError(error => {
        console.error('Error fetching employee data:', error);
        throw error;
      })
    );
  }
 
}

