import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoClienteComponent } from './pedido-cliente.component';

describe('PedidoClienteComponent', () => {
  let component: PedidoClienteComponent;
  let fixture: ComponentFixture<PedidoClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidoClienteComponent]
    });
    fixture = TestBed.createComponent(PedidoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
