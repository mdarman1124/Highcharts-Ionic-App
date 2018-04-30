import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import 'hammerjs';
import 'chartjs-plugin-zoom';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
declare var Highcharts : any

/**
 * Generated class for the CommChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comm-chart',
  templateUrl: 'comm-chart.html',
})
export class CommChartPage {

  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  data ;
  count: number;
  varArr = [];
  CommVariety = [];
  date = [];
  modal_prices = [];
  date2 = [];
  price1 = [];
  date1 = [];
  test1 = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommChartPage');  
    this.readCsvData();
  }

  readCsvData() {
    return this.http.get('assets/data/Onion/Onion-CSVar1.json').subscribe(
      data => { 
        //console.log(data);
        this.data =data;
        this.count = Object.keys(this.data).length;
        console.log(this.count);
        this.calculateDiffValues();
      }
    );
  }

  calculateDiffValues() {
    //To find out different varieties of commodity
    let match =0;
    this.varArr.push(this.data[0]);
    for(let i=1;i<this.count;i++) {
        match = 0;
        for(let j=0;j<this.varArr.length;j++) {
            if(this.data[i].variety == this.varArr[j].variety) {
                match = 1;
            }
        }
        if(match ==0){
            this.varArr.push(this.data[i]);
        }
    }
    console.log(this.varArr);

    //for extracting unique date
    for(let i=0;i<this.count;i++) {
        this.date[i]= this.data[i].date;
    }
    this.date = this.date.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    });
    
    //to arrange the different varieties of commodity in order
    for(let i=0;i<this.varArr.length;i++) {
      this.CommVariety[i] = this.data.filter(data => {
        if(data.variety == this.varArr[i].variety) {
          return true;
        }
       });
    }
    console.log(this.CommVariety);
    console.log(this.CommVariety[0][0].modal_price);

    for(let i=0;i<this.CommVariety[0].length;i++) {
        this.price1[i] = parseInt(this.CommVariety[0][i].modal_price);
        this.date1[i] = new Date(this.CommVariety[0][i].date).getTime();
        this.test1[i] = [this.date1[i],this.price1[i]];
    }
    this.test1.sort();
    console.log(this.price1);
    console.log(this.date1);
    console.log(this.test1);
    this.createChart();
  }

  createChart() {

    // create the chart
    Highcharts.stockChart('container',{
        chart: {
            alignTicks: false
        },
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'Commodities'
        },
        exporting: { enabled: false },
        series: [{
            type: 'line',
            name: 'Bangalore-samall',
            data: this.test1
        }],
    });
  }
}
