import { TestBed } from '@angular/core/testing';
import { NewEmpleadosService } from './new-empleados.service';

describe('NewEmpleadosService', () => {
  let service: NewEmpleadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewEmpleadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});