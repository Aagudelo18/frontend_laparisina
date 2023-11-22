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
    providers: [MessageService, CategoriaService]
})
export class ProductoComponent implements OnInit {
  @ViewChild('fileCrear') fileCrear: FileUpload;
  @ViewChild('fileEditar') fileEditar: FileUpload;

    listProductos: Producto[] = [];
    categorias: string [] = []
    producto: Producto = {};
    formProducto:FormGroup;
    formEditarProducto: FormGroup;
    id: string = '';
    
    // Variables para capturar y tener control de la imagen
    file: File | null = null;
    fileSelected: boolean = false;
    imagen_producto: string = '../../../../../assets/Imagenes/No IMG.png'

    //Variables para controlar dialogs
    crearProductoDialog: boolean = false;
    editarProductoDialog: boolean = false;
    detalleProductoDialog: boolean = false;
    estadoProductoDialog: boolean = false;
    


    constructor(
      private fb:FormBuilder,
      private productoService: ProductoService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute,
      private categoriaService: CategoriaService){

        this.formProducto = this.fb.group({
          codigo_producto: ['',[Validators.required, Validators.pattern(/^[0-9]{3,4}$/),]],
          nombre_producto: ['',[Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/)]],
          nombre_categoria_producto: ['',[Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
          descripcion_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ,.\s:-]+$/)]],
          precio_ico: ['',[Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
          precio_por_mayor_ico: ['',[Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
          durabilidad_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9,.\s:-]{1,50}$/)]],
          ingredientes_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s,.:'-]+$/)]],
          image: [null],

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
          ingredientes_producto: data.ingredientes_producto,
          image: data.imagen_producto,
        })
        this.imagen_producto = 'http://localhost:3000/uploads/' + data.imagen_producto
      })
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    // Función para crear un producto
    crearProducto() {
      const form = this.formProducto;
      if (form.valid) {
        // Crear FormData y agregar valores
        const formData = new FormData();
        formData.append('codigo_producto', this.formProducto.get('codigo_producto').value);
        formData.append('nombre_producto', this.formProducto.get('nombre_producto').value);
        formData.append('nombre_categoria_producto', this.formProducto.get('nombre_categoria_producto').value);
        formData.append('descripcion_producto', this.formProducto.get('descripcion_producto').value);
        formData.append('precio_ico', this.formProducto.get('precio_ico').value);
        formData.append('precio_por_mayor_ico', this.formProducto.get('precio_por_mayor_ico').value);
        formData.append('durabilidad_producto', this.formProducto.get('durabilidad_producto').value);
        formData.append('ingredientes_producto', this.formProducto.get('ingredientes_producto').value);
        formData.append('image', this.file);
        
        this.productoService.crearProducto(formData).subscribe(
          () => {
            // Realiza otras operaciones después de la creación de la categoría si es necesario
            this.messageService.add({
              severity: 'success',
              summary: 'El producto fue creado con éxito',
              detail: 'Producto creada',
              life: 3000
            });
            this.getListProductos();
            this.cerrarDialog();
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
        const file = event.currentFiles[0];
    
        // Verificar si es un archivo de imagen
        if (file.type.includes("image")) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
    
          this.file = file;
          this.fileSelected = event.currentFiles.length > 0;
          this.imagen_producto = URL.createObjectURL(file); // Mostrar la imagen seleccionada
          this.messageService.add({
            severity: 'info',
            summary: 'Imagen cargada exitosamente',
            life: 3000
          });
          console.log('Verificar: ', this.file);
        } else {
          console.log("El archivo seleccionado no es una imagen.");
        }
      } else {
        this.file = null;
        console.log("No se seleccionó ningún archivo o se seleccionó más de uno.");
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
        formData.append('ingredientes_producto', this.formProducto.get('ingredientes_producto').value);
        formData.append('image', this.file);
  
        if (this.id !== '') {
          this.productoService.actualizarProducto(this.id, formData).subscribe(
            () => {
            this.messageService.add({
              severity: 'success',
              summary: 'El producto fue actualizado con éxito',
              detail: 'Producto actualizado',
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
    cambiarEstadoProducto(id: string) {
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
    }

    //Función para no cambiar el estado de un producto
    noCambiarEstado() {
      this.estadoProductoDialog = false;
      this.getListProductos();
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog para crear un nuevo producto
    nuevoProducto() {
        this.id = '';                
        this.formProducto.reset()
        this.crearProductoDialog = true;
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog para editar un producto
    editarProducto(id:string) {
        this.id = id;
        this.editarProductoDialog = true;
        this.getProducto(id)
        this.fileEditar.clear();
        this.file = null;
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de crear producto
    cerrarDialog() {
      this.crearProductoDialog = false;
      this.fileCrear.clear();
      this.limpiarImagenProducto()
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de editar producto
    cerrarEditarDialog() {
      this.editarProductoDialog = false;
      this.fileEditar.clear();
      this.limpiarImagenProducto();
    }

     //-------------------------------------------------------------------------------------------------------------------------------
    // Función para limpiar la variable imagen_categoria
    limpiarImagenProducto() {
      this.imagen_producto = '../../../../../assets/Imagenes/No IMG.png';
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y ver detalles de un producto
    detalleProducto(id: string) {
      this.id = id;
      this.detalleProductoDialog = true;
      this.getProducto(id);
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
