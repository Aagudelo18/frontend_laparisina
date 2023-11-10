import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Categoria } from './categoria.model';
import { CategoriaService } from './categoria.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './categoria.component.html',
    providers: [MessageService]
})

export class CategoriaComponent implements OnInit {

    categorias: Categoria[] = [];
    selectedCategorias: Categoria[] = [];
    
    crearCategoriaDialog: boolean = false;
    openNewCategoriaDialog() {
        this.crearCategoriaDialog = true;
      }

    editarCategoriaDialog: boolean = false;
    openEditarCategoriaDialog() {
        this.editarCategoriaDialog = true;
      }

    categoriaForm: FormGroup;
    submitted: boolean = false;

    constructor(private categoriaService: CategoriaService, private messageService: MessageService, private fb: FormBuilder) { 
        this.categoriaForm = this.fb.group({
            nombre_categoria_producto: ['', [Validators.required]],
            descripcion_categoria_producto: ['', [Validators.required]],
            imagen_categoria_producto: [null, [Validators.required]]
          });
          this.submitted = false; 
    }

    ngOnInit() {
        this.categoriaService.getCategorias().subscribe(data => this.categorias = data);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          this.categoriaForm.get('imagen_categoria_producto').setValue(input.files[0]);
        }
      }
    
    crearCategoria(): void {
        this.submitted = true; // Marcar el formulario como enviado
        if (this.categoriaForm.valid) {
            const categoriaData: Categoria = this.categoriaForm.value;
            this.categoriaService.crearCategoria(categoriaData).subscribe(
            response => {
                console.log(response.message); // Maneja la respuesta del servidor como desees
            },
            error => {
                console.error(error); // Maneja los errores como desees
            }
            );
        }
    }
}
