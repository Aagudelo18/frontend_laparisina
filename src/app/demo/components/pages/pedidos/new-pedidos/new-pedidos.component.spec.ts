import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPedidosComponent } from './new-pedidos.component';

describe('NewPedidosComponent', () => {
  let component: NewPedidosComponent;
  let fixture: ComponentFixture<NewPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPedidosComponent]
    });
    fixture = TestBed.createComponent(NewPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
