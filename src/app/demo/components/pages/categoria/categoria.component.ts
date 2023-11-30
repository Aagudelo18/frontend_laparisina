import { Component, OnInit, ViewChild } from '@angular/core';
import { Categoria } from './categoria.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CategoriaService } from './categoria.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
    templateUrl: './categoria.component.html',
    providers: [MessageService]
})
export class CategoriaComponent implements OnInit {
  @ViewChild('fileCrear') fileCrear: FileUpload;
  @ViewChild('fileEditar') fileEditar: FileUpload;

    //Lista para capturar todas las categorias
    listCategorias: Categoria[] = []
    //Objeto para capturar una categoría
    categoria: Categoria = {}
    //Formulario
    formCategoria:FormGroup;
    // Variable para capturar ID
    id: string = '';

    // Variables para capturar y tener control de la imagen
    file: File | null = null;
    fileSelected: boolean = false;
    displayDialog: boolean = false;
    // imagen_categoria: string = '../../../../../assets/Imagenes/No IMG.png';
    imagen_categoria: string = ''

    estado:SelectItem[] = [
      { label: 'Activo', value: true },
      { label: 'Inactivo', value: false }
    ];

    selectedEstado: SelectItem = {value: ''};

    //Variables para controlar dialogs
    crearCategoriaDialog: boolean = false;
    editarCategoriaDialog: boolean = false;
    detalleCategoriaDialog: boolean = false;
    estadoCategoriaDialog: boolean = false;

    

    constructor(
      private fb:FormBuilder,
      private categoriaService: CategoriaService,
      private messageService: MessageService,
      private router:Router,
      private aRouter:ActivatedRoute){ 

        this.formCategoria = this.fb.group({
          nombre_categoria_producto: ['',[Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
          descripcion_categoria_producto: ['',[Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ,.\s-]+$/),]],
          image: [null],

        });

        this.aRouter.params.subscribe(params => {
          this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
        });
      }

    //---------------------------------------------------------------------------------------------------------------------------------
    //función de inicialización del componente
    ngOnInit():void {        
        this.getListCategorias()                     
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para listar todas las categorías
    getListCategorias(){     
        this.categoriaService.getListCategorias().subscribe((data) =>{      
          this.listCategorias = data;        
        })        
    }

    //---------------------------------------------------------------------------------------------------------------------------------
    //Función para obtener los datos de una categoría por id
    getCategoria(id:string){      
      this.categoriaService.getCategoria(id).subscribe((data:Categoria) => {
       
        this.formCategoria.setValue({
          nombre_categoria_producto: data.nombre_categoria_producto,
          descripcion_categoria_producto: data.descripcion_categoria_producto,
          image: data.imagen_categoria_producto,
        })
        this.imagen_categoria = 'http://localhost:3000/uploads/' + data.imagen_categoria_producto
      })
    }


    // addCategoria(){
    //   const categoria : Categoria = {
    //    nombre_categoria_producto: this.formCategoria.value.nombre_categoria_producto,
    //    descripcion_categoria_producto: this.formCategoria.value.descripcion_categoria_producto,
    //    imagen_categoria_producto: this.formCategoria.value.imagen_categoria_producto,
    //    estado_categoria_producto: this.formCategoria.value.estado_categoria_producto,
    //   }
 
    //   if(this.id != ''){
    //    categoria._id = this.id;
    //    this.categoriaService.putCategoria(this.id,categoria).subscribe(() => {
    //     alert('Categoria actualizada con éxito')    
    //     this.messageService.add({
    //         severity: 'info', //'success', 'info', 'warn' o 'error'
    //         summary: `La categoría fue actualizada con éxito`,
    //         detail: 'Categoría actualizada',
    //         life: 6000 // La duración del mensaje en milisegundos
    //       });
    //       this.getListCategorias();
    //       this.editarCategoriaDialog = false;  
    //    })
    //   } else {            
    //    this.categoriaService.postCategoria(categoria).subscribe(() => {
    //     alert('Categoría creada con éxito')
    //     this.messageService.add({
    //         severity: 'success', //'success', 'info', 'warn' o 'error'
    //         summary: 'La categoría fue creada con éxito',
    //         detail: 'Categoría creada',
    //         life: 6000 // La duración del mensaje en milisegundos
    //     });
    //     this.getListCategorias();
    //     this.crearCategoriaDialog = false;     
    //    })
    //   }
      
    // }

    // // Función para crear una categoría
    // crearCategoria() {
    //   const nuevaCategoria: Categoria = {
    //     nombre_categoria_producto: this.formCategoria.value.nombre_categoria_producto,
    //     descripcion_categoria_producto: this.formCategoria.value.descripcion_categoria_producto,
    //     imagen_categoria_producto: this.formCategoria.value.imagen_categoria_producto,
    //     estado_categoria_producto: true,
    //   };

    //   this.categoriaService.postCategoria(nuevaCategoria).subscribe(() => {
    //     alert('Categoría creada con éxito');
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'La categoría fue creada con éxito',
    //       detail: 'Categoría creada',
    //       life: 3000
    //     });
    //     this.getListCategorias();
    //     this.crearCategoriaDialog = false;
    //   });
    // }

    //--------------------------------------------------------------------------------------------------------------------------------
    

    // Función para crear una categoría
    crearCategoria() {
      const form = this.formCategoria;
      if (form.valid) {
        // Crear FormData y agregar valores
        const formData = new FormData();
        formData.append('nombre_categoria_producto', this.formCategoria.get('nombre_categoria_producto').value);
        formData.append('descripcion_categoria_producto', this.formCategoria.get('descripcion_categoria_producto').value);
        formData.append('image', this.file);
        
        this.categoriaService.crearCategoria(formData).subscribe(
          () => {
            this.messageService.add({
              severity: 'success', //'success', 'info', 'warn' o 'error'
              summary: 'La categoría fue creada con éxito',
              detail: 'Categoría creada',
              life: 3000
            });
            this.getListCategorias();
            this.cerrarDialog();
          },
          (error) => {
            if (error.error && error.error.error) {
              const errorMessage = error.error.error;
              this.messageService.add({
                severity: 'error',
                summary: 'Error al crear la categoría',
                detail: errorMessage,
                life: 5000
              });
            } else {
              console.error('Error desconocido al crear la categoría:', error);
            }
          }
        );
        
      }
    }

    //-------------------------------------------------------------------------------------------------------------------------------
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
          this.imagen_categoria = URL.createObjectURL(file); // Mostrar la imagen seleccionada
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
    
    // //Función para cargar la imagen
    // onFileChange(event) {
    //   if (event.target.files && event.target.files.length > 0) {
    //     // Obtener solo el primer archivo seleccionado
    //     const file = event.target.files[0];
    
    //     // Verificar si es un archivo de imagen
    //     if (file.type.includes("image")) {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(file);
    
    //       this.file = file;
    //       console.log('Verificar: ', this.file);
    //     } else {
    //       console.log("El archivo seleccionado no es una imagen.");
    //     }
    //   } else {
    //     console.log("No se seleccionó ningún archivo o se seleccionó más de uno.");
    //   }
    // }
    
    //Función para cargar la imagen
    
    
    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para actualizar una categoría
    actualizarCategoria() {
      const form = this.formCategoria;
      if (form.valid) {
        const formData = new FormData;
        formData.append('nombre_categoria_producto', this.formCategoria.get('nombre_categoria_producto').value);
        formData.append('descripcion_categoria_producto', this.formCategoria.get('descripcion_categoria_producto').value);
        formData.append('image', this.file);
  
        if (this.id !== '') {
          this.categoriaService.actualizarCategoria(this.id, formData).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'La categoría fue actualizada con éxito',
                detail: 'Categoría actualizada',
                life: 3000
              });
              this.getListCategorias();
              this.editarCategoriaDialog = false;
              this.fileCrear.clear();
            },
            (error) => {
              if (error.error && error.error.error) {
                const errorMessage = error.error.error;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error al actualizar la categoría',
                  detail: errorMessage,
                  life: 5000
                });
              } else {
                console.error('Error desconocido al actualizar la categoría:', error);
              }
            }
          );
        }
      }
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para confirmar cambiar el estado de una categoría
    confirmarCambioEstado(categoria: Categoria) {
      this.estadoCategoriaDialog = true;
      this.categoria = categoria
    }
    
    // Función para cambiar el estado de una categoría
    cambiarEstadoCategoria(id: string) {
      this.categoriaService.actualizarEstadoCategoria(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'El estado de la categoría fue cambiado con éxito',
            life: 3000
          });
          this.estadoCategoriaDialog = false;
        },
        error: (error) => {
          console.error('Error cambiando el estado de la categoría:', error);
          // Manejar errores según sea necesario
        }
      });
    }

    //Función para no cambiar el estado de una categoría
    noCambiarEstado() {
      this.estadoCategoriaDialog = false;
      this.getListCategorias();
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog para crear un nueva categoría
    nuevaCategoria() {
        this.id = '';                
        this.formCategoria.reset()
        this.crearCategoriaDialog = true;
    }
    
    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog para editar una categoría
    editarCategoria(id:string) {
        this.id = id;
        this.editarCategoriaDialog = true;
        this.getCategoria(id)
        this.fileEditar.clear();
        this.file = null;
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de crear categoría
    cerrarDialog() {
      this.crearCategoriaDialog = false;
      this.fileCrear.clear();
      this.limpiarImagenCategoria();
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para cerrar un dialog y limpiar el fileUpload de editar categoría
    cerrarEditarDialog() {
      this.editarCategoriaDialog = false;
      this.fileEditar.clear();
      this.limpiarImagenCategoria();
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y ver detalles de una categoría
    detalleCategoria(id: string) {
      this.id = id;
      this.detalleCategoriaDialog = true;
      this.getCategoria(id);
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    // Función para limpiar la variable imagen_categoria
    limpiarImagenCategoria() {
      this.imagen_categoria = '';
    }

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para abrir un dialog y imagen mas grande
    abrirImagenDialog(imagen_categoria: string) {
      this.imagen_categoria = imagen_categoria;
      this.displayDialog = true;
    }    

    //-------------------------------------------------------------------------------------------------------------------------------
    //función para filtar la tabla en el buscador
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
