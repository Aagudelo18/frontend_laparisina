import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaP } from './categoriaP.model';

@Injectable()
  export class CategoriaPService {
    private apiUrl = 'https://api-parisina-2tpy.onrender.com/api'; // URL de tu API
  
    constructor(private http: HttpClient) {}

    getListCategoriasP(): Observable<CategoriaP[]>{
      return this.http.get<CategoriaP[]>(`${this.apiUrl}/categorias`)    
    }

    getCategoriaP(id:string): Observable<CategoriaP>{
      return this.http.get<CategoriaP>(`${this.apiUrl}/categorias/${id}`)
    }
  
    postCategoriaP(categoriaP : CategoriaP):Observable<void>{
      return this.http.post<void>(`${this.apiUrl}/categorias`,categoriaP)
    }
  
    putCategoriaP(id:string, categoriaP:CategoriaP):Observable<void>{
      return this.http.put<void>(`${this.apiUrl}/categorias/${id}`,categoriaP)
    }
  
    putEstadoCategoriaP(id:string, categoriaP:CategoriaP): Observable<void>{
      return this.http.put<void>(`${this.apiUrl}/categoria-estado/${id}`,categoriaP)
    }
  }
  