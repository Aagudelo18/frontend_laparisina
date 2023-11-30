import { TestBed } from '@angular/core/testing';
import { VentasService } from './ventas.service';

describe('PedidosService', () => {
  let service: VentasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
