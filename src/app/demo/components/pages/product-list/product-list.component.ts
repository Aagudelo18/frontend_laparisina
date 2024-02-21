import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, ProductoCarrito } from './product-list.model';
import { MessageService } from 'primeng/api';
import { ProductService } from './product-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria/categoria.service';



@Component({
    templateUrl: './product-list.component.html',
    providers: [MessageService, CategoriaService]
})
export class ProductComponent implements OnInit {

  //---------------------------------------------------------------------------------------------------------------------------------
    listProductos: Product[] = [];
    listCategorias: any[] = [];
    nombresCategorias: string [] = []
    producto: Product = {};
    formProduct:FormGroup;
    id: string = '';
    categoriaSeleccionada: string = 'Todas las categorías';

    //---------------------------------------------------------------------------------------------------------------------------------
    //Variables para controlar el carrito
    productosCarrito: ProductoCarrito[] = [];
    cantidad?: number;
    cantidadSeleccionada: number = 1;
    totalCarrito: number = 0;
    
    //---------------------------------------------------------------------------------------------------------------------------------
    // Variables para capturar y tener control de la imagen
    imagenes: string[] = [];
    displayDialog: boolean = false;
    imagenDialogSrc: string = '';
    imagenes_seleccionadas_producto: string[] = [];

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


    //---------------------------------------------------------------------------------------------------------------------------------
    //Variables para controlar dialogs
    detalleProductoDialog: boolean = false;

    

    constructor(
      private fb:FormBuilder,
      private productService: ProductService,
      private messageService: MessageService,
      private aRouter:ActivatedRoute,
      private categoriaService: CategoriaService,
     
      ){

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });

        this.productosCarrito = productService.obtenerCarrito();
        this.calcularPrecioTotalCarrito();
      }

    //---------------------------------------------------------------------------------------------------------------------------------
    //función de inicialización del componente
    ngOnInit():void {        
        this.getListProductos();
        this.getListCategorias();
        this.getNombresCategorias();             
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todos los productos
    getListProductos(){     
        this.productService.getListProducts().subscribe((data) =>{      
          this.listProductos = data.
          filter(producto => producto.estado_producto === true)
        .map(producto => producto);
        })        
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todos los productos
    getListCategorias() {
      this.categoriaService.getListCategorias().subscribe((data) => {
        this.listCategorias = data
          .filter(categoria => categoria.estado_categoria_producto === true)
          .map(categoria => ({
            ...categoria,
            imagen_categoria_producto: `http://localhost:3000/uploads/${categoria.imagen_categoria_producto}`
          }));
      });
    }
    

    getNombresCategorias(){     
      this.categoriaService.getListCategorias().subscribe((data) =>{      
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

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para obtener los datos de una categoría por id
    getProducto(id:string){      
      this.productService.getProduct(id).subscribe((data:Product) => {
       
        this.formProduct.setValue({
          codigo_producto: data.codigo_producto,
          nombre_producto: data.nombre_producto,
          nombre_categoria_producto: data.nombre_categoria_producto,
          descripcion_producto: data.descripcion_producto,
          precio_ico: data.precio_ico,
          precio_por_mayor_ico: data.precio_por_mayor_ico,
          durabilidad_producto: data.durabilidad_producto,
          imagenes_producto: data.imagenes_producto,
        })
        const rutaImagenes = 'http://localhost:3000/uploads/';
        this.imagenes = data.imagenes_producto.map(imagen => rutaImagenes + imagen);

      })
    }

   

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y ver detalles de un producto
    detalleProducto(product: Product) {
      this.producto = product;
      this.detalleProductoDialog = true;
      this.cantidadSeleccionada = 1;

      const rutaImagenes = 'http://localhost:3000/uploads/';
        this.imagenes = product.imagenes_producto.map(imagen => rutaImagenes + imagen);
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de crear producto
    cerrarDialog() {
      this.detalleProductoDialog = false;
    }



    //-------------------------------------------------------------------------------------------------------------------------------
    //FUNCIONES CARRITO

    //-------------------------------------------------------------------------------------------------------------------------------
    //función agrear un producto al carrito
    agregarProductoCarrito(nuevoProducto: ProductoCarrito, cantidaProducto: number) {
      const precioTotalProducto = nuevoProducto.precio_ico * cantidaProducto
      
      // Crear un nuevo objeto ProductoCarrito con la información necesaria
      const nuevoProductoCarrito: ProductoCarrito = {
        nombre_producto: nuevoProducto.nombre_producto,
        cantidad_producto: cantidaProducto,
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

        this.totalCarrito += nuevoProductoCarrito.precio_total_producto;

        this.productService.guardarCarrito(this.productosCarrito);
        
        console.log(this.productosCarrito);
      } else {
        this.totalCarrito -= productoExistente.precio_total_producto;

        productoExistente.cantidad_producto = cantidaProducto;
        productoExistente.precio_total_producto = precioTotalProducto;
        
        this.totalCarrito += productoExistente.precio_total_producto;

        this.productService.guardarCarrito(this.productosCarrito);

        console.log('El producto ya está en el carrito');
      }
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función eliminar un producto del carrito
    eliminarProductoCarrito(producto: ProductoCarrito) {
      // Encuentra el índice del producto en el array
      const index = this.productosCarrito.findIndex(p => p.nombre_producto === producto.nombre_producto);
    
      if (index !== -1) {
        // Resta el precio_total_producto del producto eliminado al totalCarrito
        this.totalCarrito -= this.productosCarrito[index].precio_total_producto;
    
        // Elimina el producto del array
        this.productosCarrito.splice(index, 1);

        this.productService.guardarCarrito(this.productosCarrito);
    
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
    
   
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onFilter(dv: any, event: Event) {
      dv.filter((event.target as HTMLInputElement).value);
    }
    // Nuevas funciones para el carrito


}
