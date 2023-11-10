import { TestBed } from '@angular/core/testing';
import { NewPedidosService } from './new-pedidos.service';

describe('NewPedidosService', () => {
  let service: NewPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
