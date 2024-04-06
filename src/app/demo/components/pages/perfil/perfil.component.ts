import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors} from '@angular/forms';
import { Router } from '@angular/router';
import { Clientes } from '../clientes/clientes.model';
import { ClienteService } from '../clientes/clientes.service';
import { UsuarioService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/usuarios.model';
import { DialogService } from 'primeng/dynamicdialog'; 
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TransportesService } from '../transportes/transportes.service';
import { RolesService } from '../roles/roles.service';
import { Roles } from '../roles/roles.model';

@Component({
    selector: 'app-profile',
    templateUrl: './perfil.component.html',
    providers: [MessageService]
    
})
export class PerfilComponent implements OnInit {
    id: any; 
    formCliente: FormGroup; // Propiedad para el formulario de cliente
    usuarios: Usuario[] = [];
    listClientes: Clientes[] = [];
    currentUser: any; // Variable para almacenar los datos del usuario
    clienteEncontrado: Clientes; // Variable para almacenar el cliente encontrado
    usuarioEncontrado: Usuario;
    editarClienteaDialog: boolean = false;
    transportes:string [] = [];
    clienteRoleId: any;
    listRoles: Roles[] = []

    constructor(
        private fb: FormBuilder,
        private clienteService: ClienteService,
        private usuarioService: UsuarioService,
        private rolesService:RolesService,
        private messageService: MessageService,
        private transportesService: TransportesService,
        private dialogService: DialogService,
        private aRouter:ActivatedRoute){
            this.formCliente = this.fb.group({
              tipo_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{1,20}$/),]],
              nombre_contacto: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{3,50}$/),]],
              nombre_juridico: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú0-9\s]{3,100}$/),]],
              numero_documento_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
              nit_empresa_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,12}$/),]],
              telefono_cliente: ['',[Validators.required, Validators.pattern(/^[0-9]{7,10}$/),]],
              direccion_cliente: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9\s,.'#-]+$/),]],
              barrio_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú0-9\s]{3,20}$/),]],
              ciudad_cliente: ['', [Validators.required, Validators.pattern(/^[A-Za-zÑñÁáÉéÍíÓóÚú\s]{3,20}$/),]],
              estado_cliente: ['', Validators.required],
              correo_cliente: ['', [Validators.required, Validators.email]],
    
            })
            this.aRouter.params.subscribe(params => {
              this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
            });
           }

    ngOnInit() {
        this.getCurrentUser(); // Llama a la función para obtener los datos del usuario
        this.getListClientes(); // Obtener la lista de clientes
        this.getListUsuarios(); // Obtener la lista de usuarios
        this.verificarCorreo();
        this.getListTransportes(); 
        this.getListRoles ();     
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser'); // Recupera los datos del usuario del localStorage
        if (user) {
            this.currentUser = JSON.parse(user); // Asigna los datos del usuario a la variable
        }
    }

    getListClientes() {
        this.clienteService.getListClientes().subscribe((data) => {
            this.listClientes = data;
            this.verificarCorreo();
        });
    }

    getListRoles() {
      this.rolesService.getListRoles().subscribe((data) => {
          this.listRoles = data;
          const clienteRole = this.listRoles.find(role => role.nombre_rol === 'Cliente');
          if (clienteRole) {
              this.clienteRoleId = clienteRole._id;
          } else {
              console.log('No se encontró el rol Cliente en la lista.');
          }
      });
  }

    getListUsuarios() {
        this.usuarioService.getUsuarios().subscribe((data: any) => {
          if (data && data.usuarios) {
            // Filtrar los usuarios para excluir aquellos con roles "Cliente" y "Empleado"
            this.usuarios = data.usuarios.filter(usuario => {
              return usuario.rol_usuario && usuario.rol_usuario.nombre_rol !== 'Cliente' && usuario.rol_usuario.nombre_rol !== 'Empleado';
            });
          }
        this.verificarCorreo();
        });
      }

    //Función para listar todos los transportes
    getListTransportes(){     
        this.transportesService.getListTransportes().subscribe((data) =>{      
          this.transportes = data.
          filter(transporte => transporte.estado_transporte === true)
          .map(transporte => transporte.ciudad_cliente);
        })        
      }
      
      onTransporteChange(event) {
        console.log('Transporte seleccionada:', event.value);
        // Realizar otras acciones según sea necesario
      }

    verificarCorreo() {
        console.log("Tipo de lista de usuarios:", typeof this.usuarios); // Verifica el tipo de this.listUsuarios
        console.log("Lista de usuarios en verificarCorreo():", this.usuarios);
        if (this.currentUser && this.currentUser.rol_usuario === this.clienteRoleId) {
            // Si el usuario tiene el rol específico, se procede a buscar el cliente en la lista
            const correo = this.currentUser.correo_electronico; // Obtener el correo electrónico del usuario actual
            this.clienteEncontrado = this.listClientes.find(cliente => cliente.correo_cliente === correo); // Buscar el cliente con el mismo correo
            if (this.clienteEncontrado) {
                // Si el cliente existe, se captura todo el objeto cliente
                console.log("Cliente encontrado:", this.clienteEncontrado);
            } else {
                console.log("El cliente no existe.");
            }
        } else {
            // Si el usuario no tiene el rol específico, buscamos en la lista de usuarios
            const correo = this.currentUser.correo_electronico;
            this.usuarioEncontrado = this.usuarios.find(usuario => usuario.correo_electronico === correo); // Buscar el usuario con el mismo correo
            console.log("Usuario encontrado:", this.usuarioEncontrado); // Agrega este console.log para verificar el usuario encontrado
            if (this.usuarioEncontrado) {
                console.log("Usuario encontrado:", this.usuarioEncontrado);
            } else {
                console.log("El usuario no existe en la lista de usuarios.");
            }
        }
    }

    getClientes(id:string){      
        this.clienteService.getClientes(id).subscribe((data:Clientes) => {

          const nombreJuridico = data.nombre_juridico !== undefined ? data.nombre_juridico : '';
          const nitEmpresa = data.nit_empresa_cliente !== undefined ? data.nit_empresa_cliente : '';
          console.log(`nombreJuridico: ${nombreJuridico} \n nitEmpresa:${nitEmpresa}`)
         
          this.formCliente.setValue({
            tipo_cliente: data.tipo_cliente,
            nombre_contacto: data.nombre_contacto,
            nombre_juridico:nombreJuridico ,
            numero_documento_cliente: data.numero_documento_cliente,
            nit_empresa_cliente: nitEmpresa,
            correo_cliente: data.correo_cliente,
            telefono_cliente: data.telefono_cliente,
            direccion_cliente: data.direccion_cliente,
            barrio_cliente: data.barrio_cliente,
            ciudad_cliente: data.ciudad_cliente,
            estado_cliente:data.estado_cliente,
          })
        })
      }

    // Función para actualizar un cliente
    actualizarCliente() {
        const nuevoDocumento = this.formCliente.value.numero_documento_cliente;

        // Verificar si el nuevo nombre ya existe en la lista de roles
        const documentoExistente = this.listClientes.find(cliente => cliente.numero_documento_cliente === nuevoDocumento);
      
        if (documentoExistente && documentoExistente._id !== this.id) { // Evitar comparar el mismo rol consigo mismo
          this.messageService.add({
            severity: 'error',
            summary: 'Error al editar el cliente',
            detail: 'El numero de documento ya está en uso.',
            life: 6000
          });
          return; // Detener la ejecución de la función si el nuevo nombre ya existe
        }
      
        const clienteActualizado: Clientes = {
            tipo_cliente: this.formCliente.value.tipo_cliente,
            nombre_contacto: this.formCliente.value.nombre_contacto,
            nombre_juridico: this.formCliente.value.nombre_juridico,
            numero_documento_cliente: this.formCliente.value.numero_documento_cliente,
            nit_empresa_cliente: this.formCliente.value.nit_empresa_cliente,
            correo_cliente: this.formCliente.value.correo_cliente,
            telefono_cliente: this.formCliente.value.telefono_cliente,
            direccion_cliente: this.formCliente.value.direccion_cliente,
            barrio_cliente: this.formCliente.value.barrio_cliente,
            ciudad_cliente: this.formCliente.value.ciudad_cliente,
            estado_cliente: this.formCliente.value.estado_cliente,
        };
  
        if (this.id !== '') {
          clienteActualizado._id = this.id;
          this.clienteService.putClientes(this.id, clienteActualizado).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'El cliente fue actualizado con éxito',
              detail: 'Cliente actualizado',
              life: 6000
            });
            this.getListClientes();
            this.editarClienteaDialog = false;
          });
        }
      }

    openEditarClienteDialog(id:string) {
        this.id = id;
        this.editarClienteaDialog = true;
        this.getClientes(id);
    }
}
