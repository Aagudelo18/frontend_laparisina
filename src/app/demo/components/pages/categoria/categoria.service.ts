import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from './categoria.model'; // Define tu modelo de categoría aquí

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://api-parisina-2tpy.onrender.com/api'; // URL de tu API

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  crearCategoria(categoria: Categoria): Observable<any> {
    const formData = new FormData();
    formData.append('nombre_categoria_producto', categoria.nombre_categoria_producto);
    formData.append('descripcion_categoria_producto', categoria.descripcion_categoria_producto);
    formData.append('imagen_categoria_producto', categoria.imagen_categoria_producto);

    return this.http.post<any>(`${this.apiUrl}/categorias`, formData);
  }
}

