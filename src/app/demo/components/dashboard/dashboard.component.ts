import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from './dashboard.service';
import { Pedido } from '../pages/ventas/ventas.model';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    ventas: Pedido[] = [];
    items!: MenuItem[];

    topSellingProducts: any[] = [];
    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(private productService: ProductService, public layoutService: LayoutService, private dashboardService: DashboardService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.getListDashboard();
    }

    getListDashboard() {
        this.dashboardService.getVentas().subscribe(
            (data: any) => {
                console.log('Datos de ventas:', data);
                this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
                this.calcularNuevasVentas();
                const productoCantidadMap = this.obtenerProductosMasVendidos();
                // Llamar a initChart() después de obtener los datos de ventas
                this.initChart();
            }
        );
    }

    // Método para calcular las nuevas ventas desde la última semana
    calcularNuevasVentas() {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Obtener la fecha del día anterior
        const fechaAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - 1);

        // Filtrar las ventas que ocurrieron desde el día anterior
        const nuevasVentas = this.ventas.filter(venta => {
            // Convertir la fecha de entrega a objeto Date
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido);

            // Devolver true si la fecha de entrega es posterior a la fecha del día anterior
            return fechaEntregaPedido.getTime() >= fechaAnterior.getTime();
        });

        // Devolver la cantidad de ventas filtradas
        const cantidadNuevasVentas = nuevasVentas.length;
        return cantidadNuevasVentas;
    }

    //Método para obtener los productos más vendidos de la semana, implementando la misma lógica de las ventas de la semana.
    obtenerProductosMasVendidos(): void {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Obtener la fecha del día anterior
        const fechaAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - 1);

        // Filtrar las ventas que ocurrieron desde el día anterior
        const ventasDeLaSemana = this.ventas.filter(venta => {
            // Convertir la fecha de entrega a objeto Date
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido);

            // Devolver true si la fecha de entrega es posterior a la fecha del día anterior
            return fechaEntregaPedido.getTime() >= fechaAnterior.getTime();
        });

        // Obtener un mapa de productos vendidos
        const productoCantidadMap = new Map<string, {
            name: string,
            quantitySold: number,
            price: number
        }>();

        // Iterar sobre las ventas de la semana
        ventasDeLaSemana.forEach(venta => {
            // Iterar sobre los detalles del pedido
            venta.detalle_pedido.forEach(detalle => {
                // Obtener el nombre del producto
                const nombreProducto = detalle.nombre_producto;

                // Obtener la cantidad vendida
                const cantidadProducto = detalle.cantidad_producto;

                // Obtener el precio del producto
                const precioProducto = detalle.precio_ico; // O detalle.precio_por_mayor_ico, según sea el precio que quieras mostrar

                // Agregar el producto al mapa
                productoCantidadMap.set(nombreProducto, {
                    name: nombreProducto,
                    quantitySold: cantidadProducto,
                    price: precioProducto
                });
            });
        });

        // Obtener los productos más vendidos
        const sortedProducts = Array.from(productoCantidadMap.entries())
            .sort((b, a) => a[1].quantitySold - b[1].quantitySold)
            .slice(0, 5); // Obtener solo los 5 productos más vendidos

        // Asignar los productos más vendidos a la propiedad `topSellingProducts`
        this.topSellingProducts = sortedProducts.map(([productName, product]) => ({
            name: product.name,
            quantitySold: product.quantitySold,
            price: product.price
        }));
    }




    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Aquí se obtienen las ventas del servicio o del lugar correspondiente
        const ventas = this.ventas; // Asegúrate de que este sea el arreglo de ventas
        console.log("ejemplo o cosas que quiero ver para la gráfica" + ventas);

        // Datos de ejemplo (reemplaza esto con tus datos reales)
        const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const ventasDiarias = [0, 0, 0, 0, 0, 0, 0];

        this.ventas.forEach(venta => {
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido);
            const diaEntrega = fechaEntregaPedido.getDay();
            ventasDiarias[diaEntrega]++;
        });

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
