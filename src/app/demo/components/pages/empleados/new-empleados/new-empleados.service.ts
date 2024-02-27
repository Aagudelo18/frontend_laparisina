import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewEmpleadosService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  public createEmpleado(empleados: any): Observable<any>{
    
    return this.http.post(this.apiUrl + 'empleados', empleados)
  
  
  }
  
  


  
 
 
  
}
