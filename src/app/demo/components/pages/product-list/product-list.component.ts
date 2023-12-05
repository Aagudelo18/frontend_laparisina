import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './product-list.model';
import { MessageService } from 'primeng/api';
import { ProductService } from './product-list.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria/categoria.service';
import { CartService } from '../cart/cart.service';

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

    visibleSidebarCarrito: boolean = false;
    
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
      private cartService: CartService,
      ){

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
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
    //función para qgregar un producto al carrito
    onClick(product: Product) {
      console.log(product)
      this.cartService.addNewProduct(product)
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y ver detalles de un producto
    detalleProducto(product: Product) {
      this.producto = product;
      this.detalleProductoDialog = true;

      const rutaImagenes = 'http://localhost:3000/uploads/';
        this.imagenes = product.imagenes_producto.map(imagen => rutaImagenes + imagen);
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de crear producto
    cerrarDialog() {
      this.detalleProductoDialog = false;
    }

    visibleCarritoSidebar() {
      this.visibleSidebarCarrito = true;
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onFilter(dv: any, event: Event) {
      dv.filter((event.target as HTMLInputElement).value);
    }
    
}
