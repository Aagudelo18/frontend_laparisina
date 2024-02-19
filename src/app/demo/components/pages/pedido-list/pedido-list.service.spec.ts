import { TestBed } from '@angular/core/testing';

import { PedidoListService } from './pedido-list.service';

describe('PedidoListService', () => {
  let service: PedidoListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
