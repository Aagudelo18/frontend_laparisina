import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LoginService } from 'src/app/demo/components/auth/login/login.services';
import { Router } from '@angular/router'; //Se importa el Router
import { Subscription } from 'rxjs';
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
    private subscription: Subscription;
    private subscription2: Subscription;
    private subscription3: Subscription;

    constructor(
        public layoutService: LayoutService, 
        private loginService: LoginService, 
        private router: Router,
       

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
          localStorage.removeItem('carritoProductosParisina');
          localStorage.setItem('carritoProductosParisina', JSON.stringify(this.productosCarrito))
  
          //this.layoutService.guardarCarrito(this.productosCarrito);
      
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

}
