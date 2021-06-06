import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as CanvasJS from 'canvasjs/canvasjs.stock.min';
 
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html'
})
 
export class GraphComponent implements OnInit {
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

  ngOnInit() {
    let dataPoints1 : any[] = [], dataPoints2 : any[] = [], dataPoints3 : any[] = [];
    let dpsLength = 0;
    let chart = new CanvasJS.StockChart("chartContainer",{
      theme: "light2",
      exportEnabled: true,
      title:{
        text:"StockChart with Price & Volume"
      },
      subtitles: [{
        text: "ETH/USD"
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
          title: "Etherium Price",
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
        }],
        slider: {
          minimum: new Date("2018-05-01"),
          maximum: new Date("2018-07-01")
        }
      }
    });
    $.getJSON("https://canvasjs.com/data/docs/ethusd2018.json", function(data) {
      for(var i = 0; i < data.length; i++){
        dataPoints1.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: [Number(data[i].open), Number(data[i].high), Number(data[i].low), Number(data[i].close)]});;
        dataPoints2.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: Number(data[i].volume_usd)});
        dataPoints3.push({x: new Date(new Date(data[i].date).setFullYear(new Date(data[i].date).getFullYear() + 3)), y: Number(data[i].close)});
      }
      chart.render();
    });
  }
}