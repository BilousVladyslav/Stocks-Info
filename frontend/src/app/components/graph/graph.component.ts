import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductInfoDetail } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import * as $ from 'jquery';
import * as CanvasJS from 'canvasjs/canvasjs.stock.min';
 
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
 
export class GraphComponent implements OnInit, OnDestroy {
  loaded = false;
  subscription: Subscription = new Subscription();
  productDetails: ProductInfoDetail = new ProductInfoDetail();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private authorizationService: AuthenticationService,
    ){
    authorizationService.token.subscribe(value => {
      if(value == null){
        this.router.navigate(['']);
      }
    });
    this.subscription.add(productService.RetrieveProduct(this.route.snapshot.params['id']).subscribe(
      data =>{
        this.loaded = true;
        this.productDetails = data;
        this.initChart();
      }
    ))
  }

  addSymbols(e){
    var suffixes = ["", "K", "M", "B"];
    var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
    if(order > suffixes.length - 1)
      order = suffixes.length - 1;
    var suffix = suffixes[order];
    return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
  }

  getDate(date: string){
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    return new Date(year + 3, month, day);
  }
  initChart(){
    let dataPoints1 : any[] = [], dataPoints2 : any[] = [], dataPoints3 : any[] = [];
    let dpsLength = 0;
    let chart = new CanvasJS.StockChart("chartContainer",{
      theme: "light2",
      exportEnabled: true,
      title:{
        text: this.productDetails.name! + " StockChart"
      },
      subtitles: [{
        text: "USD"
      }],
      charts: [{
        toolTip: {
          shared: true
        },
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function(e) {
            return "";
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: function(e) {
              return "";
            }
          }
        },
        axisY: {
          prefix: "$",
          tickLength: 0,
          title: "Price",
        },
        legend: {
          verticalAlign: "top"
        },
        data: [{
          name: "Price",
          yValueFormatString: "$#,###.##",
          xValueFormatString: "MMM DD YYYY",
          type: "candlestick",
          dataPoints : dataPoints1
        }]
      },{
        height: 100,
        toolTip: {
          shared: true
        },
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            valueFormatString: "MMM DD YYYY"
          }
        },
        axisY: {
          prefix: "$",
          tickLength: 0,
          title: "Volume",
          labelFormatter: this.addSymbols
        },
        legend: {
          verticalAlign: "top"
        },
        data: [{
          name: "Volume",
          yValueFormatString: "$#,###.##",
          xValueFormatString: "MMM DD YYYY",
          dataPoints : dataPoints2
        }]
      }],
      navigator: {
        data: [{
          dataPoints: dataPoints3
        }]
      }
    });
    for(var i = 0; i < this.productDetails.history!.length; i++){
      dataPoints1.push({x: new Date(this.productDetails.history![i].Date!), y: [this.productDetails.history![i].Open!, this.productDetails.history![i].High!, this.productDetails.history![i].Low!, this.productDetails.history![i].Close!]});;
      dataPoints2.push({x: new Date(this.productDetails.history![i].Date!), y: this.productDetails.history![i].Volume!});
      dataPoints3.push({x: new Date(this.productDetails.history![i].Date!), y: this.productDetails.history![i].Close!});
      // dataPoints1.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: [Number(data[i].open), Number(data[i].high), Number(data[i].low), Number(data[i].close)]});;
      // dataPoints2.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: Number(data[i].volume_usd)});
      // dataPoints3.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: Number(data[i].close)});
    }
    chart.render();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}