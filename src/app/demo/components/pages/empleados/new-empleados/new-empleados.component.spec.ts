import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewEmpleadosComponent } from './new-empleados.component';



describe('NewEmpleadosComponent', () => {
  let component: NewEmpleadosComponent;
  let fixture: ComponentFixture<NewEmpleadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewEmpleadosComponent]
    });
    fixture = TestBed.createComponent(NewEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
