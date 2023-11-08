import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Categoria } from './categoria.model';
import { CategoriaService } from './categoria.service';
import { Table } from 'primeng/table';


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

    constructor(private categoriaService: CategoriaService, private messageService: MessageService) { }

    ngOnInit() {
        this.categoriaService.getCategorias().subscribe(data => this.categorias = data);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
