import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agregarCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }
  
  // Agrega el método para obtener un cliente por su ID
  getClientePorId(clienteId: string): Observable<any> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.get<any>(url);
  }

  actualizarCliente(cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${cliente._id}`, cliente);
  }

  eliminarCliente(clienteId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${clienteId}`);
  }
}
