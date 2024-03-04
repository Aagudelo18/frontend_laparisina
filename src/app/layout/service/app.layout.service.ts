import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatosUsuario, Product, ProductoCarrito } from '../../demo/components/pages/product-list/product-list.model';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    

    config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        }
        else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar() {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config.menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this.configUpdate.next(this.config);
    }


    //-------------------------------------------------------------------------------------------------------------------------------

    //SERVICIOS Y FUNCIONES CARRITO

    //-------------------------------------------------------------------------------------------------------------------------------
    private claveCarritoProductos = 'carritoProductosParisina';
    private claveDatosUsuario = 'currentUser'
    private productosCarrito: ProductoCarrito[] = [];

    private apiUrl = 'http://localhost:3000/api';

    //---------------------------------------------------------------------------------------------------------------------------------
    // Variables para capturar y tener control del usuario
    private datosUsuario: DatosUsuario;
    private correoUsuario: string;
    private tipoCliente: string;

    private _products : BehaviorSubject<ProductoCarrito[]>;

    constructor(
        private http: HttpClient
    ){
        this._products = new BehaviorSubject<ProductoCarrito[]>([]);
        this.inicializarCarrito();
    }

    get products() {
        return this._products.asObservable();
    }

    private inicializarCarrito() {
        // Obtener el carrito desde localStorage al inicio
        const carritoGuardado = this.obtenerCarrito();
        
        // Si hay elementos en el carrito guardado, inicializar productosCarrito y totalCarrito
        if (carritoGuardado.length > 0) {
          this.productosCarrito = carritoGuardado;
        }
    
        // Actualizar el BehaviorSubject con el carrito inicial
        this._products.next(this.productosCarrito);

        this.obtenerYActualizarDatosUsuario();
      }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función agrear un producto al carrito
    agregarProductoCarrito(nuevoProducto: ProductoCarrito, cantidadProducto: number) {
        // const precioTotalProducto = nuevoProducto.precio_ico * cantidadProducto
        const precioTotalProducto: number = this.tipoCliente === 'Persona jurídica'
    ? nuevoProducto.precio_por_mayor_ico * cantidadProducto
    : nuevoProducto.precio_ico * cantidadProducto;

        // Crear un nuevo objeto ProductoCarrito con la información necesaria
        const nuevoProductoCarrito: ProductoCarrito = {
        nombre_producto: nuevoProducto.nombre_producto,
        cantidad_producto: cantidadProducto,
        estado_producto: "",
        precio_ico: nuevoProducto.precio_ico,
        precio_por_mayor_ico: nuevoProducto.precio_por_mayor_ico,
        precio_total_producto: precioTotalProducto,
        };

        // Verificar si ya existe un producto con el mismo nombre_producto
        const productoExistente = this.productosCarrito.find(p => p.nombre_producto === nuevoProductoCarrito.nombre_producto);

        if (!productoExistente) {
        // Si no existe, agregar el nuevo producto al carrito
        this.productosCarrito.push(nuevoProductoCarrito);

        this.guardarCarrito(this.productosCarrito);
        } else {

        productoExistente.cantidad_producto = cantidadProducto;
        productoExistente.precio_total_producto = precioTotalProducto;

        this.guardarCarrito(this.productosCarrito);

        console.log('El producto ya está en el carrito');
        }
        // window.location.reload();
        this._products.next(this.productosCarrito)
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función eliminar un producto del carrito
    eliminarProductoCarrito(producto: ProductoCarrito) {
        // Encuentra el índice del producto en el array
        const index = this.productosCarrito.findIndex(p => p.nombre_producto === producto.nombre_producto);
      
        if (index !== -1) {
      
          // Elimina el producto del array
          this.productosCarrito.splice(index, 1);
  
          this.guardarCarrito(this.productosCarrito);
      
        } else {
          console.log('El producto no se encontró en el carrito');
        }
        this._products.next(this.productosCarrito)
      }

    //-------------------------------------------------------------------------------------------------------------------------------

    //SERVICIOS Y FUNCIONES LOCALSTORAGE

    //-------------------------------------------------------------------------------------------------------------------------------
    //Servicios carrito localStorage
    guardarCarrito(carrito: any[]): void {
        localStorage.setItem(this.claveCarritoProductos, JSON.stringify(carrito));
    }
    
    obtenerCarrito(): any[] {
        const carrito = localStorage.getItem(this.claveCarritoProductos);
        return carrito ? JSON.parse(carrito) : [];
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //Servicios cliente login
    obtenerDatosUsuario(): DatosUsuario {
        const cliente = localStorage.getItem(this.claveDatosUsuario);
        return cliente ? JSON.parse(cliente) : {} as DatosUsuario;
    }
  
    obtenerDatosClientePorCorreo(correo:string): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/clientes/correo/${correo}`)
    }

    private obtenerYActualizarDatosUsuario() {
        this.datosUsuario = this.obtenerDatosUsuario();
        this.correoUsuario = this.datosUsuario.correo_electronico;
    
        this.obtenerDatosClientePorCorreo(this.correoUsuario).subscribe(
          (dataCliente) => {
            this.tipoCliente = dataCliente.tipo_cliente;
          },
          (error) => {
            if (error.status === 404) {
              // No hacer nada en caso de un error 404
            } else {
              console.error('Error al obtener datos del cliente:', error);
            }
          }
        );
    }

}
