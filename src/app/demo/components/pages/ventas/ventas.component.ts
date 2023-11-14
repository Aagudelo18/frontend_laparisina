import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VentaService } from './ventas.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  templateUrl: './ventas.component.html',
  providers: [VentaService]
})
export class VentasComponent implements OnInit {
  ventas: any[] = [];
  selectedVentas: any[] = [];
  ventaDialog: boolean = false;
  codigo_clienteBusqueda: string = '';
  nombre_clienteBusqueda: string = '';
  quien_recibeBusqueda: string = '';
  fecha_entrega_pedido: string = "";

  constructor(
    private ventaService: VentaService
  ) {
  }

  ngOnInit() {
    this.ventaService.getVentas().subscribe((data: any) => {
      if (data && data.ventas) {
        this.ventas = data.ventas;
        console.log(this.ventas);
      }
    });
  }

  openNewVentaDialog() {
    this.ventaDialog = true;
  }

  //Metodo para buscar por medio del correo electrónico
  onBuscar() {
    // Obtener la lista completa de ventas desde donde se esté almacenando
    const ventasCompletas = this.ventas;

    // Realizar la búsqueda por correo electrónico
    this.ventas = ventasCompletas.filter(venta =>
      venta.codigo_cliente.toLowerCase().includes(this.codigo_clienteBusqueda.toLowerCase())
    );
  }

}
