import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
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

        this.dashboardService.getVentas().subscribe(
            (data: any) => {
                console.log('Datos de ventas:', data);
                this.ventas = data.ventas; // Asignar el campo 'ventas' al arreglo this.ventas
                this.calcularNuevasVentas();
                const productoCantidadMap = this.obtenerProductosMasVendidos();
            }
        );
    }

    // Método para calcular las nuevas ventas desde la última semana
    calcularNuevasVentas() {
        const unaSemanaEnMilisegundos = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
        const fechaActual = new Date(); // Obtener la fecha actual

        // Calcular la fecha del lunes de esta semana
        const lunesDeEstaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() - fechaActual.getDay() + 1);

        // Calcular la fecha del domingo de esta semana
        const domingoDeEstaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + (6 - fechaActual.getDay()));

        // Filtrar las ventas que ocurrieron desde el lunes hasta el domingo de esta semana
        const nuevasVentas = this.ventas.filter(venta => {
            const fechaEntregaPedido = new Date(venta.fecha_entrega_pedido); // Convertir la fecha de entrega a objeto Date
            return fechaEntregaPedido >= lunesDeEstaSemana && fechaEntregaPedido <= domingoDeEstaSemana;
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
            .sort((a, b) => b[1].quantitySold - a[1].quantitySold)
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

        this.chartData = {
            labels: ['Enero', 'Febrero', 'Marzo', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
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
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
