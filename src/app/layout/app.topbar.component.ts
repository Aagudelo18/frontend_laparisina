import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from 'src/app/demo/components/auth/login/login.services';
import { Router } from '@angular/router'; //Se importa el Router
import { DatosUsuario, Product, ProductoCarrito } from '../../app/demo/components/pages/product-list/product-list.model';
import { map, Observable } from 'rxjs';
import { RolesService } from '../../app/demo/components/pages/roles/roles.service';
import { Roles } from '../../app/demo/components/pages/roles/roles.model';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
  innerWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
    this.innerWidth = window.innerWidth;
  }

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
    anchoOverlayCarrito: string = '60%';
    // private subscription: Subscription;
    // private subscription2: Subscription;
    // private subscription3: Subscription;
    //---------------------------------------------------------------------------------------------------------------------------------
    // Variables para capturar y tener control del usuario
    datosUsuario: DatosUsuario;
    correoUsuario: string;
    tipoCliente: string;
    idRol: string;
    rol: Roles = {}
    token:any;

    constructor(
        public layoutService: LayoutService, 
        private loginService: LoginService, 
        private router: Router,
        private rolesService: RolesService

        ){
            // this.productosCarrito = layoutService.obtenerCarrito();
            // this.calcularPrecioTotalCarrito();
            // this.subscription = this.layoutService.ClearCar.subscribe(event => {
            //   this.productosCarrito = [];
            //   this.cantidad = 0;
            // });

            // this.subscription2 = this.layoutService.DeleteProdutCar.subscribe(event => {
            //   this.eliminarProductoCarrito(event);
            // });
            // this.subscription3 = this.layoutService.AddProdutCart.subscribe(event => {
            //   this.agregarProductoCarrito(event);
            // });

        }


    //función de inicialización del componente
    ngOnInit():void {
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

        // Obtener datos usuario
        this.datosUsuario = this.layoutService.obtenerDatosUsuario();
        this.correoUsuario = this.datosUsuario.correo_electronico;
        this.idRol = this.datosUsuario.rol_usuario;
        this.obtenerRol(this.idRol);

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

    eliminarProductoCarrito(producto: ProductoCarrito){
      this.layoutService.eliminarProductoCarrito(producto)
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para obtener datos cliente
    obtenerDatosClientePorCorreo(correo: string): Observable<any> {
      return this.layoutService.obtenerDatosClientePorCorreo(correo);
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para obtener datos del rol
    obtenerRol(id: string) {
      this.rolesService.getRoles(id).subscribe((data: Roles) => {
        this.rol = data
      });
      this.token = localStorage.getItem('token');

    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para verificar usuario
    verificarUsuario(): boolean {
      return this.datosUsuario && (this.datosUsuario.rol_usuario === undefined || this.rol.nombre_rol === 'Cliente');
    }
    // Función para verificar usuario
    verificarUsuario2(): boolean {
      return this.token !== null && this.token !== undefined && this.token !== '';
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para controlar el tamaño de OverlayCarrito
    anchoOverlay() {
      // Verifica el ancho de la ventana del navegador
      const anchoDialog = window.innerWidth < 960 ? '100%' : 'auto';

      // Establece el ancho del diálogo
      this.anchoOverlayCarrito = anchoDialog;
    }

}
