import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class PedidoListService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }
}
