import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosUsuario, Product, ProductoCarrito } from './product-list.model';
import { MessageService } from 'primeng/api';
import { ProductService } from './product-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria/categoria.service';
import { LayoutService } from "../../../../layout/service/app.layout.service";
import { Location } from '@angular/common';
import { Observable } from 'rxjs';





@Component({
  templateUrl: './product-list.component.html',
  providers: [MessageService, CategoriaService]
})
export class ProductComponent implements OnInit {

  //---------------------------------------------------------------------------------------------------------------------------------
  listProductos: Product[] = [];
  listCategorias: any[] = [];
  nombresCategorias: string[] = []
  producto: Product = {};
  formProduct: FormGroup;
  id: string = '';
  categoriaSeleccionada: string = 'Todas las categorías';
  menuDelDia: Product[] = [];

  //---------------------------------------------------------------------------------------------------------------------------------
  //Variables para controlar el carrito
  productosCarrito: ProductoCarrito[] = [];
  cantidad?: number;
  cantidadSeleccionada: number = 1;
  totalCarrito: number = 0;
  limiteProducto: boolean = false;

  //---------------------------------------------------------------------------------------------------------------------------------
  // Variables para capturar y tener control de la imagen
  imagenes: string[] = [];
  displayDialog: boolean = false;
  imagenDialogSrc: string = '';
  imagenes_seleccionadas_producto: string[] = [];

  //---------------------------------------------------------------------------------------------------------------------------------
  // Variables para capturar y tener control del usuario
  datosUsuario: DatosUsuario;
  correoUsuario: string;
  tipoCliente: string;

  //Configuración carrusel de imagenes
  galleriaResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '960px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  carouselResponsiveOptionsProducto: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];


  //---------------------------------------------------------------------------------------------------------------------------------
  //Variables para controlar dialogs
  detalleProductoDialog: boolean = false;
  detalleMenuDelDiaDialog: boolean = false;
  anchoDialogDetalleProducto: string = '65%';




  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private aRouter: ActivatedRoute,
    private categoriaService: CategoriaService,
    public layoutService: LayoutService,
    private location: Location

  ) {

    this.aRouter.params.subscribe(params => {
      this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
    });

    this.productosCarrito = productService.obtenerCarrito();
    this.calcularPrecioTotalCarrito();
  }

  //---------------------------------------------------------------------------------------------------------------------------------
  //función de inicialización del componente
  ngOnInit(): void {
    this.getListProductos();
    this.getListCategorias();
    this.getNombresCategorias();

    this.datosUsuario = this.productService.obtenerDatosUsuario();
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

    this.inicioMenuDelDia();
  }

  

  //---------------------------------------------------------------------------------------------------------------------------------
  //Función para listar todos los productos
  getListProductos() {
    this.productService.getListProducts().subscribe((data) => {
      this.listProductos = data.
        filter(producto => producto.estado_producto === true)
        .map(producto => producto);
    })
  }

  //---------------------------------------------------------------------------------------------------------------------------------
  //Función para listar todos los productos
  getListCategorias() {
    this.categoriaService.getListCategorias_Cliente().subscribe((data) => {
      this.listCategorias = data
        .filter(categoria => categoria.estado_categoria_producto === true)
        .map(categoria => ({
          ...categoria,
          imagen_categoria_producto: `http://localhost:3000/uploads/${categoria.imagen_categoria_producto}`
        }));
    });
  }


  getNombresCategorias() {
    this.categoriaService.getListCategorias_Cliente().subscribe((data) => {
      const categoriasOriginales = data.
        filter(categoria => categoria.estado_categoria_producto === true)
        .map(categoria => categoria.nombre_categoria_producto);

      // Antes de asignar el arreglo a la propiedad categorias
      this.nombresCategorias = ['Todas las categorías', ...categoriasOriginales];
    })
  }

  onCategoriaChange(event) {
    this.categoriaSeleccionada = event.value;
    this.actualizarListaProductos();
  }

  actualizarListaProductos() {
    if (this.categoriaSeleccionada === 'Todas las categorías') {
      this.getListProductos();
    } else {
      this.listarProductosPorCategoria(this.categoriaSeleccionada);
    }
  }

  listarProductosPorCategoria(categoria: string) {
    this.productService.getProductosPorCategoria(categoria).subscribe((data) => {
      this.listProductos = data.filter(producto => producto.estado_producto === true);
    });
  }


  //-------------------------------------------------------------------------------------------------------------------------------
  //función para abrir un dialog y ver detalles de un producto
  detalleProducto(product: Product) {
    // Verifica el ancho de la ventana del navegador
    const anchoDialog = window.innerWidth < 1200 ? '90%' : '65%';

    // Establece el ancho del diálogo
    this.anchoDialogDetalleProducto = anchoDialog;

    this.producto = product;
    this.detalleProductoDialog = true;
    this.cantidadSeleccionada = 1;

    const rutaImagenes = 'http://localhost:3000/uploads/';
    this.imagenes = product.imagenes_producto.map(imagen => rutaImagenes + imagen);
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para cerrar un dialog y limpiar el fileUpload de crear producto
  cerrarDetalleDialog() {
    this.detalleProductoDialog = false;
    this.limiteProducto = false;
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para cerrar un dialog y limpiar el fileUpload de crear producto
  inicioMenuDelDia() {
    this.productService.getListProducts().subscribe((data) => {
      this.menuDelDia = data.filter(producto => producto.nombre_producto === 'Menú del día' && producto.estado_producto === true);
      
      this.producto = this.menuDelDia.length > 0 ? this.menuDelDia[0] : null;
      if (this.producto) {
        this.detalleMenuDelDia(this.producto);
      }
    });

    
  }

  detalleMenuDelDia(product: Product) {
    // Verifica el ancho de la ventana del navegador
    const anchoDialog = window.innerWidth < 960 ? '90%' : '65%';

    // Establece el ancho del diálogo
    this.anchoDialogDetalleProducto = anchoDialog;

    this.producto = product;
    this.detalleMenuDelDiaDialog = true;
    this.cantidadSeleccionada = 1;

    const rutaImagenes = 'http://localhost:3000/uploads/';
    this.imagenes = product.imagenes_producto.map(imagen => rutaImagenes + imagen);
  }
  



  //-------------------------------------------------------------------------------------------------------------------------------

  //FUNCIONES CARRITO

  //-------------------------------------------------------------------------------------------------------------------------------
  //función agrear un producto al carrito
  // agregarProductoCarrito(nuevoProducto: ProductoCarrito, cantidadProducto: number) {
  //   // const precioTotalProducto = nuevoProducto.precio_ico * cantidadProducto
  //   const precioTotalProducto: number = this.tipoCliente === 'Persona jurídica'
  // ? nuevoProducto.precio_por_mayor_ico * cantidadProducto
  // : nuevoProducto.precio_ico * cantidadProducto;

  //   // Crear un nuevo objeto ProductoCarrito con la información necesaria
  //   const nuevoProductoCarrito: ProductoCarrito = {
  //     nombre_producto: nuevoProducto.nombre_producto,
  //     cantidad_producto: cantidadProducto,
  //     estado_producto: "",
  //     precio_ico: nuevoProducto.precio_ico,
  //     precio_por_mayor_ico: nuevoProducto.precio_por_mayor_ico,
  //     precio_total_producto: precioTotalProducto,
  //   };

  //   // Verificar si ya existe un producto con el mismo nombre_producto
  //   const productoExistente = this.productosCarrito.find(p => p.nombre_producto === nuevoProductoCarrito.nombre_producto);

  //   if (!productoExistente) {
  //     // Si no existe, agregar el nuevo producto al carrito
  //     this.productosCarrito.push(nuevoProductoCarrito);

  //     this.totalCarrito += nuevoProductoCarrito.precio_total_producto;

  //     this.layoutService.guardarCarrito(this.productosCarrito);

  //     console.log(this.productosCarrito);
  //   } else {
  //     this.totalCarrito -= productoExistente.precio_total_producto;

  //     productoExistente.cantidad_producto = cantidadProducto;
  //     productoExistente.precio_total_producto = precioTotalProducto;

  //     this.totalCarrito += productoExistente.precio_total_producto;

  //     this.layoutService.guardarCarrito(this.productosCarrito);

  //     console.log('El producto ya está en el carrito');
  //   }
  //   window.location.reload();
  // }
  agregarProductoCarrito(nuevoProducto: ProductoCarrito, cantidadProducto: number){
    this.layoutService.agregarProductoCarrito(nuevoProducto, cantidadProducto);
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función eliminar un producto del carrito
  // eliminarProductoCarrito(producto: ProductoCarrito) {
  //   // Encuentra el índice del producto en el array
  //   const index = this.productosCarrito.findIndex(p => p.nombre_producto === producto.nombre_producto);

  //   if (index !== -1) {
  //     // Resta el precio_total_producto del producto eliminado al totalCarrito
  //     this.totalCarrito -= this.productosCarrito[index].precio_total_producto;

  //     // Elimina el producto del array
  //     this.productosCarrito.splice(index, 1);

  //     this.productService.guardarCarrito(this.productosCarrito);

  //     console.log('Producto eliminado:', producto);
  //     console.log('Productos en el carrito:', this.productosCarrito);
  //   } else {
  //     console.log('El producto no se encontró en el carrito');
  //   }
  // }

  verificarLimite(nuevoValor: number): void {
    this.limiteProducto = nuevoValor >= 50;
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función calcular precio total del carrito
  calcularPrecioTotalCarrito(): void {
    this.totalCarrito = this.productosCarrito.reduce((total, producto) => {
      return total + (producto.precio_total_producto || 0);  // Asegúrate de manejar el caso de que precio_total_producto sea undefined
    }, 0);
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para obtener datos cliente
  obtenerDatosClientePorCorreo(correo: string): Observable<any> {
    return this.productService.obtenerDatosClientePorCorreo(correo);
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para configurar donde se define resolución lg
  configuracionResolucionLg(): boolean {
    // Define la resolución a partir de la cual aplicar la clase 'lg'
    const resolucionLg = 1200;

    // Verifica si 'window' está definido y la resolución actual
    return window && window.innerWidth >= resolucionLg;
  }

  //-------------------------------------------------------------------------------------------------------------------------------
  //función para filtar la tabla en el buscador
  onFilter(dv: any, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }
}
