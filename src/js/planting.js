import underscore from 'underscore';
import EventEmitter from 'event-emitter';
import { Event, VIEW_TYPE, State } from 'const';
import ToolboxObjects from './toolboxobjects';
// import SessionDataModel from 'session-data';
import Session from './session';
import { default as CoordsModel, pegmanCoords, mapCoords } from './coords';
import Main from 'module/main/main';
import Plant from 'module/plant/plant';
import Toolbox from 'module/toolbox/toolbox';
import Map from 'module/map/map';
import LayersManager from 'module/layers-manager/layers-manager';
import { fetch } from 'global/window';
import { extend } from 'underscore';

export default class extends EventEmitter {
  constructor({viewType, plantUrl, manifestoUrl, ...options}) {
    super(options);

    const context = {
      app: this,
    };

    this._state = null;
    this.options = options;
    this.data = {
      session: new Session(null, context),
      coords: null,
      toolboxobjects: null,
    };

    if (viewType === VIEW_TYPE.Plant) {
      this.getPlant(plantUrl)
        .then(({manifesto, plant}) => {
          const { toolboxobjects } = manifesto;
          const coords = extend({}, mapCoords(plant), pegmanCoords(plant));

          this.data.coords = new CoordsModel(coords, context);
          this.data.toolboxobjects = new ToolboxObjects(toolboxobjects, context);
        })
        .then(() => {
          this._initializeViews();
        });
    } else {
      this.getManifesto(manifestoUrl)
        .then((manifesto) => {
          const { toolboxobjects } = manifesto;

          this.data.coords = new CoordsModel(mapCoords(manifesto), context);
          this.data.toolboxobjects = new ToolboxObjects(toolboxobjects, context);
        })
        .then(() => {
          this._initializeViews();
        });
    }
  }

  static get Viewer() {
    return VIEW_TYPE;
  }

  getPlant(plantUrl) {
    return new Promise((resolve, reject) => {
      fetch(plantUrl)
        .then(response => response.json())
        .then(({manifesto: manifestoUrl, ...plant}) => {
          this.getManifesto(manifestoUrl)
            .then((manifesto) => {
              resolve({ manifesto, plant });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  getManifesto(manifestoUrl) {
    return fetch(manifestoUrl)
      .then(response => response.json());
  }

  session() {
    return this.data.session;
  }

  coords() {
    return this.data.coords;
  }

  toolboxobjects() {
    return this.data.toolboxobjects;
  }

  setState(state) {
    const prevState = this._state;

    this._state = state;
    this.trigger(Event.STATE_CHANGED, this._state, prevState);

    return this;
  }

  getState() {
    return this._state;
  }

  _initializeViews() {
    this.main = new Main.View.Main({
      el: this.options.container,
      app: this,
    });
    // this.overlay = new Plant.View.Overlay({
    //   el: this.main.el.querySelector('.plantingjs-overlay'),
    //   collection: this.session().objects(),
    //   app: this,
    // });
    // this.toolbox = new Toolbox.View.Sidebar({
    //   el: this.main.el.querySelector('.plantingjs-toolbox'),
    //   app: this,
    // });
    this.map = new Map.View({
      el: this.main.el.querySelector('.plantingjs-google'),
      app: this,
    });
    // this.layersManager = new LayersManager.View.Menu({
    //   $parent: this.main.$proxy,
    //   collection: this.session().objects(),
    //   app: this,
    // });
  }

  initPlant(objects) {
    this.main.dialog.close();
    underscore.each(objects, (object) => {
      this.session()
        .objects()
        .add(object, {
          parse: true,
          app: this,
        });
    });
  }

  initViewer(options) {
    const panoOptions = {
      position: {
        lat: options.lat,
        lng: options.lng,
      },
      pov: {
        heading: options.heading,
        pitch: options.pitch,
        zoom: options.zoom,
      },
    };
    const objects = options.objects;

    this.initDefer
      .then(() => {
        this.setState(State.VIEWER);
        this.map.initializeViewer(panoOptions);

        if (objects &&
          objects.length) {
          this.initPlant(objects);
        }
      });
  }
}
