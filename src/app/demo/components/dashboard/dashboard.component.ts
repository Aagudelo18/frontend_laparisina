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

    ventasSemana: any[] = [];

    barData: any;
    barOptions: any;

    pieData: any;
    pieOptions: any;

    radarData: any;
    radarOptions: any;

    chartData: any;
    chartOptions: any;

    subscription!: Subscription;

    semanaSeleccionadaCambiada(event: any) {
        const semanaSeleccionada = event.target.value;
        console.log("Semana seleccionada:", semanaSeleccionada);
        // Aquí podrías hacer cualquier lógica adicional necesaria con la semana seleccionada
    }
    fechaActual: Date = new Date(); // Fecha actual para calcular las ventas
    fechaLunes: Date; // Fecha del lunes de la semana actual

    constructor(private productService: ProductService, public layoutService: LayoutService, private dashboardService: DashboardService) {
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
    }

    getListDashboard() {
        this.dashboardService.getVentas().subscribe(
            (data: any) => {
                this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
                this.calcularNuevasVentas();
                this.calcularGanancia();
                const productoCantidadMap = this.obtenerProductosMasVendidosSemana();
                // Llamar a initChart() después de obtener los datos de ventas
                this.initChart();
                this.actualizarGraficoProductosVendidos();
            }
        );
    }

    // Método para calcular las nuevas ventas desde la última semana
    calcularNuevasVentas() {
        // Filtrar las ventas de la semana
        const nuevasVentas = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= this.fechaLunes;
        });

        // Devolver la cantidad de ventas filtradas
        const cantidadNuevasVentas = nuevasVentas.length;
        return cantidadNuevasVentas;
    }

    // Método para calcular la fecha del lunes de esta semana
    calcularFechaLunes() {
        const diaSemanaActual = this.fechaActual.getDay(); // Obtener el día de la semana (0 para domingo, 1 para lunes, ...)
        this.fechaLunes = new Date(this.fechaActual);
        this.fechaLunes.setDate(this.fechaActual.getDate() - diaSemanaActual + 1);
    }

    // Método para avanzar una semana
    avanzarSemana() {
        this.fechaLunes.setDate(this.fechaLunes.getDate() + 7);
        // Vuelve a calcular las ventas con la nueva fecha del lunes
        // Aquí podrías llamar a un método que recargue las ventas para esta nueva semana si es necesario
        // this.calcularNuevasVentas();
    }

    // Método para retroceder una semana
    retrocederSemana() {
        this.fechaLunes.setDate(this.fechaLunes.getDate() - 7);
        // Vuelve a calcular las ventas con la nueva fecha del lunes
        // Aquí podrías llamar a un método que recargue las ventas para esta nueva semana si es necesario
        // this.calcularNuevasVentas();
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

    formatearGanancia(ganancia: number): string {
        return ganancia.toLocaleString('es-ES', { style: 'currency', currency: 'COP' });
    }

    async obtenerProductosMasVendidosSemana(): Promise<void> {
        const fechaActual = new Date();
        const diaSemanaActual = fechaActual.getDay(); // Obtener el día de la semana (0 para domingo, 1 para lunes, ...)

        // Obtener la fecha del lunes de esta semana
        const fechaLunes = new Date(fechaActual);
        fechaLunes.setDate(fechaActual.getDate() - diaSemanaActual);

        // Filtrar las ventas de la semana
        const ventasSemana = this.ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha_entrega_pedido);
            return fechaVenta >= fechaLunes;
        });

        // Seguir un proceso similar al anterior para contar las ventas de cada producto
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

        // Ordenar los productos más vendidos
        const sortedProducts = Array.from(productoCantidadMap.entries())
            .sort((b, a) => a[1] - b[1])
            .slice(0, 5); // Obtener los 5 productos más vendidos

        // Asignar los productos más vendidos a la propiedad `topSellingProducts`
        this.topSellingProducts = sortedProducts.map(([productName, quantitySold]) => ({
            name: productName,
            quantitySold: quantitySold
        }));
    }

    async actualizarGraficoProductosVendidos(): Promise<void> {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Llamar al método para obtener los productos más vendidos de la semana
        await this.obtenerProductosMasVendidosSemana();

        // Obtener los nombres y cantidades vendidas de los productos más vendidos
        const labels = this.topSellingProducts.map(product => product.name);
        const data = this.topSellingProducts.map(product => product.quantitySold);
        const cantidad = this.topSellingProducts.map(product => product.length);

        // Actualizar el gráfico con los datos de los productos más vendidos
        this.barData = {
            labels: ['Semana'],
            datasets: labels.map((productName, index) => ({
                label: productName,
                backgroundColor: documentStyle.getPropertyValue(`--primary-${800 - index * 100}`),
                borderColor: documentStyle.getPropertyValue(`--primary-${800 - index * 100}`),
                data: [data[index]]
            }))
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };
    }



    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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
