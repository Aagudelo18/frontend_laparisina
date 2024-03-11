import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from 'src/app/demo/components/auth/login/login.services';
import { Router } from '@angular/router'; //Se importa el Router
import { DatosUsuario, Product, ProductoCarrito } from '../../app/demo/components/pages/product-list/product-list.model';
import { map, Observable, Subscription } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

  items!: MenuItem[];

  confirmarCerrarSesionDialog = false;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  //---------------------------------------------------------------------------------------------------------------------------------
  //Variables para controlar el carrito
  productosCarrito: ProductoCarrito[] = [];
  cantidad?: number;
  cantidadSeleccionada: number = 1;
  totalCarrito: number = 0;
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  //---------------------------------------------------------------------------------------------------------------------------------
  // Variables para capturar y tener control del usuario
  datosUsuario: DatosUsuario;
  correoUsuario: string;
  tipoCliente: string;


  constructor(
    public layoutService: LayoutService,
    private loginService: LoginService,
    private router: Router,
   


  ) {
    this.productosCarrito = layoutService.obtenerCarrito();
    this.calcularPrecioTotalCarrito();
    this.subscription = this.layoutService.ClearCar.subscribe(event => {
      this.productosCarrito = [];
      this.cantidad = 0;
    });

    this.subscription2 = this.layoutService.DeleteProdutCar.subscribe(event => {
      this.eliminarProductoCarrito(event);
    });
    this.subscription3 = this.layoutService.AddProdutCart.subscribe(event => {
      this.agregarProductoCarrito(event);
    });

  }


  //función de inicialización del componente
  ngOnInit(): void {
    //Obtener lista de productos actualizada
    this.layoutService.products.subscribe(products => {
      this.productosCarrito = products;
    })

    //Obtener carrito del localstorage
    this.layoutService.obtenerCarrito();

    //Obtener precioTotal
    this.layoutService.products.pipe(map(products => {
      return products.reduce((total, producto) => total + producto.precio_total_producto, 0)
    })).subscribe(total => {
      this.totalCarrito = total
    });

    this.datosUsuario = this.layoutService.obtenerDatosUsuario();
    console.log('rrr', this.datosUsuario.rol_usuario)
    this.correoUsuario = this.datosUsuario.correo_electronico;

    this.obtenerDatosClientePorCorreo(this.correoUsuario).subscribe(
      (dataCliente) => {
        this.tipoCliente = dataCliente.tipo_cliente;
      },
      (error) => {
        // Verificar si el error es un error 404
        if (error.status === 404) {
          // No hacer nada en caso de un error 404, simplemente ignorarlo
        } else {
          console.error('Error al obtener datos del cliente:', error);
        }
      }
    );
  }

  reloadComponent() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }

  logout(): void {
    this.confirmarCerrarSesionDialog = true; // Redirige al usuario al componente de login
  }

  noCerrarSesion() {
    this.confirmarCerrarSesionDialog = false;
  }

  hasToken(): boolean {
    return localStorage.getItem('token') !== null;
  }


  cerrarSesion() {
    this.confirmarCerrarSesionDialog = false;
    this.loginService.logout(); // Llamar al servicio para cerrar sesión o ejecutar las acciones correspondientes para cerrar la sesión del usuario
    this.router.navigate(['/auth/login']); // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expirationTime');
  }

  perfil() {
    this.router.navigate(['/pages/perfil']); // Esta ruta debe coincidir con tu ruta '/perfil' definida en las rutas de tu aplicación
  }

  //-------------------------------------------------------------------------------------------------------------------------------

  //FUNCIONES CARRITO Y USUARIO

  //-------------------------------------------------------------------------------------------------------------------------------

  eliminarProductoCarrito(producto: ProductoCarrito) {
    this.layoutService.eliminarProductoCarrito(producto)
    this.layoutService.DeleteProdutCarView.emit(producto)
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para obtener datos cliente
  obtenerDatosClientePorCorreo(correo: string): Observable<any> {
    return this.layoutService.obtenerDatosClientePorCorreo(correo);
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función calcular precio total del carrito
  calcularPrecioTotalCarrito(): void {
    this.totalCarrito = this.productosCarrito.reduce((total, producto) => {
      return total + (producto.precio_total_producto || 0);  // Asegúrate de manejar el caso de que precio_total_producto sea undefined
    }, 0);
  }

  agregarProductoCarrito(nuevoProducto: any) {

    console.log(nuevoProducto)

    // Verificar si ya existe un producto con el mismo nombre_producto
    const productoExistente = this.productosCarrito.find(p => p.nombre_producto === nuevoProducto.nombre_producto);

    if (!productoExistente) {
      // Si no existe, agregar el nuevo producto al carrito
      this.productosCarrito.push(nuevoProducto);

      this.totalCarrito += nuevoProducto.precio_total_producto;

    } else {
      this.totalCarrito -= productoExistente.precio_total_producto;
      productoExistente.precio_total_producto = nuevoProducto.precio_total_producto;
      this.totalCarrito += productoExistente.precio_total_producto;

    }

  }

  @ViewChild('op2') overlayPanel: OverlayPanel;

  hacerPedido() {
    // Lógica para hacer el pedido

    // Redirigir a la ruta '/pedidoCliente'
    this.router.navigate(['/pedidoCliente']).then(() => {
        // Cerrar el modal después de redirigir
        this.overlayPanel.hide(); // Oculta el overlayPanel
    });
}

}
