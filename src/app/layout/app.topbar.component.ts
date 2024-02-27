import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from 'src/app/demo/components/auth/login/login.services';
import { Router } from '@angular/router'; //Se importa el Router
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
    productosCarrito: any[] = [];
    cantidad?: number;
    cantidadSeleccionada: number = 1;
    totalCarrito: number = 0;

    constructor(
        public layoutService: LayoutService, 
        private loginService: LoginService, 
        private router: Router,

        ){
            this.productosCarrito = layoutService.obtenerCarrito();
            this.calcularPrecioTotalCarrito();
        }

    //función de inicialización del componente
    ngOnInit():void {        
        this.layoutService.obtenerCarrito();            
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
    //función eliminar un producto del carrito
    eliminarProductoCarrito(producto: any) {
        // Encuentra el índice del producto en el array
        const index = this.productosCarrito.findIndex(p => p.nombre_producto === producto.nombre_producto);
      
        if (index !== -1) {
          // Resta el precio_total_producto del producto eliminado al totalCarrito
          this.totalCarrito -= this.productosCarrito[index].precio_total_producto;
      
          // Elimina el producto del array
          this.productosCarrito.splice(index, 1);
  
          this.layoutService.guardarCarrito(this.productosCarrito);
      
          console.log('Producto eliminado:', producto);
          console.log('Productos en el carrito:', this.productosCarrito);
        } else {
          console.log('El producto no se encontró en el carrito');
        }
      }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función calcular precio total del carrito
    calcularPrecioTotalCarrito(): void {
        this.totalCarrito = this.productosCarrito.reduce((total, producto) => {
          return total + (producto.precio_total_producto || 0);  // Asegúrate de manejar el caso de que precio_total_producto sea undefined
        }, 0);
      }

}
