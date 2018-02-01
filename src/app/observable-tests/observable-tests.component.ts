import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/forkJoin';
import 'rxjs';

@Component({
  selector: 'observable-tests',
  styles: [`

  #container {
    height: 500px;
    position: relative;
    border: solid thin black;
    /*background-color: #191F26;*/
    background-color: #333333;
  }

  #header {
    color: white;
    margin-left: 10px;
  }

  #progressBar {
    background: url('/assets/images/progress_bar_224x34.gif');
    display: none;
    opacity: 1;
    /*background-color: #191F26;*/
    position: absolute;
    left: 0px; 
    bottom: 17px; 
    height: 34px;
    width: 224px;
  }
  
  #info {
    position: absolute; 
    left: 10px; 
    bottom: 10px; 
    color: white;
    font-size: 12px;
    z-index: 1000;
  }
`],
  template: `
<div #container id="container">
  <h1 id="header">Observable Tests</h1>
  <div #progressBar id="progressBar"></div>
  <span #info id="info"></span>    
</div>
`
})

export class ObservableTestsComponent implements OnInit {
  @ViewChild('info') private info: ElementRef;
  @ViewChild('progressBar') private progressBar: ElementRef;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {

    this.testDataChunking();
  }

  testDataChunking = (): void => {
    this.updateInfo('Testing data chunking...', null);

    let dataChunkSize = 1000;
    let chunkingObservables = [];

    let featureServiceUrl = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer';
    let featureLayerCount = 4;

    let allObservablesComplete = false;
    let queryObservables = [];

    this.showProgressBar();

    for (let i = 0; i < featureLayerCount; i++) {

      let worldExtent = {
        "xmin": -3.451219711014136E7,
        "ymin": -2.196894974829238E7,
        "xmax": 3.451219711012652E7,
        "ymax": 2.196894974830722E7,
        "spatialReference": {
          "wkid": 102100
        }
      };

      let fullExtent = '';
      const action = 'query';
      const responseFormat = 'json';
      const geometryType = 'esriGeometryEnvelope';

      let queryUrl = featureServiceUrl + '/' + i + '/' + action;

      let whereClause = '1=1';
      let outFields = '*';
      //let outFields = 'OBJECTID';
      let orderByClause = '';

      let requestParams = new HttpParams()
        .set('where', whereClause)
        //.set('geometryType', geometryType)
        //.set('geometry', JSON.stringify(fullExtent))
        //.set('outFields', outFields)
        //.set('outSR', outputSpatialReference)
        //.set('orderByFields', orderByClause)
        .set('f', responseFormat);

      this.updateInfo('querying', queryUrl);

      let queryObservable = this.executeHttpRequest(queryUrl, requestParams);

      queryObservables.push(queryObservable);

      queryObservable.subscribe(
        data => {
          if (data['error'] !== null && typeof data['error'] !== "undefined") {
            console.log('query observable failed =>', data['error']);
          } else {
            // this.updateInfo('query observable complete', data);

            // let chunkingObservables = [];
            let featureCount = 0;
            let features = data.features;

            if (features !== null && typeof features !== 'undefined') {
              featureCount = features.length;

              // TODo: Wire up logic to parse first and last unique identifier (OBJECTID or SHAPEID) and pass those parameters
              // to the sequential method so we can get data in 1000 record chunks

              // let chunkingObservable = this.executeHttpRequest(queryUrl, requestParams);

              // chunkingObservables.push(chunkingObservable);

              // queryObservable.subscribe(
              //   data => {
              //     this.updateInfo('chunking observable complete', null);

              //   }
              // );
            }

            this.updateInfo('query observable complete! (feature count = ' + featureCount + ')', data);
          }
        },
        (err: HttpErrorResponse) => {
          console.log('query observable failed =>', err);
          // if (err.error instanceof Error) {
          //   // A client-side or network error occurred. Handle it accordingly.
          //   console.log('An error occurred =>', err.error.message);
          // } else {
          //   // The backend returned an unsuccessful response code.
          //   // The response body may contain clues as to what went wrong,
          //   console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          // }
        }
      );
    }

    Observable.forkJoin<any>(queryObservables).subscribe(
      data => {
        //console.log(data);

        if (data['error'] !== null && typeof data['error'] !== "undefined") {
          console.log('all query observables failed =>', data['error']);
        } else {

          // Observable.forkJoin<any>(chunkingObservables).subscribe(
          //   data => {
          //     this.updateInfo('all chunking observables complete', data);
          //     allObservablesComplete = true;
          //   }
          // );

          // let i = 0;
          // while (!allObservablesComplete) {
          //   this.updateInfo('waiting for all observables to complete (' + i + ')', null);
          //   i++;
          // }

          this.updateInfo('all observables complete', data);

          this.hideProgressBar();
        }
      },
      (err: HttpErrorResponse) => {
        console.log('all query observables failed =>', err);
        // if (err.error instanceof Error) {
        //   // A client-side or network error occurred. Handle it accordingly.
        //   console.log('An error occurred =>', err.error.message);
        // } else {
        //   // The backend returned an unsuccessful response code.
        //   // The response body may contain clues as to what went wrong,
        //   console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        // }
      }
    );

    //this.hideProgressBar();
  }

  private executeHttpRequest = (requestUrl: string, requestParams: HttpParams): Observable<any> => {
    // let addApiKeyHeader = false;
    // if (this.apiKeyHeaderName !== null && this.apiKeyHeaderValue !== null) {
    //   addApiKeyHeader = true;
    // }

    //addApiKeyHeader = true; // testing

    let options = {};

    // if (addApiKeyHeader) {
    //   let headers = new HttpHeaders().set(this.apiKeyHeaderName, this.apiKeyHeaderValue);

    //   this.log('Headers =>', headers);

    //   options['headers'] = headers;
    // }

    if (requestParams !== null) {
      options['params'] = requestParams;
    }

    console.log('Request URL =>', requestUrl);
    console.log('Options =>', options);
    console.log('Http Client =>', this.httpClient);

    // ToDo: wire up http verb function parameter and switch statement to process it here

    let httpRequest = this.httpClient.get(requestUrl, options);

    console.log('Executing the following HTTP Request =>', requestUrl);

    console.log('Http Request =>', httpRequest);

    return httpRequest;
  }

  updateInfo = (message: string, data: any): void => {
    if (this.info !== null && typeof this.info !== "undefined" && this.info.nativeElement !== null && typeof this.info.nativeElement !== "undefined")
      this.info.nativeElement.innerHTML = message;

    console.log(message, data);
  }

  showProgressBar = (): void => {
    if (this.progressBar !== null && typeof this.progressBar !== "undefined" && this.progressBar.nativeElement !== null && typeof this.progressBar.nativeElement !== "undefined")
      this.progressBar.nativeElement.style.display = 'inline';
  }

  hideProgressBar = (): void => {
    if (this.progressBar !== null && typeof this.progressBar !== "undefined" && this.progressBar.nativeElement !== null && typeof this.progressBar.nativeElement !== "undefined")
      this.progressBar.nativeElement.style.display = 'none';
  }
}
