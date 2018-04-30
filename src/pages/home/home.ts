import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, Marker, LatLng, MyLocation } from '@ionic-native/google-maps';
import { ChartPage } from '../chart/chart';
import { CommChartPage } from '../comm-chart/comm-chart';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapReady: boolean = false;
  map: GoogleMap;
  location: LatLng = null;
  commodity='';
  year='';
  data1 ;
  addArr = [];
  id = [];
  lat = [];
  lng = [];
  loc ;
  calLocation ;
  coord:LatLng ;
  data2 ;
  clickedLocation ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps, private alertCtrl: AlertController, public geoloaction: Geolocation, public nativeGeocoder: NativeGeocoder, public http: HttpClient ) {

  }

  ionViewDidLoad() {
    this.createMap();
  }
 //Calculating location by using NativeGeocoder
 /*  calculateLocation(){
    let i=0;
    this.addArr.forEach(element => {
      this.nativeGeocoder.forwardGeocode(element)
    .then((coordinates: NativeGeocoderForwardResult) =>{ 
      console.log("{\n\"address\" : " + "\"" + element + "\"\n" + "\"latitude\" : " +  "\"" + coordinates[0].latitude + "\"\n" + "\"longitude\" : " +  "\"" + coordinates[0].longitude + "\"\n}" );
         // this.lat[i] = coordinates[0].latitude; 
          //this.lng[i++] = coordinates[0].longitude;
      }) 
     .catch((error: any) => console.log(error));

    });
   // let coord = new LatLng(13.0768342, 77.7886087);
    //this.addingMarker(coord);  
  }
 */

  loadData() {
    let fileName;
    fileName = this.commodity + "_" + this.year + ".json";
    let loca;
    loca = 'assets/data/' + this.commodity + "/" + fileName; 
    this.http.get(loca).subscribe(data => {
      console.log(data);
      this.data1 = data;
      //this.calculateAddress();
    });

    let fileName2;
    fileName2 = this.commodity + "_location.json";
    let loca2;
    loca2 = "assets/data/" + this.commodity + "/" + fileName2; 

    this.http.get(loca2).subscribe(data => {
      this.calLocation = data;
      this.data2 = data;
      console.log(data);
    });
  }

  createMap() {
    let prevLoc = new LatLng(13.0768342, 77.7886087);
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: prevLoc,
        zoom: 10,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map', mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
            this.mapReady = true;
      this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe( event => {
        this.location = event[0];
        console.log('--> ReportNewPage: User clicked location = ' + event[0]);
        this.map.clear();
        this.map.addMarker({
          title: 'Selected location',
          position: event[0]
        }).then((marker: Marker) => {
          marker.showInfoWindow();
        });
      });
    });
  
  }
 
  captureLocation() {
    if (!this.mapReady) {
      this.showAlert('Map is not yet ready', 'Map is not ready yet. Please try again.');
      return;
    }
  
    this.map.clear();

    this.map.getMyLocation().then((location: MyLocation) => {
      this.location = location.latLng;
      this.loc = location;
      console.log(' Device Location = ' + JSON.stringify(location, null, 2));
      this.map.animateCamera({
        target: location.latLng,
        zoom: 10,
        tilt: 30
      }).then(() => { 
        //Adding circle
        console.log("circle added"); 
        this.map.addCircle({
          'center' : location.latLng,
          'radius' : 50,
          'strokeColor' : '#2B65EC',
          'strokeWidth' : 5,
          'fillColor' : '#56A5EC'
        });

        //Adding marker
        this.map.addMarker({
          title: 'Your device location',
          snippet: 'Accurate to ' + location.accuracy + ' meters!',
          position: location.latLng,
        }).then((marker: Marker) => {
          marker.showInfoWindow();
        });

        //Adding multiple mandies
        this.calLocation.forEach(element => {
          this.coord = new LatLng(element.latitude,element.longitude);
          this.map.addMarker({
            title: element.address,
            position: this.coord,
          }).then((marker: Marker) => {
            marker.showInfoWindow();
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
              console.log("marker clicked");
              console.log(element.address);
              this.clickedLocation = element.document_id;
              console.log("location clicked ID - " + this.clickedLocation);
            });
          });
        });
      })
    }).catch(err => {
      this.showAlert('Try again', err.error_message);
      console.log(err);
    });

    
  }

  showAlert(alertTitle, alertMessage, enableBackdropDismiss: boolean = true, okHandler?) {
    let prompt = this.alertCtrl.create({
      title: alertTitle,
      message: alertMessage,
      buttons: [{
        text: 'Ok',
        handler: okHandler
      }],
      enableBackdropDismiss: enableBackdropDismiss
    });
    prompt.present();
  }

  chartPage() {
    let data = {
      commodity : this.commodity,
      state : this.year,
      data1 : this.data1,
      data2 : this.data2,
      clickedLocation : this.clickedLocation
    }
    this.navCtrl.push(ChartPage, data);
  }

  commChartPage() {
    this.navCtrl.push(CommChartPage);
  }
}