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
        const unaSemanaEnMilisegundos = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
        const fechaActual = new Date(); // Obtener la fecha actual

        // Calcular la fecha del domingo de la semana anterior
        const domingoDeLaSemanaAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - fechaActual.getDay() - 1);

        // Filtrar las ventas que ocurrieron desde el lunes hasta el domingo de la semana anterior
        const nuevasVentas = this.ventas.filter(venta => {
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido); // Convertir la fecha de entrega a objeto Date
            return fechaEntregaPedido.getDay() === 0;
        });

        const cantidadNuevasVentas = nuevasVentas.length;
        return cantidadNuevasVentas;
    }



    obtenerProductosMasVendidos(): void {
        const productoCantidadMap = new Map<string, {
            name: string,
            quantitySold: number,
            price: number
        }>();

        this.ventas.forEach(venta => {
            venta.detalle_pedido.forEach(detalle => {
                const nombreProducto = detalle.nombre_producto;
                const cantidadProducto = detalle.cantidad_producto;
                const precioProducto = detalle.precio_ico; // O detalle.precio_por_mayor_ico, según sea el precio que quieras mostrar

                if (productoCantidadMap.has(nombreProducto)) {
                    productoCantidadMap.get(nombreProducto)!.quantitySold += cantidadProducto;
                    productoCantidadMap.get(nombreProducto)!.price = precioProducto;
                } else {
                    productoCantidadMap.set(nombreProducto, {
                        name: nombreProducto,
                        quantitySold: cantidadProducto,
                        price: precioProducto
                    });
                }
            });
        });

        const sortedProducts = Array.from(productoCantidadMap.entries())
            .sort((b, a) => a[1].quantitySold - b[1].quantitySold)
            .slice(0, 5); // Obtener solo los 5 productos más vendidos

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
