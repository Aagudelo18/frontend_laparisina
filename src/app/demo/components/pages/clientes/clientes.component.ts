import { Component, OnInit } from '@angular/core';
import { ClienteService } from './clientes.service';
import { UsuarioService } from './usuarios.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from './clientes.model';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors} from '@angular/forms';
import { Validators } from '@angular/forms';
import { switchMap,catchError } from 'rxjs/operators';
import { Subject,Observable, throwError   } from 'rxjs';
import { TransportesService } from '../transportes/transportes.service';
 
@Component({
    templateUrl: './clientes.component.html', 
    providers: [MessageService]
})
export class clientesComponent implements OnInit {
    crearClienteDialog: boolean = false;
    editarClienteaDialog: boolean = false;
    detalleClienteDialog: boolean =false;
    estadoClienteDialog: boolean = false;
    selectedClientes: any[] = [];
    transportes:string [] = [];

      private confirmacionUsuarioSubject = new Subject<boolean>();
      mostrarConfirmacionUsuario = false; 
      listClientes: Clientes[] = []
      clientes: Clientes = {}
      formCliente:FormGroup;
      id: string = '';
      
  
      estado:SelectItem[] = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
      ];
  
      selectedEstado: SelectItem = {value: ''};
  
  
  
      constructor(private fb:FormBuilder,
        private clienteService: ClienteService,
        private transportesService: TransportesService,
        private usuarioService :UsuarioService,
        private messageService: MessageService,
        private router:Router,
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
            contrasena_usuario: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),]],
            confirmar_contrasena: ['', [Validators.required, this.validarContrasenaConfirmada.bind(this)]],
  
          })
          this.aRouter.params.subscribe(params => {
            this.id = params['id']; // Obtén el valor del parámetro 'id' de la URL y actualiza id
          });
         }
        
         async descargarExcel() {
          try {
            const blob = await this.clienteService.descargarClientesExcel().toPromise();
            this.descargarArchivo(blob);
          } catch (error) {
            console.error('Error al descargar el archivo', error);
            // Manejar el error según sea necesario
          }
        }
      
        private descargarArchivo(blob: Blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'cliente.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      

       //Verifica o se asegura de que el campo de confirmar contraseña coincida con la contraseña.
      validarContrasenaConfirmada(control: AbstractControl): ValidationErrors | null {
        const contrasena = control.root.get('contrasena_usuario');
        const confirmarContrasena = control.value;

        if (contrasena && contrasena.value !== confirmarContrasena) {
          return { contrasenaNoCoincide: true };
        }

        return null;
      }
  
      ngOnInit():void {        
          this.getListClientes();
          console.log('clientes:', this.clientes);   
          this.getListTransportes();               
      }
  
      getListClientes(){     
          this.clienteService.getListClientes().subscribe((data) =>{      
            this.listClientes = data;        
          })        
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
            contrasena_usuario: this.formCliente.value.contrasena_usuario,
            confirmar_contrasena: this.formCliente.value.confirmar_contrasena,
          })
        })
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

      // Función para crear un cliente
      crearCliente() {
      const numeroIdentificacion = this.formCliente.value.numero_documento_cliente;
      const numeroCelular = this.formCliente.value.telefono_cliente;
      const nombreJuridico = this.formCliente.value.nombre_juridico;
      const nitEmpresa = this.formCliente.value.nit_empresa_cliente;
      const correo = this.formCliente.value.correo_cliente;

      // Verificar si el numero de identificacion ya existe en la lista de clientes
      const identificacionExistente = this.listClientes.find(cliente => cliente.numero_documento_cliente  === numeroIdentificacion);
      if (identificacionExistente) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear el cliente',
          detail: 'El número de documento ya existe.',
          life: 6000
        });
        return; // Detener la ejecución de la función si numero de identificacion ya existe
      }
      // Verificar si el numero de celular ya existe en la lista de de clientes
      const celularExistente = this.listClientes.find(cliente => cliente.telefono_cliente  === numeroCelular);
      if (celularExistente) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear el cliente',
          detail: 'El número de celular ya existe.',
          life: 6000
        });
        return; 
      }
      // Verificar si el nombre juridico ya existe en la lista de clientes
      if (nombreJuridico && nombreJuridico.trim() !== '') {
        const nombreJuridicoExistente = this.listClientes.find(cliente => cliente.nombre_juridico === nombreJuridico);
        if (nombreJuridicoExistente) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el cliente',
            detail: 'El nombre jurídico ya existe.',
            life: 6000
          });
          return; 
        }
      }
      // Verificar si el nit empresarial ya existe en la lista de clientes
      if (nitEmpresa && nitEmpresa.trim() !== '') {
        const nitEmpresaExistente = this.listClientes.find(cliente => cliente.nit_empresa_cliente === nitEmpresa);
        if (nitEmpresaExistente) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al crear el cliente',
            detail: 'El nit de la empresa ya existe.',
            life: 6000
          });
          return; 
        }
      }
      // Verificar si el correo electrónico ya existe en la lista de de clientes
      const correoExistente = this.listClientes.find(cliente => cliente.correo_cliente  === correo);
      if (correoExistente) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al crear el cliente',
          detail: 'El correo electrónico ya existe.',
          life: 6000
        });
        return; 
      }
      const nuevoCliente: Clientes = {
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
            estado_cliente: true,
        };
        

        const nuevoUsuario = {
          correo_electronico: this.formCliente.value.correo_cliente,
          contrasena_usuario: this.formCliente.value.contrasena_usuario,
          confirmar_contrasena: this.formCliente.value.confirmar_contrasena,
          rol_usuario:'654a96ebdbe2126f5a74161e',
      };

      // Verifica la igualdad de contraseñas antes de enviar la solicitud para crear el usuario
  if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
    this.confirmarCrearUsuario().subscribe(
      (usuarioConfirmado) => {
        if (usuarioConfirmado) {
          // El usuario fue confirmado, ahora puedes crear el cliente
          this.clienteService.postClientes(nuevoCliente).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'El cliente fue creado con éxito',
                detail: 'Cliente creado',
                life: 6000,
              });
              this.getListClientes();
              this.crearClienteDialog = false;
            },
            (error) => {
              console.error('Error al crear el cliente:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error al crear el cliente',
                detail: 'Error al crear el cliente',
                life: 3000,
              });
            }
          );
        } else {
          // El usuario no fue confirmado, puedes manejarlo según tus necesidades
          console.log('Error por no fonfirmar el usuario')
        }
      },
      (error) => {
        console.error('Error al confirmar el usuario:', error);
        // Manejar errores al confirmar el usuario
      }
    );
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al crear el cliente',
      life: 3000,
    });
  }
};
    
   

confirmarCrearUsuario() {
  const nuevoUsuario = {
    correo_electronico: this.formCliente.value.correo_cliente,
    contrasena_usuario: this.formCliente.value.contrasena_usuario,
    confirmar_contrasena: this.formCliente.value.confirmar_contrasena,
    rol_usuario:'654a96ebdbe2126f5a74161e',
  };

  if (nuevoUsuario.contrasena_usuario === nuevoUsuario.confirmar_contrasena) {
    this.mostrarConfirmacionUsuario = true;

    return new Observable<boolean>((observer) => {
      this.confirmacionUsuarioSubject.subscribe((respuesta) => {
        this.mostrarConfirmacionUsuario = false;

        if (respuesta) {
          this.usuarioService.createUsuario(nuevoUsuario).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'El usuario fue creado con éxito',
                detail: 'Usuario creado',
                life: 3000
              });
              observer.next(true);  // Usuario creado exitosamente
              observer.complete();
            },
            (error) => {
              console.error('Error al confirmar el usuario:', error);
              observer.error('Error al confirmar el usuario');
            }
          );
        } else {
          observer.next(false);  // Usuario no confirmado
          observer.complete();
        }
      });
    });
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Las contraseñas no coinciden al confirmar',
      life: 3000,
    });
    return throwError('Las contraseñas no coinciden');
  }
}

confirmarCreacionUsuario() {
  this.mostrarConfirmacionUsuario = false;
  this.confirmacionUsuarioSubject.next(true); // Confirmar la creación del usuario
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


      // Función para confirmar cambiar el estado de un cliente
    confirmarCambioEstado(clientes: Clientes) {
      this.estadoClienteDialog = true;
      this.clientes = clientes
    }
    
     //Función para no cambiar el estado de un cliente
     noCambiarEstado() {
      this.estadoClienteDialog = false;
      this.getListClientes();
    }
    // Función para cambiar el estado de un cliente
    cambiarEstadoCliente(id: string) {
      this.clienteService.actualizarEstadoCliente(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'El estado del cliente fue cambiado con éxito',
            life: 3000
          });
          this.messageService.add({
            severity: 'info',
            summary: 'El estado del usuario fue cambiado con éxito',
            life: 3000
          });
          this.estadoClienteDialog = false;
          // Actualizar la lista de categorías u otra lógica según sea necesario
        },
        error: (error) => {
          console.error('Error cambiando el estado del cliente:', error);
          // Manejar errores según sea necesario
        }
      });
    }
  
  
      openNewClienteDialog() {
          this.id = '';                
          this.formCliente.reset()
          this.crearClienteDialog = true;
      }
      
      openEditarClienteDialog(id:string) {
          this.id = id;
          this.editarClienteaDialog = true;
          this.getClientes(id);
      }

      openDetalleClienteDialog(id:string) {
        this.id = id;
        this.detalleClienteDialog = true;
        this.getClientes(id);
    }
  
      onGlobalFilter(table: Table, event: Event) {
          table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

}