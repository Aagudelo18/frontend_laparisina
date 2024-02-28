import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from './dashboard.service';
import { Pedido } from '../pages/ventas/ventas.model';
import { PedidoClienteService } from '../pages/pedido-cliente/pedido-cliente.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    ventas: Pedido[] = [];
    items!: MenuItem[];
    products!: Product[];

    ventasSemana: any[] = [];

    barData: any;
    barOptions: any;

    pieData: any;
    pieOptions: any;

    radarData: any;
    radarOptions: any;

    chartData: any;
    chartOptions: any;

    fechaSeleccionada: Date; // Variable para almacenar la fecha seleccionada
    cantidadVentasSemana: number; // Variable para mostrar la cantidad de ventas de la semana

    fechaSeleccionada1: Date; // Variable para almacenar la fecha seleccionada
    gananciaSemana: number; // Variable para mostrar la ganancia de la semana

    fechaSeleccionada3: Date; // Variable para almacenar la fecha seleccionada
    topSellingProducts: { name: string, quantitySold: number }[]; // Variable para almacenar los productos más vendidos

    subscription!: Subscription;

    fechaActual: Date = new Date(); // Fecha actual para calcular las ventas
    fechaLunes: Date; // Fecha del lunes de la semana actual

    constructor(private productService: ProductService, public layoutService: LayoutService, private dashboardService: DashboardService, private pedidoClienteService: PedidoClienteService) {
   

        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
        // Inicializar fechaLunes a la fecha del lunes de esta semana
        this.calcularFechaLunes();
    }

    ngOnInit() {
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.getListDashboard();
        this.getDocumentoCliente();
    }


    getDocumentoCliente(){
        let correo_cliente = JSON.parse(localStorage.getItem('currentUser')).correo_electronico;
        console.log(correo_cliente)
        this.pedidoClienteService
        .obtenerClientePorCorreo(correo_cliente)
        .subscribe(
            (data: any) => {
          
                localStorage.setItem('documento_cliente', data.numero_documento_cliente);

                // Luego, realizar la validación del tipo de cliente y calcular el precio total de venta
            },
            (error) => {
                console.error(error);
                // Manejar errores según sea necesario
            }
        );
    }

    getListDashboard() {
        this.dashboardService.getVentas().subscribe(
            (data: any) => {
                this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
                this.calcularNuevasVentas();
                this.calcularGanancia();
                this.fechaSeleccionada = new Date(); // Inicializar la fecha seleccionada con la fecha actual
                this.actualizarVentas(); // Calcular las ventas correspondientes a la semana actual
                this.fechaSeleccionada1 = new Date(); // Inicializar la fecha seleccionada con la fecha actual
                this.actualizarGanancia(); // Calcular la ganancia correspondiente a la semana actual
                // Llamar a initChart() después de obtener los datos de ventas
                this.initChart();
                this.fechaSeleccionada3 = new Date(); // Inicializar la fecha seleccionada con la fecha actual
                this.actualizarGraficoProductosVendidos(); // Actualizar el gráfico con los productos más vendidos de la semana actual
            }
        );
    }

    // Método para calcular las nuevas ventas desde la última semana
    calcularNuevasVentas() {
        // Obtener la fecha actual
        const fechaActual = new Date();
        const diaSemanaActual = fechaActual.getDay(); // Obtener el día de la semana (0 para domingo, 1 para lunes, ...)

        // Obtener la fecha del lunes de esta semana
        const fechaLunes = new Date(fechaActual);
        fechaLunes.setDate(fechaActual.getDate() - diaSemanaActual);

        // Filtrar las ventas de la semana
        const nuevasVentas = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes;
        });

        // Devolver la cantidad de ventas filtradas
        const cantidadNuevasVentas = nuevasVentas.length;
        return cantidadNuevasVentas;
    }

    actualizarVentas() {
        const fechaLunes = new Date(this.fechaSeleccionada);
        fechaLunes.setDate(fechaLunes.getDate() - fechaLunes.getDay() + 1); // Obtener la fecha del lunes de la semana seleccionada

        const fechaDomingo = new Date(fechaLunes);
        fechaDomingo.setDate(fechaLunes.getDate() + 6); // Obtener la fecha del domingo de la semana seleccionada

        const ventasSemana = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes && fechaVenta <= fechaDomingo;
        });
        this.cantidadVentasSemana = ventasSemana.length; // Actualizar la cantidad de ventas de la semana
    }

    // Método para calcular la fecha del lunes de esta semana
    calcularFechaLunes() {
        const diaSemanaActual = this.fechaActual.getDay(); // Obtener el día de la semana (0 para domingo, 1 para lunes, ...)
        this.fechaLunes = new Date(this.fechaActual);
        this.fechaLunes.setDate(this.fechaActual.getDate() - diaSemanaActual + 1);
    }

    // Calcula la suma de los precios totales de las ventas de la semana
    calcularGanancia(): number {
        // Obtener la fecha actual
        const fechaActual = new Date();
        const diaSemanaActual = fechaActual.getDay(); // Obtener el día de la semana (0 para domingo, 1 para lunes, ...)

        // Obtener la fecha del lunes de esta semana
        const fechaLunes = new Date(fechaActual);
        fechaLunes.setDate(fechaActual.getDate() - diaSemanaActual);

        // Filtrar las ventas de la semana
        const gananciasVentas = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes;
        });

        // Sumar los precios totales de las ventas de la semana
        let gananciaTotal = 0;
        gananciasVentas.forEach(venta => {
            gananciaTotal += venta.precio_total_venta;
        });

        return gananciaTotal;
    }

    actualizarGanancia() {
        const fechaLunes = new Date(this.fechaSeleccionada1);
        fechaLunes.setDate(fechaLunes.getDate() - fechaLunes.getDay() + 1); // Obtener la fecha del lunes de la semana seleccionada

        const fechaDomingo = new Date(fechaLunes);
        fechaDomingo.setDate(fechaLunes.getDate() + 6); // Obtener la fecha del domingo de la semana seleccionada

        const ventasSemana = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes && fechaVenta <= fechaDomingo;
        });

        let gananciaTotal = 0;
        ventasSemana.forEach(venta => {
            gananciaTotal += venta.precio_total_venta;
        });

        this.gananciaSemana = gananciaTotal; // Actualizar la ganancia de la semana
    }

    formatearGanancia(ganancia: number): string {
        if (ganancia === undefined) {
            return '0'; // O cualquier valor por defecto que desees mostrar si la ganancia es undefined
        } else {
            return ganancia.toLocaleString('es-ES', { style: 'currency', currency: 'COP' });
        }
    }

    async obtenerProductosMasVendidosSemana(): Promise<void> {
        // Obtener la fecha del lunes de la semana seleccionada
        const fechaLunes = new Date(this.fechaSeleccionada3);
        fechaLunes.setDate(fechaLunes.getDate() - fechaLunes.getDay() + 1);

        // Obtener la fecha del domingo de la semana seleccionada
        const fechaDomingo = new Date(fechaLunes);
        fechaDomingo.setDate(fechaLunes.getDate() + 6);

        // Filtrar las ventas de la semana seleccionada
        const ventasSemana = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes && fechaVenta <= fechaDomingo;
        });

        const productoCantidadMap = new Map<string, number>();
        ventasSemana.forEach(venta => {
            venta.detalle_pedido.forEach(detalle => {
                const nombreProducto = detalle.nombre_producto;
                const cantidadProducto = detalle.cantidad_producto;

                if (productoCantidadMap.has(nombreProducto)) {
                    productoCantidadMap.set(nombreProducto, productoCantidadMap.get(nombreProducto) + cantidadProducto);
                } else {
                    productoCantidadMap.set(nombreProducto, cantidadProducto);
                }
            });
        });

        const sortedProducts = Array.from(productoCantidadMap.entries())
            .sort((b, a) => a[1] - b[1])
            .slice(0, 5);

        this.topSellingProducts = sortedProducts.map(([productName, quantitySold]) => ({
            name: productName,
            quantitySold: quantitySold
        }));
    }

    async actualizarGraficoProductosVendidos(): Promise<void> {
        await this.obtenerProductosMasVendidosSemana(); // Obtener los productos más vendidos de la semana seleccionada

        // Crear un array de datasets, uno por cada producto
        const datasets = this.topSellingProducts.map(product => ({
            label: `${product.name} (${product.quantitySold})`, // Etiqueta que muestra el nombre del producto y la cantidad vendida
            backgroundColor: '#42A5F5',
            data: [product.quantitySold] // La cantidad vendida del producto
        }));

        // Actualizar el gráfico con los datos de los productos más vendidos
        this.barData = {
            labels: ['Semana'],
            datasets: datasets
        };
    }



    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Obtener la fecha del lunes de la semana seleccionada
        const fechaLunes = new Date(this.fechaSeleccionada);
        fechaLunes.setDate(fechaLunes.getDate() - fechaLunes.getDay() + 1);

        // Obtener la fecha del domingo de la semana seleccionada
        const fechaDomingo = new Date(fechaLunes);
        fechaDomingo.setDate(fechaLunes.getDate() + 6);

        // Filtrar las ventas de la semana seleccionada
        const ventasSemana = this.ventas.filter(venta => {
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido);
            return fechaEntregaPedido >= fechaLunes && fechaEntregaPedido <= fechaDomingo;
        });

        // Inicializar el arreglo de ventas diarias para la semana seleccionada
        const ventasDiarias = [0, 0, 0, 0, 0, 0, 0];

        // Contar las ventas por día dentro de la semana seleccionada
        ventasSemana.forEach(venta => {
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido);
            const diaEntrega = fechaEntregaPedido.getDay();
            ventasDiarias[diaEntrega]++;
        });

        // Definir los datos del gráfico con las ventas diarias de la semana seleccionada
        const labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const data = ventasDiarias;

        this.chartData = {
            labels,
            datasets: [
                {
                    label: 'Ventas diarias',
                    data,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }




    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}