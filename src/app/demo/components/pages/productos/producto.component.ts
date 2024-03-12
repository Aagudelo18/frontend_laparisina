import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from './producto.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductoService } from './producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { CategoriaService } from '../categoria/categoria.service';


@Component({
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.scss'],
    providers: [MessageService, CategoriaService]
})

export class ProductoComponent implements OnInit {
  @ViewChild('fileCrear') fileCrear: FileUpload;
  @ViewChild('fileEditar') fileEditar: FileUpload;

  //---------------------------------------------------------------------------------------------------------------------------------
    listProductos: Producto[] = [];
    categorias: string [] = [];
    producto: Producto = {};
    formProducto:FormGroup;
    formEditarProducto: FormGroup;
    id: string = '';
    
    //---------------------------------------------------------------------------------------------------------------------------------
    // Variables para capturar y tener control de la imagen
    files: File[] = [];
    fileSelected: boolean = false;
    imagenes: string[] = [];
    displayDialog: boolean = false;
    imagenes_seleccionadas_producto: string[] = [];
    activeIndex: number = 0;  // Variable para rastrear el índice activo

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

    //---------------------------------------------------------------------------------------------------------------------------------
    //Variables para controlar dialogs
    crearProductoDialog: boolean = false;
    editarProductoDialog: boolean = false;
    detalleProductoDialog: boolean = false;
    estadoProductoDialog: boolean = false;
    anchoDialogCrearProducto: string = '70%';
    anchoDialogEditarProducto: string = '70%';
    anchoDialogDetalleProducto: string = '70%';


    constructor(
      private fb:FormBuilder,
      private productoService: ProductoService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute,
      private categoriaService: CategoriaService,
      ){

        this.formProducto = this.fb.group({
          codigo_producto: ['',[Validators.required, Validators.pattern(/^[0-9]{3,4}$/),]],
          nombre_producto: ['',[Validators.required, Validators.pattern(/^(?!.*\s{2,})[A-Za-zÑñÁáÉéÍíÓóÚú\s-]{3,30}$/)]],
          nombre_categoria_producto: ['',[Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{3,20}$/),]],
          descripcion_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ,.\s:-]{4,500}$/)]],
          precio_ico: ['',[Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
          precio_por_mayor_ico: ['',[Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
          durabilidad_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9,.°\s:-]{3,50}$/)]],
          imagenes_producto: [null],

        });

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
      }

    //---------------------------------------------------------------------------------------------------------------------------------
    //función de inicialización del componente
    ngOnInit():void {        
        this.getListProductos();
        this.getListCategorias()                 
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todos los productos
    getListProductos(){     
        this.productoService.getListProductos().subscribe((data) =>{      
          this.listProductos = data;        
        })        
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todos los productos
    getListCategorias(){     
      this.categoriaService.getListCategorias().subscribe((data) =>{      
        this.categorias = data.
        filter(categoria => categoria.estado_categoria_producto === true)
        .map(categoria => categoria.nombre_categoria_producto);
      })        
    }
    
    onCategoriaChange(event) {
      console.log('Categoría seleccionada:', event.value);
      // Realizar otras acciones según sea necesario
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para obtener los datos de una categoría por id
    getProducto(id:string){      
      this.productoService.getProducto(id).subscribe((data:Producto) => {
       
        this.formProducto.setValue({
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

    //---------------------------------------------------------------------------------------------------------------------------------
    // Función para crear un producto
    crearProducto() {
      const form = this.formProducto;
      if (form.valid) {
        // Crear FormData y agregar valores
        const formData = new FormData();

        const nombreProducto = this.formProducto.get('nombre_producto').value.trim();
        const descripcionProducto = this.formProducto.get('descripcion_producto').value.trim();

        formData.append('codigo_producto', this.formProducto.get('codigo_producto').value);
        formData.append('nombre_producto', nombreProducto);
        formData.append('nombre_categoria_producto', this.formProducto.get('nombre_categoria_producto').value);
        formData.append('descripcion_producto', this.formProducto.get('descripcion_producto').value);
        formData.append('precio_ico', this.formProducto.get('precio_ico').value);
        formData.append('precio_por_mayor_ico', this.formProducto.get('precio_por_mayor_ico').value);
        formData.append('durabilidad_producto', this.formProducto.get('durabilidad_producto').value);

        // Añadir las imágenes seleccionadas
        if (this.files && this.files.length > 0) {
          for (let i = 0; i < this.files.length; i++) {
            formData.append('imagenes_producto', this.files[i]);
          }
        }
        
        this.productoService.crearProducto(formData).subscribe(
          () => {
            // Realiza otras operaciones después de la creación de la categoría si es necesario
            this.messageService.add({
              severity: 'success',
              summary: 'Producto creado',
              detail: 'El producto fue creado con éxito',
              life: 3000
            });
            this.getListProductos();
            this.cerrarDialog();
            this.fileCrear.clear();
            this.files = [];
          },
          (error) => {
            if (error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el producto',
                detail: errorMessage,
                life: 5000
              });
            } else {
              console.error('Error desconocido al crear el producto:', error);
            }
          }
        );
        
      }
    }
    
    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para cargar la imagen

    onFileChange(event) {
      if (event.currentFiles && event.currentFiles.length > 0) {
        // Obtener solo el primer archivo seleccionado
        const files = event.currentFiles;

        if (files.length > 3) {
          this.fileCrear.clear();
          this.fileEditar.clear();
          this.files = [];
          // Mostrar mensaje de error
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar imágenes',
            detail: 'Solo se permite subir 3 imagenes por producto',
            life: 5000
          });
          return; // Salir de la función si se excede el límite de imágenes
        }

        if (this.imagenes.length > 0){
          this.imagenes = [];
        }
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Verificar si es un archivo de imagen
          if (file && file.type && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            //if (this.imagenes.length >)
            this.files.push(file);
            this.imagenes.push(URL.createObjectURL(file)); // Mostrar la imagen seleccionada
            
            this.messageService.add({
              severity: 'info',
              summary: 'Imagen cargada exitosamente',
              life: 3000
            });
          } else {
            console.log("El archivo seleccionado no es una imagen.");
          }
        }
        this.fileSelected = event.currentFiles.length > 0 && event.currentFiles.length < 4;
        console.log('Array imagenes: ',this.files)
      } else {
        this.files = [];
        console.log("No se seleccionó ningún archivo de imagen.");
      }
    }
    
    //---------------------------------------------------------------------------------------------------------------------------------
    // Función para actualizar un producto
    actualizarProducto() {
      const form = this.formProducto;
      if (form.valid) {
        const formData = new FormData;
        formData.append('codigo_producto', this.formProducto.get('codigo_producto').value);
        formData.append('nombre_producto', this.formProducto.get('nombre_producto').value);
        formData.append('nombre_categoria_producto', this.formProducto.get('nombre_categoria_producto').value);
        formData.append('descripcion_producto', this.formProducto.get('descripcion_producto').value);
        formData.append('precio_ico', this.formProducto.get('precio_ico').value);
        formData.append('precio_por_mayor_ico', this.formProducto.get('precio_por_mayor_ico').value);
        formData.append('durabilidad_producto', this.formProducto.get('durabilidad_producto').value);

        // Añadir las imágenes seleccionadas
        if (this.files && this.files.length > 0) {
          for (let i = 0; i < this.files.length; i++) {
            formData.append('imagenes_producto', this.files[i]);
          }
        }
        // formData.append('imagenes_producto', this.files);
  
        if (this.id !== '') {
          this.productoService.actualizarProducto(this.id, formData).subscribe(
            () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Producto actualizado',
              detail: 'El producto fue actualizado con éxito',
              life: 3000
            });
            this.getListProductos();
            this.editarProductoDialog = false;
            this.fileCrear.clear();
          },
          (error) => {
            if (error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error al actualizar el producto',
                detail: errorMessage,
                life: 5000
              });
            } else {
              console.error('Error desconocido al actualizar el producto:', error);
            }
          }
          );
        }
      }
      
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para confirmar cambiar el estado de un producto
    confirmarCambioEstado(producto: Producto) {
      this.estadoProductoDialog = true;
      this.producto = producto
    }
    
    // Función para cambiar el estado de un producto
    // cambiarEstadoProducto(id: string) {
    //   this.productoService.actualizarEstadoProducto(id).subscribe({
    //     next: () => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'El estado del producto fue cambiado con éxito',
    //         life: 3000
    //       });
    //       this.estadoProductoDialog = false;
    //     },
    //     error: (error) => {
    //       console.error('Error cambiando el estado del producto:', error);
    //       // Manejar errores según sea necesario
    //     }
    //   });
    // }

    cambiarEstadoProducto(id: string, nombreCategoriaProducto: string) {
      // Buscar la categoría correspondiente en tu base de datos
      this.categoriaService.obtenerCategoriaPorNombre(nombreCategoriaProducto).subscribe({
        next: (categoria) => {
          // Verificar el estado de la categoría
          if (categoria && categoria.estado_categoria_producto) {
            // Cambiar el estado del producto solo si la categoría está activa (estado `true`)
            this.productoService.actualizarEstadoProducto(id).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'El estado del producto fue cambiado con éxito',
                  life: 3000
                });
                this.estadoProductoDialog = false;
              },
              error: (error) => {
                console.error('Error cambiando el estado del producto:', error);
                // Manejar errores según sea necesario
              }
            });
          } else {
            // Notificar al usuario que la categoría no está activa
            this.messageService.add({
              severity: 'error',
              summary: 'La categoría asociada a este producto no está activa. No se puede cambiar el estado del producto.',
              life: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error obteniendo la categoría:', error);
          // Manejar errores según sea necesario
        }
      });
    }
    

    //Función para no cambiar el estado de un producto
    noCambiarEstado() {
      this.estadoProductoDialog = false;
      this.getListProductos();
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //funciónes para abrir y cerrar un dialog para crear un nuevo producto
    nuevoProducto() {
       // Verifica el ancho de la ventana del navegador
       const anchoDialog = window.innerWidth < 960 ? '90%' : '70%';

       // Establece el ancho del diálogo
       this.anchoDialogCrearProducto = anchoDialog;
        this.id = '';                
        this.formProducto.reset()
        this.crearProductoDialog = true;
        this.fileCrear.clear();
        this.files = [];
        this.fileSelected = false;
        this.imagenes = ['../../../../../assets/Imagenes/No IMG 2.png'];
    }

    //función para cerrar un dialog y limpiar el fileUpload de crear producto
    cerrarDialog() {
      this.crearProductoDialog = false;
      this.fileCrear.clear();
      this.files = [];
      this.fileSelected = false;
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //funciónes para abrir y cerrar un dialog para editar un producto
    editarProducto(id:string) {
        // Verifica el ancho de la ventana del navegador
        const anchoDialog = window.innerWidth < 960 ? '90%' : '70%';

        // Establece el ancho del diálogo
        this.anchoDialogEditarProducto = anchoDialog;
        this.id = id;
        this.editarProductoDialog = true;
        this.getProducto(id)
        this.fileEditar.clear();
        this.files = [];
    }

    //función para cerrar un dialog y limpiar el fileUpload de editar producto
    cerrarEditarDialog() {
      this.editarProductoDialog = false;
      this.fileEditar.clear();
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y ver detalles de un producto
    detalleProducto(id: string) {
      // Verifica el ancho de la ventana del navegador
      const anchoDialog = window.innerWidth < 960 ? '90%' : '70%';

      // Establece el ancho del diálogo
      this.anchoDialogDetalleProducto = anchoDialog;
      this.id = id;
      this.detalleProductoDialog = true;
      this.getProducto(id);
    }
    
    //función para cerrar un dialog y limpiar el fileUpload de editar producto
    cerrarDetalleDialog() {
      this.detalleProductoDialog = false;
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
