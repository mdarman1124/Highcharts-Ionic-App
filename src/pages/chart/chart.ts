import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import 'hammerjs';
import 'chartjs-plugin-zoom';

@Component({
    selector: 'page-chart',
    templateUrl: 'chart.html'
})
export class ChartPage {
    @ViewChild('lineCanvas') lineCanvas;
 
    lineChart: any;
    data1 ;
    data2 ;
    timeDate = [];
    maxPrice = [];
    minPrice = [];
    avgPrice = [];
    clickedLocation ;
    locations = [];
    
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
      console.log("chart page created !");
      console.log(this.navParams.get('commodity'));
      console.log(this.navParams.get('year'));
      this.data1 = this.navParams.get('data1');
      this.data2 = this.navParams.get('data2');
      console.log(this.data1);
      console.log(this.data2);
      this.clickedLocation = this.navParams.get('clickedLocation')
      console.log("location clicked ID - " + this.clickedLocation);
      let i=0;
      this.data2.forEach(element => {
          this.locations.push(this.data2[i++].document_id);
      });
      console.log(this.locations);
      i=0;
      let j=0;
      while(this.data1[i++].document_id != this.clickedLocation);
      while(this.locations[j++] != this.clickedLocation);
      i--;
      while(this.data1[i].document_id < this.locations[j]) {
        this.maxPrice.push(this.data1[i].max_price);
        this.minPrice.push(this.data1[i].min_price);
        this.avgPrice.push(this.data1[i].modal_price);
        this.timeDate.push(this.data1[i++].arrival_date);
      }
      console.log(this.maxPrice);
      console.log(this.minPrice);
      console.log(this.avgPrice);
      console.log(this.timeDate);
      

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
            type: 'line',
            data: {
                labels: this.timeDate,
                datasets: [
                    {
                        label: "MaxPrice",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255,0,0,0.4)",
                        borderColor: "rgba(255,0,0,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.maxPrice,
                        spanGaps: false,
                    },
                    {
                        label: "AvgPrice",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(0,255,0,0.4)",
                        borderColor: "rgba(0,255,0,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.avgPrice,
                        spanGaps: false,
                    },
                    {
                        label: "MinPrice",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(0,0,255,0.4)",
                        borderColor: "rgba(0,0,255,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.minPrice,
                        spanGaps: false,
                    }
                ]
            },
            options: {
                responsive: true,
                pan: {
                    enabled: true,
                    mode: 'x',
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: 0,
                        y: 0,
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: 10,
                        y: 6000,
                    }
                 },
                zoom: {
                    sensitivity:0.5,
                    drag: true,
                    enabled: true,
                    mode: 'x',
                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: 0,
                        y: 0,
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: 50,
                        y: 6000,
                    }
                }
            }
        });
    }
}