import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-profile',
    templateUrl: './perfil.component.html',

})
export class PerfilComponent implements OnInit {
    currentUser: any; // Variable para almacenar los datos del usuario

    constructor() {}

    ngOnInit() {
        this.getCurrentUser(); // Llama a la función para obtener los datos del usuario
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser'); // Recupera los datos del usuario del localStorage
        if (user) {
            this.currentUser = JSON.parse(user); // Asigna los datos del usuario a la variable
        
        }
    }
}
