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
  @ViewChild('editAssignmentContainer') editAssignmentContainer: ElementRef;
  @ViewChild('assignmentDescription') assignmentDescription: ElementRef;
  @ViewChild('assignmentPriority') assignmentPriority: ElementRef;
  @ViewChild('assignmentDueDate') assignmentDueDate: ElementRef;
  @ViewChild('assignmentNotes') assignmentNotes: ElementRef;
  @ViewChild('assignmentStatus') assignmentStatus: ElementRef;

  private Map: any;
  private Basemap: any;
  private Home: any;
  private ScaleBar: any;
  private Compass: any;
  private Locate: any;
  private Expand: any;
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
  private Credential: any;
  private EsriConfig: any;


  private mapView: any;
  // private sceneView: any;
  private map: any;

  // private savedMapExtent: any;

  private readonly jsAPIVersion = '4.6';
  private readonly dataChunkSize = 1000;
  private readonly hideESRIAttribution = false;

  private readonly cachedCredentialKey: string = 'cachedCredential';
  private readonly savedMapExtentKey: string = 'savedMapExtent';

  private readonly azureGatekeeperServerUrl = 'https://api.dcpdigital.com/arcgis-test/';
  private readonly azureGatekeeperSubscriptionKey = '80bf224db0844a1aaeb564e2147e55dd';

  // private readonly dcpGISTokenServiceUrl = 'https://gistest.dcpmidstream.com/arcgis/tokens/generateToken';
  private readonly dcpGISTokenServiceUrl = 'https://gistest.dcpmidstream.com/arcgis/tokens/';
  // private readonly dcpGISServerUrl = 'https://gistest.dcpmidstream.com/';
  private readonly dcpGISServerUrl = 'https://gistest.dcpmidstream.com/arcgis/rest/services/';
  // private readonly dcpGISRestServicesRoute = 'arcgis/rest/services/';
  private readonly dcpGISCustomerDashboardFeatureServiceRoute = 'Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/';
  private readonly dcpGISServerUsername = 'Ext_CustDash_Test';
  private readonly dcpGISServerPassword = '7cSF9pyqD4C@S&&TP2KbvZQ$Mhfptn4v';
  // private dcpGISServerToken;

  private readonly plantLayerIndex = 0;
  private readonly boosterLayerIndex = 1;
  private readonly meterLayerIndex = 2;
  private readonly pipelineLayerIndex = 3;

  // ToDo: Wire up DCP Workforce URLs once we get the Enterprise authentication working.

  // private readonly demoWorkforceServerUrl = 'http://services8.arcgis.com';
  private readonly demoWorkforceServerUrl = 'http://www.arcgis.com';
  private readonly demoWorkforceTokenServiceUrl = 'https://www.arcgis.com/sharing/generateToken';
  private readonly demoWorkforceFeatureServiceUrl = 'http://services8.arcgis.com/gEL8e6Hiz8G7IYsL/arcgis/rest/services/';
  private readonly demoWorkforceWorkersRoute = 'workers_544df6ec0c314b44be0d949c1ad0ee7d/FeatureServer/';
  private readonly demoWorkforceDispatchersRoute = 'dispatchers_544df6ec0c314b44be0d949c1ad0ee7d/FeatureServer/';
  private readonly demoWorkforceAssignmentsRoute = 'assignments_544df6ec0c314b44be0d949c1ad0ee7d/FeatureServer/';
  private readonly demoWorkforceLocationsRoute = 'location_544df6ec0c314b44be0d949c1ad0ee7d/FeatureServer/';
  private readonly demoWorkforceAssignmentLayerTitle = 'Assignments 544df6ec0c314b44be0d949c1ad0ee7d';

  private readonly workersLayerIndex = 0;
  private readonly dispatchersLayerIndex = 0;
  private readonly assignmentsLayerIndex = 0;
  private readonly locationsLayerIndex = 0;

  // add home office layer

  private workforceAssignmentsFeatureLayer: any;
  private selectedAssignment: any;
  private editAssignmentExpand: any;

  // ToDo: Wire up show all assignments, show only my assignments toggle control, along with complete assignment checkbox

  private demoType: string;
  private sub: any;

  public userId;

  constructor(private route: ActivatedRoute) { }

  // ToDo: Wire up layer list/enabled layers caching.

  ngOnInit() {
    // setting global dojo config object to enable webgl rendering of arcgis feature layers
    window['dojoConfig'] = {
      has: {
        'esri-featurelayer-webgl': 1
      }
    };

    const options = {
      url: 'https://js.arcgis.com/' + this.jsAPIVersion + '/'
    };

    esriLoader.loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic',
      'esri/geometry/Point', 'esri/geometry/Extent', 'esri/layers/FeatureLayer', 'esri/widgets/ScaleBar', 'esri/widgets/Compass',
      'esri/layers/support/Field', 'esri/PopupTemplate', 'esri/symbols/PictureMarkerSymbol',
      'esri/widgets/Home', 'esri/widgets/Legend', 'esri/widgets/LayerList', 'esri/widgets/Zoom',
      'esri/widgets/Locate', 'esri/widgets/Expand', 'esri/Viewpoint', 'esri/geometry/Circle',
      'esri/symbols/SimpleFillSymbol', 'esri/tasks/support/Query', 'esri/geometry/support/webMercatorUtils',
      'esri/identity/IdentityManager', 'esri/identity/ServerInfo', 'esri/identity/Credential', 'esri/config'], options).then(
        (
          [
            Map, MapView, Graphic, Point, Extent, FeatureLayer, ScaleBar, Compass, Field, PopupTemplate,
            PictureMarkerSymbol, Home, Legend, LayerList, Zoom, Locate, Expand, Viewpoint, Circle, SimpleFillSymbol, Query,
            WebMercatorUtils, IdentityManager, ServerInfo, Credential, EsriConfig
          ]
        ) => {
          this.Map = Map; this.MapView = MapView; this.Graphic = Graphic; this.Point = Point; this.Extent = Extent;
          this.FeatureLayer = FeatureLayer; this.ScaleBar = ScaleBar; this.Compass = Compass; this.Field = Field;
          this.PopupTemplate = PopupTemplate; this.PictureMarkerSymbol = PictureMarkerSymbol;
          this.Home = Home; this.Legend = Legend; this.LayerList = LayerList; this.Zoom = Zoom; this.Locate = Locate;
          this.Expand = Expand; this.Viewpoint = Viewpoint; this.Circle = Circle;
          this.SimpleFillSymbol = SimpleFillSymbol; this.Query = Query; this.WebMercatorUtils = WebMercatorUtils;
          this.IdentityManager = IdentityManager; this.ServerInfo = ServerInfo; this.Credential = Credential;
          this.EsriConfig = EsriConfig;

          // Explicitly add DCP GIS Server URL to CORS Enabled Servers list so XHR calls can be made
          // between localhost (development client) and the remote DCP GIS Server.
          this.EsriConfig.request.corsEnabledServers.push(this.dcpGISServerUrl);

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

  public signOut() {
    this.clearCredential();
    this.clearMapExtent();

    location.reload();
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

    // let zoom = 7; // 7; // 6; // 5; // 4; // 3;

    let zoom;

    let initialExtent = homeExtent;

    const savedExtent = this.getMapExtent();
    if (savedExtent) {
      console.log('saved extent', savedExtent);

      initialExtent = savedExtent;
      // zoom = 0;
    } else {
      zoom = 7;
    }

    // const baseMap = 'streets-night-vector';
    // const baseMap = 'streets-vector'
    const baseMap = 'streets-navigation-vector';
    // const baseMap = 'streets-relief-vector';
    // const baseMap = 'topo-vector';

    this.map = new this.Map({
      basemap: baseMap
    });

    this.mapView = new this.MapView({
      container: this.mapViewContainer.nativeElement,
      // center: centerPoint,
      extent: initialExtent,
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

    const homeViewPoint = new this.Viewpoint({
      targetGeometry: homeExtent,
      scale: 2311162.217155
    });

    homeButton.viewpoint = homeViewPoint;

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

    this.mapView.ui.add(layerList, 'bottom-right');

    // this.editAssignmentExpand = new this.Expand({
    //   expandIconClass: 'esri-icon-edit',
    //   expandTooltip: 'Expand Edit',
    //   expanded: true,
    //   view: this.mapView,
    //   content: this.editAssignmentContainer.nativeElement
    // });

    // this.mapView.ui.add(this.editAssignmentExpand, 'top-right');


    this.mapView.when(() => {
      console.log('map view loaded!');

      console.log('map view scale', this.mapView.scale);

      // const savedMapExtent = this.getMapExtent();
      // if (savedMapExtent) {
      //   console.log('saved map extent', savedMapExtent);

      //   // this.mapView.extent = savedMapExtent;
      //   // this.zoomToExtent(savedMapExtent);
      //   setTimeout(() => { this.zoomToExtent(savedMapExtent); }, 2000);
      // }

      this.hideProgressBar();

      if (this.demoType) {
        this.loadDemo();
      }
    });

    this.mapView.on('click', event => {
      console.log('map view click event', event);
      this.unhighlightAssignment();

      this.mapView.hitTest(event.screenPoint).then(response => {
        console.log('hittest response', response);

        if (response.results.length > 0) {
          // Process Assignment Features
          const assignmentFeature = response.results.find(result =>
            result.graphic.layer
            && result.graphic.layer.title
            && result.graphic.layer.title === this.demoWorkforceAssignmentLayerTitle
            // && result.graphic.symbol
            // && result.graphic.symbol.type
            // && result.graphic.symbol.type !== 'text'
          );

          console.log('assignment feature', assignmentFeature);

          if (assignmentFeature) {
            const graphic = assignmentFeature.graphic;

            // alert(graphic.layer.title);

            const objectId = graphic.attributes[this.workforceAssignmentsFeatureLayer.objectIdField];

            if (objectId) {
              this.highlightAssignment(objectId);

              const attributes = graphic.attributes;
              const description = attributes.description;
              const priority = attributes.priority;
              const dueDate = attributes.dueDate;
              const notes = attributes.notes;
              const status = attributes.status;

              let priorityText;
              switch (priority) {
                case 0:
                  priorityText = '<font color="green">None</font>';
                  break;
                case 1:
                  priorityText = '<font color="blue">Low</font>';
                  break;
                case 2:
                  priorityText = '<font color="yellow">Medium</font>';
                  break;
                case 3:
                  priorityText = '<font color="orange">High</font>';
                  break;
                case 4:
                  priorityText = '<font color="red">Critical</font>';
                  break;
              }

              const date = new Date(dueDate);

              const dueDateText = date.toLocaleString();

              this.assignmentDescription.nativeElement.innerHTML = description;
              this.assignmentPriority.nativeElement.innerHTML = priorityText;
              this.assignmentDueDate.nativeElement.innerHTML = dueDateText;
              this.assignmentNotes.nativeElement.value = notes;
              this.assignmentStatus.nativeElement.value = status;

              this.editAssignmentContainer.nativeElement.style.display = 'inline'; // 'block';
            }
          }
        }
      });
    });

    this.mapView.watch('stationary', animating => {
      console.log('animating map view...', animating);

      if (this.mapView.stationary && this.mapView.extent && this.mapView.zoom > 0) {
        const currentExtent = this.mapView.extent;
        console.log('current extent', currentExtent);

        // const wkid = this.mapView.spatialReference.wkid;

        // const currentExtent = new this.Extent({
        //   xmax: extent.xmax,
        //   xmin: extent.xmin,
        //   ymax: extent.ymax,
        //   ymin: extent.ymin,
        //   spatialReference: {
        //     'wkid': wkid
        //   }
        // });

        this.saveMapExtent(currentExtent);
      }
    });
  }

  private unhighlightAssignment() {
    if (
      this.editAssignmentContainer !== null
      && typeof this.editAssignmentContainer !== 'undefined'
      && this.editAssignmentContainer.nativeElement !== null
      && typeof this.editAssignmentContainer.nativeElement !== 'undefined'
    ) {
      this.editAssignmentContainer.nativeElement.style.display = 'none';
    }

    this.assignmentDescription.nativeElement.innerHTML = null;
    this.assignmentPriority.nativeElement.innerHTML = null;
    this.assignmentDueDate.nativeElement.innerHTML = null;
    this.assignmentNotes.nativeElement.value = null;
    this.assignmentStatus.nativeElement.value = null;

    this.mapView.graphics.removeAll();
  }

  private highlightAssignment(objectId: any) {
    console.log('selected feature object id', objectId);
    const selectedSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      color: [0, 0, 0, 0],
      style: 'square',
      size: '40px',
      outline: {
        // color: [0, 255, 255, 1],
        color: [255, 255, 0, 1],
        width: '3px'
      }
    };

    const query = this.workforceAssignmentsFeatureLayer.createQuery();
    query.where = this.workforceAssignmentsFeatureLayer.objectIdField + ' = ' + objectId;

    this.workforceAssignmentsFeatureLayer.queryFeatures(query).then(results => {
      console.log('query results', results);
      if (results.features.length > 0) {
        const feature = results.features[0];
        // const attributes = feature.attributes;
        // const notes = attributes.notes;

        this.selectedAssignment = feature;

        console.log('selected assignment', this.selectedAssignment);
        this.selectedAssignment.symbol = selectedSymbol;

        this.mapView.graphics.add(this.selectedAssignment);
      }
    });
  }

  public closeEditAssignmentWindow() {
    this.editAssignmentContainer.nativeElement.style.display = 'none';
  }

  public saveAssignment() {
    console.log('saving assignment...');

    if (this.selectedAssignment) {
      this.selectedAssignment.attributes['notes'] = this.assignmentNotes.nativeElement.value;
      this.selectedAssignment.attributes['status'] = this.assignmentStatus.nativeElement.value;

      const edits = {
        updateFeatures: [this.selectedAssignment]
      };

      this.updateAssignment(edits);
    }
  }

  private updateAssignment(edits) {
    // this.unhighlightAssignment();

    this.workforceAssignmentsFeatureLayer.applyEdits(edits).then(results => {
      console.log('update assignment results', results);
      this.closeEditAssignmentWindow();

      // ToDo: Wire up attachments to the assignment update window. - got here

      // ToDo: Figure out how to refresh the updated feature layer
      // without having to reload/readd it so we dont have duplicate
      // layers

      // this.workforceAssignmentsFeatureLayer.refresh();

      // this.workforceAssignmentsFeatureLayer.load();

      this.mapView.popup.close();

      this.unhighlightAssignment();

      // const temp = this.workforceAssignmentsFeatureLayer;

      // this.removeLayer(this.workforceAssignmentsFeatureLayer);

      // this.workforceAssignmentsFeatureLayer.visible = false;

      this.loadWorkforceAssignments();

      // const existingLayer = this.map.findLayerById(this.workforceAssignmentsFeatureLayer.id);
      // if (existingLayer) {
      //   console.log('existing layer', existingLayer);
      //   existingLayer.refresh();
      // }

      // this.removeLayer(temp);
    }).catch((error) => {
      console.log('update assignment error', error);
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
        this.generateToken(
          this.dcpGISServerUsername,
          this.dcpGISServerPassword,
          this.dcpGISServerUrl,
          this.dcpGISTokenServiceUrl
        ).then((result) => {
          // alert('there');
          this.loadDCPFeatureLayers(true, false, false, true);
        });

        this.authenticateUser(
          this.demoWorkforceFeatureServiceUrl,
          this.demoWorkforceServerUrl,
          this.demoWorkforceTokenServiceUrl
        ).then((result) => {
          // alert('there');
          this.loadWorkforceFeatureLayers(false, true, true, true);
        });
        break;
      case 'gatekeeper-demo':
        // this.loadDCPFeatureLayers(true, true, true, true, true);
        break;
    }
  }

  private generateToken = (username, password, server, tokenServiceUrl): Promise<any> => {
    console.log('username', username);
    console.log('password', password);
    console.log('server', server);
    console.log('token service url', tokenServiceUrl);

    const serverInfo = new this.ServerInfo();
    serverInfo.server = server;
    serverInfo.tokenServiceUrl = tokenServiceUrl;

    const userInfo = {
      username: username,
      password: password
    };

    return new Promise((resolve, reject) => {
      this.IdentityManager.generateToken(serverInfo, userInfo).then((response) => {
        console.log('generate token response', response);

        this.IdentityManager.registerToken({ token: response.token, server: server, expires: response.expires });

        // ToDo: Move to calling code so the response handling is more generic
        // this.dcpGISServerToken = response.token;

        resolve();
      }).catch((error) => {
        console.log('generate token error', error);
      });
    });
  }

  private authenticateUser = (url, server, tokenServiceUrl): Promise<any> => {
    // ToDo: Figure out how to authenticate against enterprise on prem agol server

    console.log('url', url);
    console.log('server', server);
    console.log('token service url', tokenServiceUrl);

    const serverInfo = new this.ServerInfo();
    serverInfo.server = server;
    serverInfo.tokenServiceUrl = tokenServiceUrl;

    // ToDo: Clean up this method by consolidating duplicate code into centralized sub routines.
    return new Promise((resolve, reject) => {
      // this.clearCredential(); // uncomment to explicitly clear invalid credential/token from cache
      // resolve();

      const existingCredential = this.getCredential();

      if (existingCredential) {
        console.log('existing credential found...', existingCredential);

        // ToDo: Figure out how to automatically refresh the cached credentials token if its expired
        // so we're not reprompted and the application doesn't error out.
        // Calling credential.refreshToken() is throwing an 'undefined is not an object'
        // error in the arcgis js api.
        // existingCredential.refreshToken();

        this.IdentityManager.registerToken(existingCredential);
        this.userId = existingCredential.userId;

        this.IdentityManager.checkSignInStatus(url).then((response) => {
          console.log('check sign in status response', response);
          console.log('existing credentials valid, bypassing sign in protocol...');
          // this.IdentityManager.registerToken(existingCredential);
          // this.userId = existingCredential.userId;
          resolve();
        }).catch((error) => {
          console.log('check sign in status error', error);
          if (error.details.httpStatus === 498) { // invalid token
            console.log('existing credentials expired, signing in...');
            // alert('verify me');
            this.IdentityManager.signIn(url, serverInfo).then((response) => {
              // alert('here');
              console.log('sign in response', response);

              const newCredential = new this.Credential({
                server: response.server,
                userId: response.userId,
                token: response.token,
                expires: response.expires,
                isAdmin: response.isAdmin,
                ssl: response.ssl
              });

              // ToDo: Move to calling code so the response handling is more generic
              this.IdentityManager.registerToken(newCredential);
              this.saveCredential(newCredential);
              this.userId = newCredential.userId;
              resolve();
            }).catch((error) => {
              console.log('sign in error', error);
            });
          }
        });

        // this.IdentityManager.registerToken(existingCredential);
        // this.userId = existingCredential.userId;
        // resolve();
      } else {
        console.log('existing credentials not found, signing in...');
        this.IdentityManager.signIn(url, serverInfo).then((response) => {
          // alert('here');
          console.log('sign in response', response);

          const newCredential = new this.Credential({
            server: response.server,
            userId: response.userId,
            token: response.token,
            expires: response.expires,
            isAdmin: response.isAdmin,
            ssl: response.ssl
          });

          // ToDo: Move to calling code so the response handling is more generic
          this.IdentityManager.registerToken(newCredential);
          this.saveCredential(newCredential);
          this.userId = newCredential.userId;
          resolve();
        }).catch((error) => {
          console.log('sign in error', error);
        });
      }
    });
  }

  private saveCredential = (credential): void => {
    console.log('saving credential...', credential);

    localStorage.setItem(this.cachedCredentialKey, JSON.stringify(credential));
  }

  private clearCredential = (): void => {
    console.log('clearing cached credential');

    console.log('local storage before removal', localStorage);
    localStorage.removeItem(this.cachedCredentialKey);
    console.log('local storage after removal', localStorage);
  }

  private getCredential = (): any => {
    console.log('getting credential...');

    const cachedCredential = this.getFromLocalStorage(this.cachedCredentialKey);

    let credential;
    if (cachedCredential) {
      // ToDo: Figure out how to cast to this.Credential so we don't have to construct an object on the fly.
      credential = new this.Credential({
        server: cachedCredential.server,
        userId: cachedCredential.userId,
        token: cachedCredential.token,
        expires: cachedCredential.expires,
        isAdmin: cachedCredential.isAdmin,
        ssl: cachedCredential.ssl
      });
    }

    return credential;
  }

  private saveMapExtent = (mapExtent): void => {
    console.log('saving map extent...', mapExtent);

    localStorage.setItem(this.savedMapExtentKey, JSON.stringify(mapExtent));
  }

  private clearMapExtent = (): void => {
    console.log('clearing saved map extent');

    console.log('local storage before removal', localStorage);
    localStorage.removeItem(this.savedMapExtentKey);
    console.log('local storage after removal', localStorage);
  }

  private getMapExtent = (): any => {
    console.log('getting map extent...');

    const savedMapExtent = this.getFromLocalStorage(this.savedMapExtentKey);

    let mapExtent;
    if (savedMapExtent) {
      mapExtent = new this.Extent({
        xmax: savedMapExtent.xmax,
        xmin: savedMapExtent.xmin,
        ymax: savedMapExtent.ymax,
        ymin: savedMapExtent.ymin,
        spatialReference: {
          wkid: savedMapExtent.spatialReference.wkid
        }
      });
    }

    return mapExtent;
  }

  private getFromLocalStorage = (key): any => {
    return JSON.parse(localStorage.getItem(key)) || false;
  }

  private loadUSFeatureLayers = (): void => {
    this.loadUSStates();
    this.loadUSHighways();
    // this.loadUSCounties();
    this.loadUSCities();
  }

  private loadDCPFeatureLayers = (loadMeters?, loadPlants?, loadBoosters?, loadPipelines?, useGateKeeper?): void => {
    if (loadMeters) {
      this.loadDCPMeters(useGateKeeper);
    }
    if (loadPlants) {
      this.loadDCPPlants(useGateKeeper);
    }
    if (loadBoosters) {
      this.loadDCPBoosters(useGateKeeper);
    }
    if (loadPipelines) {
      this.loadDCPPipelines(useGateKeeper);
    }
  }

  private loadWorkforceFeatureLayers = (loadDispatchers?, loadLocations?, loadWorkers?, loadAssignments?): void => {
    // this.loadWorkforceBaselayers();
    if (loadDispatchers) {
      this.loadWorkforceDispatchers();
    }
    if (loadLocations) {
      this.loadWorkforceLocations();
    }
    if (loadWorkers) {
      this.loadWorkforceWorkers();
    }
    if (loadAssignments) {
      this.loadWorkforceAssignments();
    }
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

  private loadDCPPlants = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.dcpGISServerUrl;
    url += this.dcpGISCustomerDashboardFeatureServiceRoute + this.plantLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }
    // } else {
    //   url += '?token=' + this.dcpGISServerToken;
    // }

    console.log('plants feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      // token: this.dcpGISServerToken,
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

    this.map.add(featureLayer, this.plantLayerIndex);

    featureLayer.when(() => {
      console.log('dcp plants feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPBoosters = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.dcpGISServerUrl;
    url += this.dcpGISCustomerDashboardFeatureServiceRoute + this.boosterLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }
    // } else {
    //   url += '?token=' + this.dcpGISServerToken;
    // }

    console.log('booster feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      // token: this.dcpGISServerToken,
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

    this.map.add(featureLayer, this.boosterLayerIndex);

    featureLayer.when(() => {
      console.log('dcp boosters feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  private loadDCPMeters = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.dcpGISServerUrl;
    url += this.dcpGISCustomerDashboardFeatureServiceRoute + this.meterLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }
    // } else {
    //   url += '?token=' + this.dcpGISServerToken;
    // }

    console.log('meters feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      // token: this.dcpGISServerToken,
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

    this.map.add(featureLayer, this.meterLayerIndex);

    featureLayer.when(() => {
      console.log('dcp meters feature layer loaded!');
      // this.toggleLayerVisibility(featureLayer, true);
      this.hideProgressBar();
    });
  }

  // private loadDCPMetersOLD = (meterNumbers, renderPipelines): void => {
  //   this.showProgressBar();

  //   let meterCount = 0;

  //   if (meterNumbers !== null && typeof (meterNumbers) !== 'undefined') {
  //     meterCount = meterNumbers.length;
  //   }

  //   console.time('meters load time');
  //   // console.profile("Meters Load Profile");

  //   if (meterCount === 0) {
  //     const dcpMetersFeatureLayer = new this.FeatureLayer({
  //       url: 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/2',
  //       outFields: ['*'],
  //       visible: true,
  //       popupTemplate: { // autocasts as new PopupTemplate()
  //         // title: "<font color='#008000'>DCP Meters</font>",
  //         title: 'DCP Meter',

  //         // Set content elements in the order to display.
  //         // The first element displayed here is the fieldInfos.
  //         content: [
  //           {
  //             // It is also possible to set the fieldInfos outside of the content
  //             // directly in the popupTemplate. If no fieldInfos is specifically set
  //             // in the content, it defaults to whatever may be set within the popupTemplate.
  //             type: 'fields',
  //             fieldInfos: [
  //               {
  //                 fieldName: 'METER_NUMBER',
  //                 visible: true,
  //                 label: 'Meter Number',
  //                 format: {
  //                   places: 0,
  //                   digitSeparator: true
  //                 }
  //               },
  //               {
  //                 fieldName: 'METER_NAME',
  //                 visible: true,
  //                 label: 'Meter Name',
  //                 format: {
  //                   places: 0,
  //                   digitSeparator: true
  //                 }
  //               },
  //               {
  //                 fieldName: 'STATUS',
  //                 visible: true,
  //                 label: 'Status',
  //                 format: {
  //                   places: 0,
  //                   digitSeparator: true
  //                 }
  //               },
  //               {
  //                 fieldName: 'METER_STATUS',
  //                 visible: true,
  //                 label: 'Meter Status'
  //               },
  //               {
  //                 fieldName: 'COMPANY_NAME',
  //                 visible: true,
  //                 label: 'Company Name'
  //               },
  //               {
  //                 fieldName: 'SYSTEM',
  //                 visible: true,
  //                 label: 'System'
  //               }
  //             ]
  //           },
  //         ]
  //       },
  //     });

  //     this.map.add(dcpMetersFeatureLayer);
  //   } else {
  //     let i, j = 0;

  //     const dcpMeterFeatureLayers = [];

  //     // *Note: For performance reasons we split the meters into feature layers with 1000 features.
  //     for (i = 0, j = meterNumbers.length; i < j; i += this.dataChunkSize) {
  //       const slicedMeterNumbers = meterNumbers.slice(i, i + this.dataChunkSize);

  //       let counter = 0;
  //       const slicedMeterCount = slicedMeterNumbers.length;
  //       const lookupField = 'METER_NUMBER';
  //       let whereClause = '';

  //       whereClause += lookupField + ' IN (';
  //       slicedMeterNumbers.forEach(meterNumber => {
  //         counter++;
  //         whereClause += '\'' + meterNumber + '\'';
  //         if (counter < slicedMeterCount) {
  //           whereClause += ',';
  //         }
  //       });
  //       whereClause += ')';

  //       // console.log('Where Clause', whereClause);
  //       // console.log("Meter Count", meterCount);

  //       console.log('rendering ' + slicedMeterCount + '/' + meterCount + ' meters...');

  //       const dcpMetersFeatureLayer = new this.FeatureLayer({
  //         url: 'https://gistest.dcpmidstream.com/arcgis/rest/services/Ext_CustomerDashboard/Ext_Dashboard_Layers/MapServer/2',
  //         outFields: ['*'],
  //         visible: true,
  //         definitionExpression: whereClause,
  //         popupTemplate: { // autocasts as new PopupTemplate()
  //           // title: "<font color='#008000'>DCP Meters</font>",
  //           title: 'DCP Meter',

  //           // Set content elements in the order to display.
  //           // The first element displayed here is the fieldInfos.
  //           content: [
  //             {
  //               // It is also possible to set the fieldInfos outside of the content
  //               // directly in the popupTemplate. If no fieldInfos is specifically set
  //               // in the content, it defaults to whatever may be set within the popupTemplate.
  //               type: 'fields',
  //               fieldInfos: [
  //                 {
  //                   fieldName: 'METER_NUMBER',
  //                   visible: true,
  //                   label: 'Meter Number',
  //                   format: {
  //                     places: 0,
  //                     digitSeparator: true
  //                   }
  //                 },
  //                 {
  //                   fieldName: 'METER_NAME',
  //                   visible: true,
  //                   label: 'Meter Name',
  //                   format: {
  //                     places: 0,
  //                     digitSeparator: true
  //                   }
  //                 },
  //                 {
  //                   fieldName: 'STATUS',
  //                   visible: true,
  //                   label: 'Status',
  //                   format: {
  //                     places: 0,
  //                     digitSeparator: true
  //                   }
  //                 },
  //                 {
  //                   fieldName: 'METER_STATUS',
  //                   visible: true,
  //                   label: 'Meter Status'
  //                 },
  //                 {
  //                   fieldName: 'COMPANY_NAME',
  //                   visible: true,
  //                   label: 'Company Name'
  //                 },
  //                 {
  //                   fieldName: 'SYSTEM',
  //                   visible: true,
  //                   label: 'System'
  //                 }
  //               ]
  //             },
  //           ]
  //         },
  //       });

  //       this.map.add(dcpMetersFeatureLayer);
  //       dcpMeterFeatureLayers.push(dcpMetersFeatureLayer);

  //       dcpMetersFeatureLayer.then((results) => {
  //         // console.log('dcp meters feature layer loaded!');
  //         // dcpMetersFeatureLayer.visible = true;
  //         dcpMetersFeatureLayer.highlight();
  //       });
  //     }

  //     // let meterFeatureLayerExtentQueries = [];

  //     Promise.all(dcpMeterFeatureLayers).then((results) => {
  //       // alert('all done!');
  //       // console.log('all dcp meters feature layers loaded!')
  //       // console.log('Results', results);

  //       // let fullExtent = null;
  //       const meterFeatureLayerExtentQueries = [];

  //       results.forEach(featureLayer => {
  //         // console.log('Feature Layer', featureLayer);

  //         const meterFeatureLayerExtentQuery = featureLayer.queryExtent();
  //         meterFeatureLayerExtentQueries.push(meterFeatureLayerExtentQuery);

  //         meterFeatureLayerExtentQuery.then((results) => {
  //           // console.log('meter feature layer extent query executed!')
  //           // console.log('Results', results);
  //           // let featuresExtent = results.extent;
  //           // console.log('Features Extent', featuresExtent);
  //           // if (fullExtent === null)
  //           //   fullExtent = featuresExtent;
  //           // else
  //           //   fullExtent = fullExtent.union(featuresExtent);
  //         });
  //       });

  //       Promise.all(meterFeatureLayerExtentQueries).then((results) => {
  //         // console.log('all meter feature layer extent queries executed!');
  //         // console.log('Results', results);

  //         let fullExtent = null;
  //         let totalFeatureCount = 0;

  //         results.forEach(featureLayerQueryResult => {
  //           // console.log('Feature Layer Query Result', featureLayerQueryResult);

  //           const featureCount = featureLayerQueryResult.count;

  //           // console.log('drawing ' + slicedMeterCount + '/' + meterCount + ' meters...');

  //           totalFeatureCount += featureCount;

  //           const featuresExtent = featureLayerQueryResult.extent;
  //           // console.log('Features Extent', featuresExtent);
  //           if (fullExtent === null) {
  //             fullExtent = featuresExtent;
  //           } else {
  //             fullExtent = fullExtent.union(featuresExtent);
  //           }
  //         });

  //         // console.log('Full Extent', fullExtent);

  //         const convertedExtent = this.WebMercatorUtils.geographicToWebMercator(fullExtent);

  //         // console.log('Converted Extent', convertedExtent);

  //         // console.log('total features rendered =>', totalFeatureCount);

  //         console.log(totalFeatureCount + '/' + meterCount + ' meters rendered!');

  //         console.timeEnd('meters load time');
  //         // console.profileEnd();

  //         this.zoomToExtent(convertedExtent);

  //         // this.loadDCPPlants();
  //         // this.loadDCPBoosters();
  //         if (renderPipelines) {
  //           this.loadDCPPipelines();
  //         }

  //         // console.log('Map View', this.mapView);
  //       });


  //       // dcpMetersFeatureLayer.then((results) => {
  //       //   return dcpMetersFeatureLayer.queryExtent();
  //       // }).then((results) => {
  //       //   //console.log('Meter Layer Loaded', this.dcpMetersFeatureLayer.loaded);

  //       //   let featuresExtent = results.extent;

  //       //   console.log('Features Extent', featuresExtent);

  //       //   let convertedExtent = webMercatorUtils.geographicToWebMercator(featuresExtent);

  //       //   console.log('Converted Extent', convertedExtent);

  //       //   this.zoomToExtent(convertedExtent);

  //       // console.timeEnd("Meters Load Time");
  //       // console.profileEnd();
  //     });
  //   }

  //   // Promise.all(meterFeatureLayerExtentQueries).then((results) => {
  //   //   console.log('all meter feature layer extent queries executed!');
  //   //   console.log('Results', results);
  //   // });
  // }

  private loadDCPPipelines = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.dcpGISServerUrl;
    url += this.dcpGISCustomerDashboardFeatureServiceRoute + this.pipelineLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }
    // } else {
    //   url += '?token=' + this.dcpGISServerToken;
    // }

    console.log('pipelnes feature layer url', url);

    // ToDo: wire up load time metrics for these methods
    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      // token: this.dcpGISServerToken,
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

    this.map.add(featureLayer, this.pipelineLayerIndex);

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

  private loadWorkforceDispatchers = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.demoWorkforceFeatureServiceUrl;
    url += this.demoWorkforceDispatchersRoute + this.dispatchersLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }

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

  private loadWorkforceWorkers = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.demoWorkforceFeatureServiceUrl;
    url += this.demoWorkforceWorkersRoute + this.workersLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }

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

  private loadWorkforceLocations = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.demoWorkforceFeatureServiceUrl;
    url += this.demoWorkforceLocationsRoute + this.locationsLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }

    console.log('workforce locations feature layer url', url);

    const featureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupEnabled: true,
      popupTemplate: { // autocasts as new PopupTemplate()
        // title: "<font color='#008000'>DCP Meters</font>",
        title: 'Location',

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
                fieldName: 'ACCURACY',
                visible: true,
                label: 'Accuracy',
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              // {
              //   fieldName: 'STATUS',
              //   visible: true,
              //   label: 'Status',
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
              // {
              //   fieldName: 'TITLE',
              //   visible: true,
              //   label: 'Title',
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
              // {
              //   fieldName: 'CONTACTNUMBER',
              //   visible: true,
              //   label: 'Contact Number',
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
              // {
              //   fieldName: 'USERID',
              //   visible: true,
              //   label: 'User Id',
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
              // {
              //   fieldName: 'NOTES',
              //   visible: true,
              //   label: 'Notes',
              //   format: {
              //     places: 0,
              //     digitSeparator: true
              //   }
              // },
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
      console.log('workforce locations basemap feature layer loaded!');
      this.hideProgressBar();
    });
  }

  private loadWorkforceAssignments = (useGateKeeper?): void => {
    this.showProgressBar();

    let url = useGateKeeper ? this.azureGatekeeperServerUrl : this.demoWorkforceFeatureServiceUrl;
    url += this.demoWorkforceAssignmentsRoute + this.assignmentsLayerIndex;

    if (useGateKeeper) {
      url += '?subscription-key=' + this.azureGatekeeperSubscriptionKey;
    }
    console.log('workforce assignments feature layer url', url);

    this.workforceAssignmentsFeatureLayer = new this.FeatureLayer({
      url: url,
      outFields: ['*'],
      visible: true,
      popupEnabled: false,
      // dockEnabled: true,
      refreshInterval: 0.1,
      popupTemplate: { // autocasts as new PopupTemplate()
        title: 'Assignment',
        //   // title: "<font color='#008000'>DCP Meters</font>",
        //   title: 'Edit Assignment',
        //   content: `<div #editAssignmentContainer id='editAssignmentContainer'>
        //   <div id='attributeArea'>
        //     <label for='assignmentStatus'>Status:</label>
        //     <br>
        //     <select #assignmentStatus id='assignmentStatus'>
        //       <option value='0'>Unassigned</option>
        //       <option value='1'>Assigned</option>
        //       <option value='2'>In Progress</option>
        //       <option value='3'>Completed</option>
        //       <option value='4'>Declined</option>
        //       <option value='5'>Paused</option>
        //       <option value='6'>Canceled</option>
        //     </select>
        //     <br/>
        //     <label for='assignmentNotes'>Notes:</label>
        //     <br>
        //     <textarea #assignmentNotes id='assignmentNotes' rows='10' cols='30'>Enter notes here</textarea>
        //     <br>
        //     <input #btnSave id='btnSave' type='button' class='edit-button' value='Save' (click)='saveAssignment();'>
        //   </div>
        // </div>`,
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


    this.map.add(this.workforceAssignmentsFeatureLayer);

    // if (this.workforceAssignmentsFeatureLayer) {
    //   const existingLayer = this.map.findLayerById(this.workforceAssignmentsFeatureLayer.id);

    //   if (existingLayer) {
    //     alert(existingLayer.id);
    //     // existingLayer = this.workforceAssignmentsFeatureLayer;
    //     this.map.remove(existingLayer);
    //   }
    //   this.map.add(this.workforceAssignmentsFeatureLayer);
    //   //alert(this.workforceAssignmentsFeatureLayer.id);
    // }

    this.workforceAssignmentsFeatureLayer.when(() => {
      console.log('workforce workers basemap feature layer loaded!');
      this.hideProgressBar();
    });
  }

  private removeLayer = (layer): void => {
    this.map.remove(layer);
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
