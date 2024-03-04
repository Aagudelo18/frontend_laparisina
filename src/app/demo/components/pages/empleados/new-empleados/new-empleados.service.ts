import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap  , catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewEmpleadosService {

  private apiUrl = 'http://localhost:3000/api/';
  private apiUrl1 = 'http://localhost:3000/api/obtenerEmpleadoPorIdentificacion/';

  constructor(private http: HttpClient) { }

  public createEmpleado(empleados: any): Observable<any>{
    
    return this.http.post(this.apiUrl + 'empleados', empleados)
  
  
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

