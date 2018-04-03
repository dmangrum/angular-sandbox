import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import esriLoader from 'esri-loader';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
// import 'rxjs';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapViewContainer') private mapViewContainer: ElementRef;
  @ViewChild('progressBar') private progressBar: ElementRef;

  private Map: any;
  private Basemap: any;
  private Home: any;
  private ScaleBar: any;
  private Compass: any;
  private Locate: any;
  private Popup: any;
  private FeatureLayer: any;
  private PopupTemplate: any;
  private Legend: any;
  private MapView: any;
  private GraphicsLayer: any;
  private Graphic: any;
  private EsriFeatureLayer: any;
  private Query: any;
  private MapImageLayer: any;
  private ImageParameters: any;
  private Extent: any;
  private Field: any;
  private SpatialReference: any;
  private Point: any;
  private Polyline: any;
  private Polygon: any;
  private Circle: any;
  private SimpleMarkerSymbol: any;
  private SimpleLineSymbol: any;
  private SimpleFillSymbol: any;
  private PictureFillSymbol: any;
  private PictureMarkerSymbol: any;
  private Color: any;
  private WebMercatorUtils: any;
  private Zoom: any;
  private Viewpoint: any;
  private LayerList: any;
  private IdentityManager: any;
  private ServerInfo: any;

  private mapView: any;
  // private sceneView: any;
  private map: any;

  private readonly jsAPIVersion = '4.6';
  private readonly dataChunkSize = 1000;
  private readonly hideESRIAttribution = false;

  // ToDo: Move to config settings along with service url - see s-one
  private readonly extCustomerDashArcGISToken = 'O7iiomqrpZXsOGoQdjnOSdXx-lBEKkk9cUvdlgsesAVAy-pPJbgc1LDKkdVOH3Nv4rvJRIrNO-51kKMTEH5kTqfkFu6E9ETruZlplNv7fI38e2X_d_9hzS9SmPIvVA6x';

  private demoType: string;
  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const options = {
      url: 'https://js.arcgis.com/' + this.jsAPIVersion + '/'
    };

    esriLoader.loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic',
      'esri/geometry/Point', 'esri/geometry/Extent', 'esri/layers/FeatureLayer', 'esri/widgets/ScaleBar', 'esri/widgets/Compass',
      'esri/layers/support/Field', 'esri/PopupTemplate', 'esri/symbols/PictureMarkerSymbol',
      'esri/widgets/Home', 'esri/widgets/Legend', 'esri/widgets/LayerList', 'esri/widgets/Zoom',
      'esri/widgets/Locate', 'esri/Viewpoint', 'esri/geometry/Circle',
      'esri/symbols/SimpleFillSymbol', 'esri/tasks/support/Query', 'esri/geometry/support/webMercatorUtils',
      'esri/identity/IdentityManager', 'esri/identity/ServerInfo'], options).then(
        (
          [
            Map, MapView, Graphic, Point, Extent, FeatureLayer, ScaleBar, Compass, Field, PopupTemplate,
            PictureMarkerSymbol, Home, Legend, LayerList, Zoom, Locate, Viewpoint, Circle, SimpleFillSymbol, Query,
            WebMercatorUtils, IdentityManager, ServerInfo
          ]
        ) => {
          this.Map = Map; this.MapView = MapView; this.Graphic = Graphic; this.Point = Point; this.Extent = Extent;
          this.FeatureLayer = FeatureLayer; this.ScaleBar = ScaleBar; this.Compass = Compass; this.Field = Field;
          this.PopupTemplate = PopupTemplate; this.PictureMarkerSymbol = PictureMarkerSymbol;
          this.Home = Home; this.Legend = Legend; this.LayerList = LayerList; this.Zoom = Zoom; this.Locate = Locate;
          this.Viewpoint = Viewpoint; this.Circle = Circle;
          this.SimpleFillSymbol = SimpleFillSymbol; this.Query = Query; this.WebMercatorUtils = WebMercatorUtils;
          this.IdentityManager = IdentityManager; this.ServerInfo = ServerInfo;

          this.initializeMap();
        });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.sub = this.route.params.subscribe(params => {
      this.demoType = params['demoType']; // (+) converts string 'id' to a number
    });
  }

  private initializeMap() {
    this.showProgressBar();

    // United States Extent (WKID: 102100)
    // const xMin = -14601853.95;
    // const yMin = 1796785.96;
    // const xMax = -6814979.53;
    // const yMax = 7371348.5;
    // const wkid = 102100;

    // Houston, TX Extent (WKID: 102100)
    // const xMin = -1.0787061554464137E7;
    // const yMin = 3277462.903741703;
    // const xMax = -1.0483374918996217E7;
    // const yMax = 3644152.380667683;
    // const wkid = 102100;

    // Denver, CO Extent (WKID: 102100)
    const xMin = -1.1747632951692317E7;
    const yMin = 4943967.33700046;
    const xMax = -1.1738269415727396E7;
    const yMax = 4950617.358461262;
    const wkid = 102100;

    const homeExtent = new this.Extent({
      xmax: xMax,
      xmin: xMin,
      ymax: yMax,
      ymin: yMin,
      spatialReference: {
        'wkid': wkid
      }
    });

    // const baseMap = 'streets-night-vector';
    // const baseMap = 'streets-vector'
    const baseMap = 'streets-navigation-vector';
    // const baseMap = 'streets-relief-vector';
    // const baseMap = 'topo-vector';

    this.map = new this.Map({
      basemap: baseMap
    });

    const zoom = 7; // 7; // 6; // 5; // 4; // 3;

    this.mapView = new this.MapView({
      container: this.mapViewContainer.nativeElement,
      // center: centerPoint,
      extent: homeExtent,
      // scale: scale,
      // spatialReference: { wkid: 4326 },
      zoom: zoom,
      map: this.map,
      popup: {
        dockEnabled: false,
        dockOptions: {
          buttonEnabled: true,
          breakpoint: true
        }
      }
    });

    if (this.hideESRIAttribution) {
      this.mapView.ui.remove('attribution');
    }

    const homeButton = new this.Home({
      view: this.mapView
    });

    this.mapView.ui.add(homeButton, 'top-left');

    this.mapView.ui.remove('zoom');

    const zoomButton = new this.Zoom({
      view: this.mapView
    });

    this.mapView.ui.add(zoomButton, 'top-left');

    const locateButton = new this.Locate({
      view: this.mapView
    });

    this.mapView.ui.add(locateButton, 'top-left');

    const legend = new this.Legend({
      view: this.mapView
    });

    this.mapView.ui.add(legend, 'bottom-left');

    const scalebar = new this.ScaleBar ({
      view: this.mapView
    });

    this.mapView.ui.add(scalebar, 'bottom-left');

    const compass = new this.Compass({
      view: this.mapView
    });

    this.mapView.ui.add(compass, 'bottom-left');

    const layerList = new this.LayerList({
      view: this.mapView
    });

    this.mapView.ui.add(layerList, 'top-right');

    this.mapView.when(() => {
      console.log('map view loaded!');

      this.hideProgressBar();

      if (this.demoType) {
        this.loadDemo();
      }
    });
  }

  private loadDemo() {
    switch (this.demoType) {
      case 'us-demo':
        this.loadUSFeatureLayers();
        break;
      case 'dcp-demo':
        // this.authenticateUser();
        this.loadDCPFeatureLayers(true, true, true, true);
        break;
      case 'workforce-demo':
        // this.authenticateUser();
        this.loadDCPFeatureLayers(true, true, true, true);
        this.loadWorkforceFeatureLayers();
        break;
      case 'gatekeeper-demo':
        alert('here');
        // this.authenticateUser();
        // this.loadDCPFeatureLayers(true, true, true, true);
        break;
      // ToDo: wire up leak log demo that displays leaks on the map and allows
      // a user to click on them, open a dialog box, enter details & attachments (logging details)
      // and submit the edit back to the service/backend api 
      // need to troll the portal for the leak api or request the url & creds from mark/catherine
    }
  }

  private authenticateUser = (): void => {
    // ToDo: Figure out how to authenticate against enterprise on prem server
    // const identityManager = new this.IdentityManager();

    // const url = 'https://utility.arcgis.com/usrsvcs/servers/0e696ad6daf74ad194fc9530fc6af6f3/rest/services/Ext_DCP_Demo/Demo_DCP_Base/MapServer/';

    // const serverInfo = this.IdentityManager.findServerInfo(url);


    const serverInfos = [];

    const serverInfo = new this.ServerInfo();
    serverInfo.server = 'https://gistest.dcpmidstream.com/';
    serverInfo.tokenServiceUrl = 'https://gistest.dcpmidstream.com/arcgis/tokens/generateToken';

    serverInfos.push(serverInfo);

    // const serverInfo = new this.ServerInfo();
    // serverInfo.server = "http://services8.arcgis.com";
    // serverInfo.tokenServiceUrl = "https://www.arcgis.com/sharing/generateToken";



    this.IdentityManager.registerServers(serverInfos);


    // ToDo: Figure out how to generate token for all requests in session along with how to cache credentails for future use.

    console.log('identity manager', this.IdentityManager);

    const userId = 'dbmangrum_dev';
    const password = '******'; // todo: wire up credential prompt and caching

    const userInfo = {
      username: userId,
      password: password
    };

    console.log('dalton was here');

    this.IdentityManager.generateToken(serverInfo, userInfo).when((response) => {
      console.log('generate token response', response);
      // this.IdentifyManager.registerToken({
      //   server: serverInfo.server,
      //   userId: userId,
      //   token: response.token,
      //   expires: response.expires,
      //   ssl: response.ssl
      // });
    });
  }

  private loadUSFeatureLayers = (): void => {
    this.loadUSStates();
    this.loadUSHighways();
    // this.loadUSCounties();
    this.loadUSCities();
  }

  private loadDCPFeatureLayers = (loadMeters?, loadPlants?, loadBoosters?, loadPipelines?): void => {
    if (loadMeters) {
      this.loadDCPMeters();
    }
    if (loadPlants) {
      this.loadDCPPlants();
    }
    if (loadBoosters) {
      this.loadDCPBoosters();
    }
    if (loadPipelines) {
      this.loadDCPPipelines();
    }
  }

  private loadWorkforceFeatureLayers = (): void => {
    // this.loadWorkforceBaselayers();
    // this.loadWorkforceDispatchers();
    this.loadWorkforceWorkers();
    this.loadWorkforceAssignments();
  }

  private loadUSCities = (): void => {
    this.showProgressBar();

    const featureLayer = new this.FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
      outFields: ['*'],
      visible: true,
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('us cities feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadUSHighways = (): void => {
    this.showProgressBar();

    const featureLayer = new this.FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1',
      outFields: ['*'],
      visible: true,
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('us highways feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadUSStates = (): void => {
    this.showProgressBar();

    const featureLayer = new this.FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2',
      outFields: ['*'],
      visible: true,
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('us states feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadUSCounties = (): void => {
    this.showProgressBar();

    const featureLayer = new this.FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3',
      outFields: ['*'],
      visible: true,
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('us counties feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPPlants = (): void => {
    this.showProgressBar();

    const url = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/0';

    console.log('plants feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Plants</font>",
        title: 'DCP Plant',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'PLANT_ID',
                visible: true,
                label: 'Plant ID',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'NAME',
                visible: true,
                label: 'Plant Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'TYPE',
                visible: true,
                label: 'Plant Type',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'STATUS',
                visible: true,
                label: 'Plant Status'
              },
              {
                fieldName: 'LONGITUDE',
                visible: true,
                label: 'Longitude'
              },
              {
                fieldName: 'LATITUDE',
                visible: true,
                label: 'Latitude'
              }
            ]
          },
          //   {
          //     // You can also set a descriptive text element. This element
          //     // uses an attribute from the featurelayer which displays a
          //     // sentence giving the total amount of trees value within a
          //     // specified census block. Text elements can only be set within the content.
          //     type: "text",
          //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
          //   },
          //   {
          //     // You can set a media element within the popup as well. This
          //     // can be either an image or a chart. You specify this within
          //     // the mediaInfos. The following creates a pie chart in addition
          //     // to two separate images. The chart is also set up to work with
          //     // related tables. Similar to text elements, media can only be set within the content.
          //     type: "media",
          //     mediaInfos: [
          //       {
          //         title: "<b>Count by type</b>",
          //         type: "pie-chart",
          //         caption: "",
          //         value: {
          //           theme: "Grasshopper",
          //           fields: ["relationships/0/Point_Count_COMMON"],
          //           normalizeField: null,
          //           tooltipField: "relationships/0/COMMON"
          //         }
          //       },
          //       {
          //         title: "<b>Welcome to Beverly Hills</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
          //         }
          //       },
          //       {
          //         title: "<b>Palm tree lined street</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     // You can set a attachment element(s) within the popup as well.
          //     // Similar to text and media elements, attachments can only be set
          //     // within the content. Any attachmentInfos associated with the feature
          //     // will be listed in the popup.
          //     type: "attachments"
          //   }
        ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('dcp plants feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPBoosters = (): void => {
    this.showProgressBar();

    // const url = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/1';
    const url = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/1'; // ?token=' + this.extCustomerDashArcGISToken;
    // const url = 'https://api.dcpdigital.com/arcgis-test/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/1/?subscription-key=80bf224db0844a1aaeb564e2147e55dd';

    console.log('booster feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      // token: this.extCustomerDashArcGISToken, // todo: figure out why this token isnt working
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Boosters</font>",
        title: 'DCP Booster',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'BOOSTER_ID',
                visible: true,
                label: 'Booster ID',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'NAME',
                visible: true,
                label: 'Booster Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              // {
              //   fieldName: "TYPE",
              //   visible: true,
              //   label: "Plant Type",
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
              {
                fieldName: 'STATUS',
                visible: true,
                label: 'Booster Status'
              },
              {
                fieldName: 'LONGITUDE',
                visible: true,
                label: 'Longitude'
              },
              {
                fieldName: 'LATITUDE',
                visible: true,
                label: 'Latitude'
              }
            ]
          },
          //   {
          //     // You can also set a descriptive text element. This element
          //     // uses an attribute from the featurelayer which displays a
          //     // sentence giving the total amount of trees value within a
          //     // specified census block. Text elements can only be set within the content.
          //     type: "text",
          //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
          //   },
          //   {
          //     // You can set a media element within the popup as well. This
          //     // can be either an image or a chart. You specify this within
          //     // the mediaInfos. The following creates a pie chart in addition
          //     // to two separate images. The chart is also set up to work with
          //     // related tables. Similar to text elements, media can only be set within the content.
          //     type: "media",
          //     mediaInfos: [
          //       {
          //         title: "<b>Count by type</b>",
          //         type: "pie-chart",
          //         caption: "",
          //         value: {
          //           theme: "Grasshopper",
          //           fields: ["relationships/0/Point_Count_COMMON"],
          //           normalizeField: null,
          //           tooltipField: "relationships/0/COMMON"
          //         }
          //       },
          //       {
          //         title: "<b>Welcome to Beverly Hills</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
          //         }
          //       },
          //       {
          //         title: "<b>Palm tree lined street</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     // You can set a attachment element(s) within the popup as well.
          //     // Similar to text and media elements, attachments can only be set
          //     // within the content. Any attachmentInfos associated with the feature
          //     // will be listed in the popup.
          //     type: "attachments"
          //   }
        ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('dcp boosters feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPMeters = (): void => {
    this.showProgressBar();

    const url = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/2';

    console.log('meters feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      token: this.extCustomerDashArcGISToken,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Meters</font>",
        title: 'DCP Meter',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'METER_NUMBER',
                visible: true,
                label: 'Meter Number',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'METER_NAME',
                visible: true,
                label: 'Meter Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'STATUS',
                visible: true,
                label: 'Status',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'METER_STATUS',
                visible: true,
                label: 'Meter Status'
              },
              {
                fieldName: 'COMPANY_NAME',
                visible: true,
                label: 'Company Name'
              },
              {
                fieldName: 'SYSTEM',
                visible: true,
                label: 'System'
              }
            ]
          },
        ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('dcp meters feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPMetersOLD = (meterNumbers, renderPipelines): void => {
    this.showProgressBar();

    let meterCount = 0;

    if (meterNumbers !== null && typeof (meterNumbers) !== 'undefined') {
      meterCount = meterNumbers.length;
    }

    console.time('meters load time');
    // console.profile("Meters Load Profile");

    if (meterCount === 0) {
      const dcpMetersFeatureLayer = new this.FeatureLayer({
        url: 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/2',
        outFields: ['*'],
        visible: true,
        popupTemplate: { // autocasts as new PopupTemplate()
          // title: "<font color='#008000'>DCP Meters</font>",
          title: 'DCP Meter',

          // Set content elements in the order to display.
          // The first element displayed here is the fieldInfos.
          content: [
            {
              // It is also possible to set the fieldInfos outside of the content
              // directly in the popupTemplate. If no fieldInfos is specifically set
              // in the content, it defaults to whatever may be set within the popupTemplate.
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'METER_NUMBER',
                  visible: true,
                  label: 'Meter Number',
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                },
                {
                  fieldName: 'METER_NAME',
                  visible: true,
                  label: 'Meter Name',
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                },
                {
                  fieldName: 'STATUS',
                  visible: true,
                  label: 'Status',
                  format: {
                    places: 0,
                    digitSeparator: true
                  }
                },
                {
                  fieldName: 'METER_STATUS',
                  visible: true,
                  label: 'Meter Status'
                },
                {
                  fieldName: 'COMPANY_NAME',
                  visible: true,
                  label: 'Company Name'
                },
                {
                  fieldName: 'SYSTEM',
                  visible: true,
                  label: 'System'
                }
              ]
            },
          ]
        },
      });

      this.map.add(dcpMetersFeatureLayer);
    } else {
      let i, j = 0;

      const dcpMeterFeatureLayers = [];

      // *Note: For performance reasons we split the meters into feature layers with 1000 features.
      for (i = 0, j = meterNumbers.length; i < j; i += this.dataChunkSize) {
        const slicedMeterNumbers = meterNumbers.slice(i, i + this.dataChunkSize);

        let counter = 0;
        const slicedMeterCount = slicedMeterNumbers.length;
        const lookupField = 'METER_NUMBER';
        let whereClause = '';

        whereClause += lookupField + ' IN (';
        slicedMeterNumbers.forEach(meterNumber => {
          counter++;
          whereClause += '\'' + meterNumber + '\'';
          if (counter < slicedMeterCount) {
            whereClause += ',';
          }
        });
        whereClause += ')';

        // console.log('Where Clause', whereClause);
        // console.log("Meter Count", meterCount);

        console.log('rendering ' + slicedMeterCount + '/' + meterCount + ' meters...');

        const dcpMetersFeatureLayer = new this.FeatureLayer({
          url: 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/2',
          outFields: ['*'],
          visible: true,
          definitionExpression: whereClause,
          popupTemplate: { // autocasts as new PopupTemplate()
            // title: "<font color='#008000'>DCP Meters</font>",
            title: 'DCP Meter',

            // Set content elements in the order to display.
            // The first element displayed here is the fieldInfos.
            content: [
              {
                // It is also possible to set the fieldInfos outside of the content
                // directly in the popupTemplate. If no fieldInfos is specifically set
                // in the content, it defaults to whatever may be set within the popupTemplate.
                type: 'fields',
                fieldInfos: [
                  {
                    fieldName: 'METER_NUMBER',
                    visible: true,
                    label: 'Meter Number',
                    format: {
                      places: 0,
                      digitSeparator: true
                    }
                  },
                  {
                    fieldName: 'METER_NAME',
                    visible: true,
                    label: 'Meter Name',
                    format: {
                      places: 0,
                      digitSeparator: true
                    }
                  },
                  {
                    fieldName: 'STATUS',
                    visible: true,
                    label: 'Status',
                    format: {
                      places: 0,
                      digitSeparator: true
                    }
                  },
                  {
                    fieldName: 'METER_STATUS',
                    visible: true,
                    label: 'Meter Status'
                  },
                  {
                    fieldName: 'COMPANY_NAME',
                    visible: true,
                    label: 'Company Name'
                  },
                  {
                    fieldName: 'SYSTEM',
                    visible: true,
                    label: 'System'
                  }
                ]
              },
            ]
          },
        });

        this.map.add(dcpMetersFeatureLayer);
        dcpMeterFeatureLayers.push(dcpMetersFeatureLayer);

        dcpMetersFeatureLayer.then((results) => {
          // console.log('dcp meters feature layer loaded!');
          // dcpMetersFeatureLayer.visible = true;
          dcpMetersFeatureLayer.highlight();
        });
      }

      // let meterFeatureLayerExtentQueries = [];

      Promise.all(dcpMeterFeatureLayers).then((results) => {
        // alert('all done!');
        // console.log('all dcp meters feature layers loaded!')
        // console.log('Results', results);

        // let fullExtent = null;
        const meterFeatureLayerExtentQueries = [];

        results.forEach(featureLayer => {
          // console.log('Feature Layer', featureLayer);

          const meterFeatureLayerExtentQuery = featureLayer.queryExtent();
          meterFeatureLayerExtentQueries.push(meterFeatureLayerExtentQuery);

          meterFeatureLayerExtentQuery.then((results) => {
            // console.log('meter feature layer extent query executed!')
            // console.log('Results', results);
            // let featuresExtent = results.extent;
            // console.log('Features Extent', featuresExtent);
            // if (fullExtent === null)
            //   fullExtent = featuresExtent;
            // else
            //   fullExtent = fullExtent.union(featuresExtent);
          });
        });

        Promise.all(meterFeatureLayerExtentQueries).then((results) => {
          // console.log('all meter feature layer extent queries executed!');
          // console.log('Results', results);

          let fullExtent = null;
          let totalFeatureCount = 0;

          results.forEach(featureLayerQueryResult => {
            // console.log('Feature Layer Query Result', featureLayerQueryResult);

            const featureCount = featureLayerQueryResult.count;

            // console.log('drawing ' + slicedMeterCount + '/' + meterCount + ' meters...');

            totalFeatureCount += featureCount;

            const featuresExtent = featureLayerQueryResult.extent;
            // console.log('Features Extent', featuresExtent);
            if (fullExtent === null) {
              fullExtent = featuresExtent;
            } else {
              fullExtent = fullExtent.union(featuresExtent);
            }
          });

          // console.log('Full Extent', fullExtent);

          const convertedExtent = this.WebMercatorUtils.geographicToWebMercator(fullExtent);

          // console.log('Converted Extent', convertedExtent);

          // console.log('total features rendered =>', totalFeatureCount);

          console.log(totalFeatureCount + '/' + meterCount + ' meters rendered!');

          console.timeEnd('meters load time');
          // console.profileEnd();

          this.zoomToExtent(convertedExtent);

          // this.loadDCPPlants();
          // this.loadDCPBoosters();
          if (renderPipelines) {
            this.loadDCPPipelines();
          }

          // console.log('Map View', this.mapView);
        });


        // dcpMetersFeatureLayer.then((results) => {
        //   return dcpMetersFeatureLayer.queryExtent();
        // }).then((results) => {
        //   //console.log('Meter Layer Loaded', this.dcpMetersFeatureLayer.loaded);

        //   let featuresExtent = results.extent;

        //   console.log('Features Extent', featuresExtent);

        //   let convertedExtent = webMercatorUtils.geographicToWebMercator(featuresExtent);

        //   console.log('Converted Extent', convertedExtent);

        //   this.zoomToExtent(convertedExtent);

        // console.timeEnd("Meters Load Time");
        // console.profileEnd();
      });
    }

    // Promise.all(meterFeatureLayerExtentQueries).then((results) => {
    //   console.log('all meter feature layer extent queries executed!');
    //   console.log('Results', results);
    // });
  }

  private loadDCPPipelines = (): void => {
    this.showProgressBar();

    const url = 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/3';

    console.log('pipelnes feature layer url', url);

    // todo: wire up load time metrics for these methods
    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Meters</font>",
        title: 'DCP Pipeline',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'LINE_ID',
                visible: true,
                label: 'Pipeline ID',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'LINE_NO',
                visible: true,
                label: 'Pipeline Number',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'LINE_DESCRIPTION',
                visible: true,
                label: 'Pipeline Description',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'DIVISION_NAME',
                visible: true,
                label: 'Division Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'REGION_NAME',
                visible: true,
                label: 'Region Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'SYSTEM_NAME',
                visible: true,
                label: 'System Name'
              },
              {
                fieldName: 'SUBSYSTEM_NAME',
                visible: true,
                label: 'Sub System Name'
              }
            ]
          },
          //   {
          //     // You can also set a descriptive text element. This element
          //     // uses an attribute from the featurelayer which displays a
          //     // sentence giving the total amount of trees value within a
          //     // specified census block. Text elements can only be set within the content.
          //     type: "text",
          //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
          //   },
          //   {
          //     // You can set a media element within the popup as well. This
          //     // can be either an image or a chart. You specify this within
          //     // the mediaInfos. The following creates a pie chart in addition
          //     // to two separate images. The chart is also set up to work with
          //     // related tables. Similar to text elements, media can only be set within the content.
          //     type: "media",
          //     mediaInfos: [
          //       {
          //         title: "<b>Count by type</b>",
          //         type: "pie-chart",
          //         caption: "",
          //         value: {
          //           theme: "Grasshopper",
          //           fields: ["relationships/0/Point_Count_COMMON"],
          //           normalizeField: null,
          //           tooltipField: "relationships/0/COMMON"
          //         }
          //       },
          //       {
          //         title: "<b>Welcome to Beverly Hills</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
          //         }
          //       },
          //       {
          //         title: "<b>Palm tree lined street</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     // You can set a attachment element(s) within the popup as well.
          //     // Similar to text and media elements, attachments can only be set
          //     // within the content. Any attachmentInfos associated with the feature
          //     // will be listed in the popup.
          //     type: "attachments"
          //   }
        ]
      },
    });

    this.map.add(featureLayer, -1000);

    featureLayer.when(() => {
      console.log('dcp pipelines feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadWorkforceBaselayers = (): void => {
    this.showProgressBar();

    // ToDo: Figure out how to load the workforce base layers via the map server url.

    const url = 'https://utility.arcgis.com/usrsvcs/servers/0e696ad6daf74ad194fc9530fc6af6f3/rest/services/Ext_DCP_Demo/Demo_DCP_Base/MapServer/';

    console.log('workforce baselayers feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Plants</font>",
        title: 'Workforce Base Layers',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        // content: [
        //   {
        //     // It is also possible to set the fieldInfos outside of the content
        //     // directly in the popupTemplate. If no fieldInfos is specifically set
        //     // in the content, it defaults to whatever may be set within the popupTemplate.
        //     type: 'fields',
        //     fieldInfos: [
        //       {
        //         fieldName: 'PLANT_ID',
        //         visible: true,
        //         label: 'Plant ID',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'NAME',
        //         visible: true,
        //         label: 'Plant Name',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'TYPE',
        //         visible: true,
        //         label: 'Plant Type',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'STATUS',
        //         visible: true,
        //         label: 'Plant Status'
        //       },
        //       {
        //         fieldName: 'LONGITUDE',
        //         visible: true,
        //         label: 'Longitude'
        //       },
        //       {
        //         fieldName: 'LATITUDE',
        //         visible: true,
        //         label: 'Latitude'
        //       }
        //     ]
        //   },
        //   {
        //     // You can also set a descriptive text element. This element
        //     // uses an attribute from the featurelayer which displays a
        //     // sentence giving the total amount of trees value within a
        //     // specified census block. Text elements can only be set within the content.
        //     type: "text",
        //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
        //   },
        //   {
        //     // You can set a media element within the popup as well. This
        //     // can be either an image or a chart. You specify this within
        //     // the mediaInfos. The following creates a pie chart in addition
        //     // to two separate images. The chart is also set up to work with
        //     // related tables. Similar to text elements, media can only be set within the content.
        //     type: "media",
        //     mediaInfos: [
        //       {
        //         title: "<b>Count by type</b>",
        //         type: "pie-chart",
        //         caption: "",
        //         value: {
        //           theme: "Grasshopper",
        //           fields: ["relationships/0/Point_Count_COMMON"],
        //           normalizeField: null,
        //           tooltipField: "relationships/0/COMMON"
        //         }
        //       },
        //       {
        //         title: "<b>Welcome to Beverly Hills</b>",
        //         type: "image",
        //         value: {
        //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
        //         }
        //       },
        //       {
        //         title: "<b>Palm tree lined street</b>",
        //         type: "image",
        //         value: {
        //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
        //         }
        //       }
        //     ]
        //   },
        //   {
        //     // You can set a attachment element(s) within the popup as well.
        //     // Similar to text and media elements, attachments can only be set
        //     // within the content. Any attachmentInfos associated with the feature
        //     // will be listed in the popup.
        //     type: "attachments"
        //   }
        // ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('workforce baselayers feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadWorkforceDispatchers = (): void => {
    this.showProgressBar();

    // ToDo: Wire up DCP Workforce URLs once we get the Enterprise authentication working.

    const url = 'http://services8.arcgis.com/gEL8e6Hiz8G7IYsL/arcgis/rest/services/dispatchers_d05d9283cc0e45b6a08add9484c6c19c/FeatureServer/0';
    console.log('workforce workers feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Plants</font>",
        title: 'Dispatchers',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        // content: [
        //   {
        //     // It is also possible to set the fieldInfos outside of the content
        //     // directly in the popupTemplate. If no fieldInfos is specifically set
        //     // in the content, it defaults to whatever may be set within the popupTemplate.
        //     type: 'fields',
        //     fieldInfos: [
        //       {
        //         fieldName: 'PLANT_ID',
        //         visible: true,
        //         label: 'Plant ID',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'NAME',
        //         visible: true,
        //         label: 'Plant Name',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'TYPE',
        //         visible: true,
        //         label: 'Plant Type',
        //         format: {
        //           places: 0,
        //           digitSeparator: true
        //         }
        //       },
        //       {
        //         fieldName: 'STATUS',
        //         visible: true,
        //         label: 'Plant Status'
        //       },
        //       {
        //         fieldName: 'LONGITUDE',
        //         visible: true,
        //         label: 'Longitude'
        //       },
        //       {
        //         fieldName: 'LATITUDE',
        //         visible: true,
        //         label: 'Latitude'
        //       }
        //     ]
        //   },
        //   {
        //     // You can also set a descriptive text element. This element
        //     // uses an attribute from the featurelayer which displays a
        //     // sentence giving the total amount of trees value within a
        //     // specified census block. Text elements can only be set within the content.
        //     type: "text",
        //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
        //   },
        //   {
        //     // You can set a media element within the popup as well. This
        //     // can be either an image or a chart. You specify this within
        //     // the mediaInfos. The following creates a pie chart in addition
        //     // to two separate images. The chart is also set up to work with
        //     // related tables. Similar to text elements, media can only be set within the content.
        //     type: "media",
        //     mediaInfos: [
        //       {
        //         title: "<b>Count by type</b>",
        //         type: "pie-chart",
        //         caption: "",
        //         value: {
        //           theme: "Grasshopper",
        //           fields: ["relationships/0/Point_Count_COMMON"],
        //           normalizeField: null,
        //           tooltipField: "relationships/0/COMMON"
        //         }
        //       },
        //       {
        //         title: "<b>Welcome to Beverly Hills</b>",
        //         type: "image",
        //         value: {
        //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
        //         }
        //       },
        //       {
        //         title: "<b>Palm tree lined street</b>",
        //         type: "image",
        //         value: {
        //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
        //         }
        //       }
        //     ]
        //   },
        //   {
        //     // You can set a attachment element(s) within the popup as well.
        //     // Similar to text and media elements, attachments can only be set
        //     // within the content. Any attachmentInfos associated with the feature
        //     // will be listed in the popup.
        //     type: "attachments"
        //   }
        // ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('workforce dispatchers basemap feature layer loaded!');
      this.hideProgressBar();
    });
  }

  private loadWorkforceWorkers = (): void => {
    this.showProgressBar();

    // ToDo: Wire up DCP Workforce URLs once we get the Enterprise authentication working.

    const url = 'http://services8.arcgis.com/gEL8e6Hiz8G7IYsL/arcgis/rest/services/workers_d05d9283cc0e45b6a08add9484c6c19c/FeatureServer/0';
    console.log('workforce workers feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Meters</font>",
        title: 'Worker',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'NAME',
                visible: true,
                label: 'Name',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'STATUS',
                visible: true,
                label: 'Status',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'TITLE',
                visible: true,
                label: 'Title',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'CONTACTNUMBER',
                visible: true,
                label: 'Contact Number',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'USERID',
                visible: true,
                label: 'User Id',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'NOTES',
                visible: true,
                label: 'Notes',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'CREATIONDATE',
                visible: true,
                label: 'Creation Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'CREATOR',
                visible: true,
                label: 'Creator',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'EDITDATE',
                visible: true,
                label: 'Edit Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'EDITOR',
                visible: true,
                label: 'Editor',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
            ]
          },
          //   {
          //     // You can also set a descriptive text element. This element
          //     // uses an attribute from the featurelayer which displays a
          //     // sentence giving the total amount of trees value within a
          //     // specified census block. Text elements can only be set within the content.
          //     type: "text",
          //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
          //   },
          //   {
          //     // You can set a media element within the popup as well. This
          //     // can be either an image or a chart. You specify this within
          //     // the mediaInfos. The following creates a pie chart in addition
          //     // to two separate images. The chart is also set up to work with
          //     // related tables. Similar to text elements, media can only be set within the content.
          //     type: "media",
          //     mediaInfos: [
          //       {
          //         title: "<b>Count by type</b>",
          //         type: "pie-chart",
          //         caption: "",
          //         value: {
          //           theme: "Grasshopper",
          //           fields: ["relationships/0/Point_Count_COMMON"],
          //           normalizeField: null,
          //           tooltipField: "relationships/0/COMMON"
          //         }
          //       },
          //       {
          //         title: "<b>Welcome to Beverly Hills</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
          //         }
          //       },
          //       {
          //         title: "<b>Palm tree lined street</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     // You can set a attachment element(s) within the popup as well.
          //     // Similar to text and media elements, attachments can only be set
          //     // within the content. Any attachmentInfos associated with the feature
          //     // will be listed in the popup.
          //     type: "attachments"
          //   }
        ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('workforce workers basemap feature layer loaded!');
      this.hideProgressBar();
    });
  }

  private loadWorkforceAssignments = (): void => {
    this.showProgressBar();

    // ToDo: Wire up DCP Workforce URLs once we get the Enterprise authentication working.

    const url = 'http://services8.arcgis.com/gEL8e6Hiz8G7IYsL/arcgis/rest/services/assignments_d05d9283cc0e45b6a08add9484c6c19c/FeatureServer/0';
    console.log('workforce assignments feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Meters</font>",
        title: 'Assignment',

        // Set content elements in the order to display.
        // The first element displayed here is the fieldInfos.
        content: [
          {
            // It is also possible to set the fieldInfos outside of the content
            // directly in the popupTemplate. If no fieldInfos is specifically set
            // in the content, it defaults to whatever may be set within the popupTemplate.
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'DESCRIPTION',
                visible: true,
                label: 'Description',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'STATUS',
                visible: true,
                label: 'Status',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'NOTES',
                visible: true,
                label: 'Notes',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'PRIORITY',
                visible: true,
                label: 'Priority',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'ASSIGNMENTTYPE',
                visible: true,
                label: 'Assignment Type',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'WORKORDERID',
                visible: true,
                label: 'Work Order Id',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'DUEDATE',
                visible: true,
                label: 'Due Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'WORKERID',
                visible: true,
                label: 'Worker Id',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'LOCATION',
                visible: true,
                label: 'Location',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'DECLINEDCOMMENT',
                visible: true,
                label: 'Declined Comment'
              },
              {
                fieldName: 'ASSIGNEDDATE',
                visible: true,
                label: 'Assigned Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'ASSIGNMENTREAD',
                visible: true,
                label: 'Assignment Read',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'INPROGRESSDATE',
                visible: true,
                label: 'InProgress Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'COMPLETEDDATE',
                visible: true,
                label: 'Completed Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'DECLINEDDATE',
                visible: true,
                label: 'Declined Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'PAUSEDDATE',
                visible: true,
                label: 'Paused Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'DISPATCHERID',
                visible: true,
                label: 'Dispatcher Id',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'CREATIONDATE',
                visible: true,
                label: 'Creation Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'CREATOR',
                visible: true,
                label: 'Creator',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'EDITDATE',
                visible: true,
                label: 'Edit Date',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: 'EDITOR',
                visible: true,
                label: 'Editor',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
            ]
          },
          //   {
          //     // You can also set a descriptive text element. This element
          //     // uses an attribute from the featurelayer which displays a
          //     // sentence giving the total amount of trees value within a
          //     // specified census block. Text elements can only be set within the content.
          //     type: "text",
          //     text: "There are {Point_Count} trees within census block {BLOCKCE10}"
          //   },
          //   {
          //     // You can set a media element within the popup as well. This
          //     // can be either an image or a chart. You specify this within
          //     // the mediaInfos. The following creates a pie chart in addition
          //     // to two separate images. The chart is also set up to work with
          //     // related tables. Similar to text elements, media can only be set within the content.
          //     type: "media",
          //     mediaInfos: [
          //       {
          //         title: "<b>Count by type</b>",
          //         type: "pie-chart",
          //         caption: "",
          //         value: {
          //           theme: "Grasshopper",
          //           fields: ["relationships/0/Point_Count_COMMON"],
          //           normalizeField: null,
          //           tooltipField: "relationships/0/COMMON"
          //         }
          //       },
          //       {
          //         title: "<b>Welcome to Beverly Hills</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://www.beverlyhills.org/cbhfiles/storage/files/13203374121770673849/122707_039r_final.jpg"
          //         }
          //       },
          //       {
          //         title: "<b>Palm tree lined street</b>",
          //         type: "image",
          //         value: {
          //           sourceURL: "https://cdn.loc.gov/service/pnp/highsm/21600/21679r.jpg"
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     // You can set a attachment element(s) within the popup as well.
          //     // Similar to text and media elements, attachments can only be set
          //     // within the content. Any attachmentInfos associated with the feature
          //     // will be listed in the popup.
          //     type: "attachments"
          //   }
        ]
      },
    });

    this.map.add(featureLayer);

    featureLayer.when(() => {
      console.log('workforce workers basemap feature layer loaded!');
      this.hideProgressBar();
    });
  }

  private zoomToExtent = (extent): void => {
    // console.log('Extent', extent);
    // console.log('Map View WKID', this.mapView.spatialReference.wkid);
    // console.log('Extent WKID', extent.spatialReference.wkid);

    this.mapView.goTo(extent).then((results) => {
      // console.log('Results', results);
      this.mapView.zoom = this.mapView.zoom - 1;
      // setTimeout(() => {
      //   //this.mapView.zoom = 12;
      //   //this.mapView.zoom = this.mapView.zoom + 1;
      //   this.mapView.zoom = this.mapView.zoom - 1;
      //   console.log('Zoomed In!');
      //   //return true;
      // }, 2000);
      // this.mapView.zoom = 12;
      // this.mapView.zoom = this.mapView.zoom + 1;
    });
  }

  private toggleLayerVisibility = (featureLayer, visible): void => {
    // console.log('Feature Layer', featureLayer);
    if (featureLayer !== null || typeof featureLayer !== 'undefined') {
      featureLayer.visible = visible;
    }
  }

  private showProgressBar = (): void => {
    if (
      this.progressBar !== null
      && typeof this.progressBar !== 'undefined'
      && this.progressBar.nativeElement !== null
      && typeof this.progressBar.nativeElement !== 'undefined'
    ) {
      this.progressBar.nativeElement.style.display = 'inline';
    }
  }

  private hideProgressBar = (): void => {
    // this.logToConsole("Progress Bar", this.progressBar.nativeElement);
    if (
      this.progressBar !== null
      && typeof this.progressBar !== 'undefined'
      && this.progressBar.nativeElement !== null
      && typeof this.progressBar.nativeElement !== 'undefined'
    ) {
      this.progressBar.nativeElement.style.display = 'none';
    }
  }
}
