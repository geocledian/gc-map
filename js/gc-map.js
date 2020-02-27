/*
 Vue.js Geocledian map component
 created: 2019-11-04, jsommer
 last update: 2020-02-27, jsommer
 version: 0.9
*/
"use strict";

Date.prototype.addDays = function (a) {
  var b = new Date(this.valueOf());
  return b.setDate(b.getDate() + a), b
}

Date.prototype.simpleDate = function () {
  var a = this.getFullYear(),
    b = this.getMonth() + 1,
    c = this.getDate();
  return a + "-" + (1 === b.toString().length ? "0" + b : b) + "-" + (1 === c.toString().length ? "0" + c : c)
}

// surpress vue warnings
Vue.config.silent = false;

Vue.component('gc-map', {
  props: {
    mapid: {
      type: String,
      default: 'map1',
      required: true
    },
    basemap: {
      type: String,
      default: 'osm' //'google', 'arcgis', 'osm'
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
      type: String,
      default: 'geocledian.com'
    },
    parcelId: {
      default: -1
    },
    datasource: {
      type: String,
      default: "" // "landsat8", "sentinel2" or "" [all]
    },
    products: {
      type: String,
      default: "visible,vitality,variations,ndvi,ndwi,ndre1,ndre2,savi,evi2,cire,npcri"
    },
    imageChangeInterval: {
      type: String,
      default: "400" // milliseconds for change in video mode; check also .leaflet-image-layer class for fade in effect
    },
    tools: {
      type: String,
      default: "edit,delete,query,legend,downloadImage,productSelector,video"
    },
  },
  template: `<div :id="this.mapid" class="is-inline">

              <!-- watermark -->
              <div class="is-inline-block is-pulled-right" style="opacity: 0.65; position: relative; top: 0rem; margin-bottom: 0.5rem;">
                <span style="verticalalign: top; font-size: 0.7rem;">powered by</span><br>
                <img src="img/logo.png" alt="geo|cledian" style="width: 100px; margin: -10px 0;">
              </div>
            
              <p class="mapOptionsTitle is-size-6 is-orange is-inline-block" style="margin-bottom: 1.0rem; cursor: pointer;" 
                  v-on:click="toggleMapOptions">
               Map options 
               <i class="fas fa-angle-down fa-sm"></i>
              </p>
              <div :id="'mapOptions_'+mapid" class="mapOptions is-horizontal is-flex is-hidden">
              <div class="is-horizontal is-flex">
                <div class="field is-vertical">
                  <div class="field-label">
                    <label class="label has-text-left is-grey"> Colormap </label></div>
                  <div class="field-body">
                    <div class="select is-small">
                      <select id="selColormap" v-model="colormap" disabled>
                          <option value="" selected>Default</option>
                          <option value="variations">Variations (relative)</option>
                          <option value="vitality">Vitality</option>
                          <option value="ndvi">NDVI</option>
                          <option value="ndre1">NDRE1</option>
                          <option value="ndre2">NDRE2</option>
                          <option value="ndwi">NDWI</option>
                          <option value="ndwi_fc">NDWI Forest conifer</option>
                          <option value="ndwi_fb">NDWI Forest broadleaf</option>
                          <option value="savi">SAVI</option>
                          <option value="evi2">EVI2</option>
                          <option value="cire">CIRE</option>
                          <option value="npcri">NPCRI</option>
                          <option value="pseudocolor">Pseudocolor (relative)</option>
                          <option value="redblue">Redblue (relative)</option>
                          <option value="bluered">Bluered (relative)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- image options -->
                <div class="field is-vertical">
                <div class="field">
                  <div class="field-label">
                    <label class="label has-text-left is-grey"> Image Brightness </label></div>
                  <div class="field-body">
                    <div class="is-small">
                      <input :id="'inpBrightnessSlider_' + this.mapid" type="range" class="slider is-small is-orange" min="0.5" max="10.0" value="1.0" step="0.1" 
                          v-model="imageBrightness">
                      <button class="button is-small is-orange is-light" style="vertical-align: middle !important;" title="Reset" v-on:click="imageBrightness=1.0;">
                        <i class="fas fa-undo fa"></i>
                      </button>
                    </div>
                  </div>
              </div>
              <div class="field">
                <div class="field-label">
                  <label class="label has-text-left is-grey"> Transparency </label></div>
                <div class="field-body">
                  <div class="is-small">
                    <input :id="'inpTransparencySlider_'+ this.mapid" type="range" class="slider is-small is-orange" min="0.0" max="1.0" value="0.0" step="0.1"
                        v-model="imageTransparency">
                    <button class="button is-small is-orange is-light" style="vertical-align: middle !important;" title="Reset" v-on:click="imageTransparency=0.0;">
                      <i class="fas fa-undo fa"></i>
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div><!-- image options -->
            </div><!-- map options -->

            <div :id="'map_'+ this.mapid" class="gc-map">
            <!-- mobile: onclick and onblur events instead of onmouseover and onmouseout -->
            <div :id="'layerControl_'+mapid" class="layerControl" v-on:mouseover="growLayerControl" 
                                    v-on:mouseout="shrinkLayerControl" 
                                    v-on:click="growLayerControl" 
                                    v-on:blur="shrinkLayerControl">
              <button gc-map :id="'btnLayerControl_'+mapid" class="button is-light is-orange">
                <img src="img/layers.png" width="18px" height="18px">
              </button>
              <div :id="'layerControlContent_'+mapid" class="layerControlContent is-hidden" style="display: inline-grid;">
                <input :id="'rdBasemap1_'+mapid" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+mapid" 
                    value="arcgis" v-model="currentBasemap"  v-if="this.isArcGISValid">
                <label :for="'rdBasemap1_'+mapid" class="is-orange is-small"  v-if="this.isArcGISValid">ArcGIS Online</label>
                <input :id="'rdBasemap2_'+mapid" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+mapid" 
                value="osm" v-model="currentBasemap"> 
                <label :for="'rdBasemap2_'+mapid" class="is-orange is-small">OpenstreetMap</label>
                <input :id="'rdBasemap3_'+mapid" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+mapid"
                    value="google" v-model="currentBasemap" v-if="isGoogleValid"> 
                <label :for="'rdBasemap3_'+mapid" class="is-orange is-small" v-if="isGoogleValid">Google Hybrid</label>
              <hr>
                <input :id="'cbOperational1_'+mapid" type="checkbox" class="is-checkradio is-orange is-small"
                  v-model="parcelLayerVisible">
                <label :for="'cbOperational1_'+mapid" class="is-orange is-small">Parcels</label>
                <input :id="'cbOperational2_'+mapid" type="checkbox" class="is-checkradio is-orange is-small" 
                    v-model="imageLayerVisible"> 
                <label :for="'cbOperational2_'+mapid" class="is-orange is-small">Images</label>
              </div>
            </div><!-- layerControl -->

            <div :id="'divMapBtns_'+mapid" class="divMapBtns" style="padding-top: 42px; padding-left: 6px; float: left;">
                <button gc-map :id="'btnCreateParcel_'+mapid" title="Create New Parcel" class=" button is-light is-orange" 
                        v-on:click="createParcelAction" v-if="availableTools.includes('edit')">
                  <i class="fas fa-edit"></i>
                </button>
              
              <button gc-map :id="'btnDeleteParcel_'+mapid" title="Delete Parcel" class="button is-light is-orange" 
                      v-on:click="deleteParcelAction" v-if="availableTools.includes('delete')" disabled>
                <i class="fas fa-trash-alt"></i>
              </button>
              
                <button gc-map :id="'btnQueryIndexValue_'+mapid" title="Query Index Value" class="button is-light is-orange" 
                      v-on:click="queryIndexValueAction" v-if="availableTools.includes('query')" disabled>
                  <i class="fas fa-info-circle"></i>
                </button>
                <button gc-map :id="'btnToggleLegend_'+mapid" title="Toggle legend" class="button is-light is-orange"
                      v-on:click="toggleLegend"
                      v-on:mouseover=""
                      v-if="availableTools.includes('legend')">
                  <i class="fas fa-list-ul"></i>
                </button>
                <!-- URL will be injected here in the a-tags after sucessful load of raster in map -->
                <!-- Download is implemented this way because png is shown in browser per default; but it
                      should download the image directly -->
                <div :id="'downloadImage_'+mapid" class="downloadImage has-text-centered"
                                                                 v-if="availableTools.includes('downloadImage')"
                                                                  v-on:mouseover="growImageControl" 
                                                                  v-on:mouseout="shrinkImageControl" 
                                                                  v-on:click="growImageControl" 
                                                                  v-on:blur="shrinkImageControl">

                  <button gc-map :id="'btnDownloadImage_'+mapid" class="button is-orange is-light">
                    <i class="fas fa-download"></i>
                  </button>
                  <div :id="'downloadImageContent_'+mapid" class="is-hidden" style="display: inline-grid;">
                    <a gc-map :id="'btnDownloadImagePng_'+mapid" title="Download as PNG" class="button is-light is-orange" 
                        href="" download="" target="_blank" style="padding-left: 0.45rem; padding-right: 0.45rem;">
                        <!-- line-height: 0.75rem; -->
                        <div style="display: inline-grid; vertical-align: middle;">
                          <span class="is-size-7" style="line-height: 0.75rem;"><i class="fas fa-download"></i></span>
                          <span class="is-size-7" style="line-height: 0.75rem;">png</span>
                        </div>
                      </a>
                    <a gc-map :id="'btnDownloadImageTif_'+mapid" title="Download as TIF" class="button is-light is-orange" 
                      href="" download="" target="_blank" style="padding-left: 0.45rem; padding-right: 0.45rem;">
                      <div style="display: inline-grid; vertical-align: middle;">
                        <span class="is-size-7" style="line-height: 0.75rem;"><i class="fas fa-download"></i></span>
                        <span class="is-size-7" style="line-height: 0.75rem;">tif</span>
                      </div>
                    </a>
                  </span>
                  </div>
                </div>
              <!--/div -->
            </div>
            <div :id="'mapSpinner_'+mapid" class="mapSpinner spinner is-hidden">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
            <div :id="'mapLegendContent_'+mapid" class="mapLegendContent has-text-justified is-hidden">
            </div>
            <!-- product selector -->
            <div class="field product-selector"
                  v-if="availableTools.includes('productSelector')">
              <div class="field-body">
                <div class="select">
                <select v-model="selectedProduct" class="is-small">
                <option v-for="p in availableProducts" v-bind:value="p">
                  <span v-if="['vitality','variations','visible'].includes(p)">{{capitalize(p)}}</span>
                  <span v-else>{{p.toUpperCase()}}</span>
                </option>
                </select>
                </div>
              </div>
            </div> <!-- product selector -->
          </div><!-- map -->
          <!-- divCreateParcel -->
          <!-- flex-grow 4 is looks better for aligning label and field -->
          <div class="is-hidden" :id="'divCreateParcel_'+this.mapid" style="margin: 20px!important; flex-grow: 4 !important;"> 
              <p class="title is-5 is-orange"><i class="fas fa-plus-circle fa-lg"></i> New parcel attributes </p>  
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> API-Key </label></div>
                <div class="field-body">
                  <input type="text" class="input is-normal"
                          placeholder="[00000000-0000-0000-0000-00000000000]" v-model="newParcel.key">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> Crop </label></div>
                <div class="field-body">
                    <input type="text" class="input is-normal"
                          placeholder="[crop]" v-model="newParcel.crop">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> Seeding </label></div>
                <div class="field-body">
                    <input :id="'inpPlantDate_'+ mapid" type="text" class="input is-normal"
                          placeholder="[YYYY-MM-DD]" v-model="newParcel.planting" v-on:change="">
                </div>
              </div>
              <div class="field is-horizontal">
                  <div class="field-label is-normal"><label class="label is-grey has-text-left"> Harvest</label></div>
                  <div class="field-body">
                      <input :id="'inpHarvestDate_'+ mapid" type="text" class="input is-normal"
                            placeholder="[YYYY-MM-DD]" v-model="newParcel.harvest" v-on:change="">
                  </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> Name </label></div>
                <div class="field-body">
                    <input type="text" class="input is-normal"
                          placeholder="[name]" v-model="newParcel.name">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> Entity </label></div>
                <div class="field-body">
                  <input type="text" class="input is-normal"
                            placeholder="[entity]" v-model="newParcel.entity">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal"><label class="label is-grey has-text-left"> Promotion </label></div>
                <div class="field-body" style="position: relative; top: 0.5rem;"> <!-- centers checkbox -->
                  <input type="checkbox" class="content is-normal"
                            v-model="newParcel.promotion">
                </div>
              </div>
              <div class="has-text-centered">
                <button :id="'btnRegisterParcel_'+this.mapid" class="button is-light is-orange" v-on:click="registerParcel()">
                    <i class="fas fa-save fa-sm"></i><span class="content"> Register Parcel </span>
                </button>
              </div>
              <div :id="'divNewParcelMsg_'+this.mapid" class="notification is-light is-grey is-normal is-hidden">
                  
              </div>
            </div><!-- divCreateParcel -->
            <div :id="'timelineContainer_'+this.mapid" class="is-inline is-hidden" v-if="availableTools.includes('video')">
            <!-- video -->
            <div :id="'player_'+this.mapid" class="gc-player is-pulled-left" style="z-index: 1000; position: relative; left: 0px; bottom: 0px; margin-bottom: 0px!important;">
              <button id="btnPlayerOnOff" class="button is-outlined is-orange" 
                          v-on:click="startPauseVideo" style="height: 48px!important; width: 42px!important;" disabled>
                    <i class="fas fa-play"></i>
              </button>
              <!-- button id="btnPlayerBackward" class="button is-outlined is-orange is-small" v-on:click="backwardTimeSeries" 
                          >
                    <i class="fas fa-step-backward"></i>
              </button>
              <button id="btnPlayerForward" class="button is-outlined is-orange is-small" v-on:click="forwardTimeSeries" 
                      >
                <i class="fas fa-step-forward"></i>
              </button -->
            </div>
            <div :id="'timeline_'+this.mapid">
            </div>
            </div>
            </div><!-- mapid -->`,
  data: function () {
    return {
      mymap: {},
      osmBasemap: {},
      esriBasemap: {},
      googleHybridBasemap: {},
      baseMaps: {
        arcgis: {},
        osm: {},
        google: {}
      },
      geojsonFeature: {},
      parcelLayer: {},
      imageLayer: undefined,
      imageLayerGroup: {},
      drawnItems: {},
      drawControl: {},
      newParcel: {
        key: "",
        geometry: "",
        crop: "",
        planting: "",
        harvest: "",
        name: "",
        entity: "",
        id: "",
        status: ""
      },
      parcelLayerVisible: true,
      imageLayerVisible: true,
      colormap: "",
      imageBrightness: 1.0,
      imageTransparency: 0.0,
      currentBasemap: this.basemap,
      selectedProduct: "",
      currentRasterIndex: 0,
      parcels: [],
      apiKey: this.gcApikey,
      apiHost: this.gcHost,
      apiUrl: "https://" + this.gcHost + "/agknow/api/v3",
      offset: 0,
      pagingStep: 250,
      total_parcel_count: 250,
      mapLegendVisible: false,
      popup: undefined,
      lastLatLng: {
        lat: 0,
        lng: 0
      },
      timeline: undefined,
      isPlaying: false,
      myTimer: {},
      currentTimeSliderPosition: 0,
      inpPlantDatePicker: undefined,
      inpHarvestDatePicker: undefined,
      isGoogleValid: true, //will be set automatically to false if Google Maps API fails
      //
      // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
      //
      isArcGISValid: false //to be set manually from developer!
    }
  },
  computed: {
    currentParcelID: {
      get: function () {
        return this.parcelId;
      },
      set: function (newValue) {
        this.parcelId = newValue;
      }
    },
    availableProducts: {
      get: function () {
        //filter S2/LS8 products dependent on data source
        return this.filterDatasourceProductCompat(this.selectedSource, this.products.split(","));
      },
      set: function (newValue) {
        this.products = newValue;
      }
    },
    selectedSource: {
      get: function () {
        return this.datasource;
      },
      set: function (newValue) {
        this.datasource = newValue;
      }
    },
    availableTools: {
      get: function () {
        return (this.tools.split(","));
      },
      set: function (newValue) {
        this.tools = newValue;
      }
    }
  },
  created: function () {
  },

  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    
    console.debug("MOUNTED!");
    
    this.initMap();
  },
  watch: {
    currentBasemap: function (newValue, oldValue) {
      console.debug("event - currentBasemapChange");
      console.debug("new: " + newValue);

      let oldLayer = this.baseMaps[oldValue];
      this.mymap.removeLayer(oldLayer);
      let newLayer = this.baseMaps[newValue];
      this.mymap.addLayer(newLayer);
    },
    selectedProduct: function (newValue, oldValue) {

      if (newValue != oldValue) {
        console.debug("event - selectedProductChange");

        this.toggleColormapOptions(this.selectedProduct);

        //only if valid parcel id
        if (this.currentParcelID > 0 & this.parcels.length > 0) {
          this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.selectedSource);
        }

        if (newValue != "visible") {
          console.debug("enabling btnQueryIndexValue");
          //enable Query Index
          document.getElementById("btnQueryIndexValue_" + this.mapid).disabled = false;
          document.getElementById("btnToggleLegend_" + this.mapid).disabled = false;
        } else {
          console.debug("disabling btnQueryIndexValue");
          //end query mode if active
          try {this.disableQueryBtn();} catch (err) {}
          //disable button
          document.getElementById("btnQueryIndexValue_" + this.mapid).disabled = true;
          document.getElementById("btnToggleLegend_" + this.mapid).disabled = true;
        }
      }
    },
    selectedSource: function (newValue, oldValue) {

      console.debug("event - selectedSourceChange");

      //clear map and current raster first on change!
      this.map_removeAllRasters();
      let p = this.getCurrentParcel()
      p.timeseries = [];

      //only if valid parcel id
      if (this.currentParcelID > 0 & this.parcels.length > 0) {
        this.getParcelsProductData(this.getCurrentParcel().parcel_id, this.selectedProduct, this.selectedSource);

        //select first element
        this.currentRasterIndex = 0;
      }
    },
    parcelId: function (newValue, oldValue) {

      console.debug("event - parcelIdChange");

      this.handleCurrentParcelIDchange(newValue, oldValue);
    },
    currentRasterIndex: function (newValue, oldValue) {

      if (newValue != oldValue) {

        console.debug("event - currentRasterIndexChange");

        this.currentTimeSliderPosition = parseInt(newValue);

        this.showCurrentRaster();

        let p = this.getCurrentParcel();
        if (p) {
          this.showCurrentTimeMarker(p.timeseries[newValue].date);
        }

        /*if query index value is active */
        let isQueryActive = document.getElementById("btnQueryIndexValue_" + this.mapid).classList.contains("is-active");
        if (isQueryActive) {
          this.getIndexValueforCoordinate(this.lastLatLng);
        }

        // TODO synchro with chart if wanted
        //if (this.getCurrentRaster() && chart) {
        //    chartUpdateCurrentMarker();
        //}
      }
    },
    parcelLayerVisible: function (newValue, oldValue) {

      console.debug("event - parcelLayerVisibleChange");

      if (newValue === true) {
        this.mymap.addLayer(this.parcelLayer);
      } else {
        this.mymap.removeLayer(this.parcelLayer);
      }
    },
    imageLayerVisible: function (newValue, oldValue) {

      console.debug("event - imageLayerVisibleChange");
      if (newValue != oldValue) {
        if (newValue === true) {
          this.imageLayerGroup.addTo(this.mymap);
        } else {
          this.imageLayerGroup.removeFrom(this.mymap);
        }
      }
    },
    // used for parcels paging
    offset: function (newValue, oldValue) {

      console.debug("event - offsetChange");

      //this.getAllParcels(undefined, this.offset, "");
    },
    colormap: function (newValue, oldValue) {
      if (newValue != oldValue) {
          this.showCurrentRaster();
      }
    },
    imageBrightness: function (newValue, oldValue) {
            
      if (newValue != oldValue) {
        let filterString = "brightness("+newValue+") opacity("+(1.0 - this.imageTransparency)+")";
        // do this for all images in this widget
        let images = document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-image-layer");
        for (var i = 0; i < images.length; i++) {
          images[i].style.filter = filterString;
        }
      }
    },
    imageTransparency: function (newValue, oldValue) {
        
      if (newValue != oldValue) {
        let filterString = "brightness( "+this.imageBrightness +") opacity("+(1.0 - newValue)+")";
        // do this for all images in this widget
        let images = document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-image-layer");
        for (var i = 0; i < images.length; i++) {
          images[i].style.filter = filterString;
        }
      }
    }
  },
  methods: {
    initMap: function () {
      console.debug("initMap()");

      // now init map
      try {
        /* init map */
        this.mymap = L.map("map_"+this.mapid, {
          zoomControl: false
        });
      } catch (err) {
        // TODO notice for UI
        console.error("Error initializing the map with id '" + this.mapid + "'!");
  
        this.$el.innerHTML = "";
        this.$destroy();
        return;
      }   
      
      //init popup for index value lat/lon
      this.popup = L.popup({autoClose: true, closeOnClick: false}).setContent('<span class="is-large"><b>Index value: ');

      //set first of available products as selected
      this.selectedProduct = this.availableProducts[0];

      let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let osmMapLink = '<a href="https://www.openstreetmap.org/">OpenstreetMap</a>';
      this.osmBasemap = new L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmMapLink //+ wholink
      });

      if (this.isArcGISValid) {
        //
        // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
        //
        let esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        //TODO switch to esri Plugin for dynamic attribution on zoom level and map extent
        let esriMapLink = 'Powered by <a href="https://www.esri.com/">ESRI</a> | i-cubed, USDA, USGS, AEX, GeoEye, Getmapping,  Earthstar Geographics, Aerogrid, IGN, IGP, UPR-EGP, Microsoft, DigitalGlobe and the GIS User Community';
        this.esriBasemap = new L.tileLayer(esriUrl, {
          maxZoom: 20,
          attribution: esriMapLink
        });
      }

      // base maps
      try {
        this.googleHybridBasemap = L.gridLayer.googleMutant({
          type: 'hybrid' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });

        if (this.isArcGISValid) {
          this.baseMaps = {
            //
            // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
            //
            arcgis: this.esriBasemap,
            osm: this.osmBasemap,
            google: this.googleHybridBasemap
          };
        }
        else {
          this.baseMaps = {
            osm: this.osmBasemap,
            google: this.googleHybridBasemap
          };
        }
        
        //set base map
        if (this.currentBasemap == "google") {
          this.googleHybridBasemap.addTo(this.mymap);
        }
        if (this.currentBasemap == "osm") {
          this.osmBasemap.addTo(this.mymap);
        }
        if (this.isArcGISValid) {
          //
          // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
          //
          if (this.currentBasemap == "arcgis") {
            this.esriBasemap.addTo(this.mymap);
          }
        }
      }
      catch (ex) { //no google init possible - maybe API key is wrong!
        console.warn("Could not init Google API!");

        this.isGoogleValid = false;

        if (this.isArcGISValid) {
          // without google
          this.baseMaps = {
            //
            // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
            //
            arcgis: this.esriBasemap,
            osm: this.osmBasemap
          };
          if (this.currentBasemap == "osm") {
            this.osmBasemap.addTo(this.mymap);
          }
          if (this.currentBasemap == "arcgis") {
            //
            // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
            //
            this.esriBasemap.addTo(this.mymap);
          }
        }
        else {
          // without google & ArcGIS online
          this.baseMaps = {
            osm: this.osmBasemap
          };
          if (this.currentBasemap == "osm") {
            this.osmBasemap.addTo(this.mymap);
          }
        }
      }

      this.parcelLayer = L.geoJson().addTo(this.mymap);
      this.imageLayerGroup = L.layerGroup().addTo(this.mymap);
      this.drawnItems = new L.FeatureGroup().addTo(this.mymap);

      // add zoom control (position)
      new L.Control.Zoom({
        position: 'bottomright'
      }).addTo(this.mymap);

      // drawing event handler
      this.mymap.on('draw:created', function (e) {

        //clear first - otherwise we get a collection
        this.drawnItems.clearLayers();

        this.drawnItems.addLayer(e.layer);

        // set the first geometry to new parcel
        this.newParcel.geometry = this.drawnItems.toGeoJSON().features[0].geometry;

        //console.debug(this.newParcel.geometry);

      }.bind(this)); //bind vue component to function because of this context!

      // editing event handler
      this.mymap.on('draw:edited', function (e) {
        // update the geometry of the new parcel
        this.newParcel.geometry = e.layers.toGeoJSON().features[0].geometry;
        console.debug(this.newParcel.geometry);
      }.bind(this)); //bind vue component to function because of this context!

      //prevents the user from drawing more than one polygon
      this.mymap.on('draw:drawstart', function (e) {
        //clear first - otherwise we get a collection
        this.drawnItems.clearLayers();
      }.bind(this)); //bind vue component to function because of this context!

      // set map center to Landshut
      this.mymap.setView(new L.LatLng(48.535, 12.152), 10);

      this.addControlPlaceholders(this.mymap);

      // GeoSearch Control
      const provider = new window.GeoSearch.OpenStreetMapProvider();

      const searchControl = new window.GeoSearch.GeoSearchControl({
        provider: provider,
        //style: 'bar',
        autoComplete: true,
        autoCompleteDelay: 250,
        animateZoom: true,
        autoClose: true,
        searchLabel: 'Search location',
        keepResult: true,
        position: 'bottomright'
      });

      this.mymap.addControl(searchControl);

      //initial loading data
      this.getParcelTotalCount("");

      //space enables start stop of video
      document.addEventListener('keyup', (e) => {
        if (e.code === "Space") {       
          this.startPauseVideo();
        } 
      });

      //init datepickers - load external Javascript file in this component
      this.loadJSscript("css/bulma-ext/bulma-calendar.min.js", function() {

          this.inpPlantDatePicker = new bulmaCalendar( document.getElementById( 'inpPlantDate_'+this.mapid ), {
            startDate: new Date(), // Date selected by default
            dateFormat: 'yyyy-mm-dd', // the date format `field` value
            lang: 'en', // internationalization
            overlay: false,
            closeOnOverlayClick: true,
            closeOnSelect: true,
            // callback functions
            onSelect: function (e) { 
                        // hack +1 day
                        var a = new Date(e.valueOf() + 1000*3600*24);
                        this.newParcel.planting = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                        }.bind(this),
          });

          this.inpHarvestDatePicker = new bulmaCalendar( document.getElementById( 'inpHarvestDate_'+this.mapid ), {
            startDate: new Date(), // Date selected by default
            dateFormat: 'yyyy-mm-dd', // the date format `field` value
            lang: 'en', // internationalization
            overlay: false,
            closeOnOverlayClick: true,
            closeOnSelect: true,
            // callback functions
            onSelect: function (e) { 
                        // hack +1 day
                        var a = new Date(e.valueOf() + 1000*3600*24);
                        this.newParcel.harvest = a.toISOString().split("T")[0]; //ISO String splits at T between date and time
                        }.bind(this),
          });
        }.bind(this)
      );
    },
    getParcelTotalCount: function (filterString) {

      let params;

      if (filterString) {
        params = "/parcels?key=" + this.apiKey +
          filterString +
          "&count=True";
      } else {
        params = "/parcels?key=" + this.apiKey +
          "&count=True";
      }
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelTotalCount()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if ("count" in tmp) {

            this.total_parcel_count = tmp.count;

            // minimum of 250
            if (this.total_parcel_count < this.pagingStep) {
              this.pagingStep = this.total_parcel_count;
            } else {
              this.pagingStep = 250;
            }

            if (this.total_parcel_count == 0) {
              //clear details and map
              //clearGUI();
              return;
            } 
            else {
              // now get all parcels
              if (this.parcelId > 0) {
                this.getAllParcels(this.currentParcelID, this.offset, filterString);
              } 
              else {
                this.getAllParcels(undefined, this.offset, filterString);
              }
            }
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    getAllParcels: function (parcel_id, offset, filterString) {

      //download in chunks of n parcels
      let limit = 6000; //this.pagingStep;

      let params = "/parcels?key=" + this.apiKey + "&limit=" + limit; //set limit to maximum (default 1000)

      if (offset) {
        params = params + "&offset=" + offset;
      }
      if (filterString) {
        params = params + filterString;
      }
      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getAllParcels()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if (tmp.content == "key is not authorized") {
            return;
          }

          this.parcels = [];

          if (tmp.content.length == 0) {
            //clear details and map
            clearGUI();
            return;
          }

          for (var i = 0; i < tmp.content.length; i++) {
            var item = tmp.content[i];
            this.parcels.push(item);
          }

          try {
            // if parcel_id was given as an argument to the function
            // set this value as currentParcelID
            if (parcel_id) {
              this.currentParcelID = parcel_id;
              console.debug("setting " + parcel_id + " parcel id as current!");
              // hack needed to call the change explicitely if the filter includes the first element
              // of previously unfiltered parcels!
              // 1=1 -> no change in watch of vuejs
              this.handleCurrentParcelIDchange(-1, this.currentParcelID);
            } else {

              console.debug("setting first parcel as current!");

              this.currentParcelID = this.parcels[0].parcel_id;
              // hack needed to call the change explicitely if the filter includes the first element
              // of previously unfiltered parcels!
              // 1=1 -> no change in watch of vuejs
              if (this.currentParcelID == this.parcels[0].parcel_id) {
                this.handleCurrentParcelIDchange(-1, this.parcels[0].parcel_id);
              }

              console.debug("currentParcelID: " + this.currentParcelID);
            }
          } catch (err) {
            console.log("error selecting parcel_id");
            console.log(err);
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    // hack; see getAllParcels() for explanation
    handleCurrentParcelIDchange: function () {

      console.debug("methods - handleCurrentParcelIDchange");

      //disable time slider
      try { 
        this.disableTimeSlider(true);
      }
      catch (err) { console.debug("could not disable timeslider.");}

      //reset position of timeslider to first element
      this.currentRasterIndex = 0;

      //refresh messages
      //clear first!
      //this.messages = [];
      console.debug(this.currentParcelID);

      //only if valid parcel id
      if (this.currentParcelID > 0) {

        this.filterDetailData(); //refreshes also parcel's attributes & timeseries
        
        try { document.getElementById("btnDeleteParcel_" + this.mapid).disabled = false; } catch (err) {}
        if (this.selectedProduct != "visible") {
          try { document.getElementById("btnQueryIndexValue_" + this.mapid).disabled = false; } catch (err) {}
          try { document.getElementById("btnToggleLegend_" + this.mapid).disabled = false; } catch (err) {}
        }
      } else {
        try { document.getElementById("btnDeleteParcel_" + this.mapid).disabled = true; } catch (err) {}
        try { document.getElementById("btnQueryIndexValue_" + this.mapid).disabled = true; } catch (err) {}
        try { document.getElementById("btnToggleLegend_" + this.mapid).disabled = true; } catch (err) {}
      }
    },
    //returns detailed data from REST service by passing the selected parcel_id
    filterDetailData: function () {

      console.debug("methods - filterDetailData");

      this.getParcelsAttributes(this.currentParcelID);
    },
    getParcelsAttributes(parcel_id) {

      var params = "/parcels/" + parcel_id + "/?key=" + this.apiKey; 
      var xmlHttp = new XMLHttpRequest();
      var async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsAttributes()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);
          var row = this.getCurrentParcel();

          if (tmp.content.length > 0) {
            console.debug(row);
            // add new attributes via Vue.set
            // it's ok always to use the first element, because it has been filtered
            // by unique parcel_id
            Vue.set(row, "area", tmp.content[0].area);
            Vue.set(row, "planting", tmp.content[0].planting);
            Vue.set(row, "harvest", tmp.content[0].harvest);
            Vue.set(row, "startdate", tmp.content[0].startdate);
            Vue.set(row, "enddate", tmp.content[0].enddate);
            Vue.set(row, "lastupdate", tmp.content[0].lastupdate);
            Vue.set(row, "centroid", tmp.content[0].centroid);
            Vue.set(row, "geometry", tmp.content[0].geometry);

            this.map_addParcel(tmp.content[0].geometry);

            this.getParcelsProductData(parcel_id, this.selectedProduct, this.selectedSource);
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    getParcelsProductData: function (parcel_id, productName, source) {

      //show spinner
      document.getElementById("mapSpinner_" + this.mapid).classList.remove("is-hidden");

      let params = "/parcels/" + parcel_id + "/" + productName + "?key=" +
        this.apiKey + "&source=" + source +
        "&order=date";

      let xmlHttp = new XMLHttpRequest();
      let async = true;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsProductData()");
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          //console.log(xmlHttp.responseText);
          let tmp = JSON.parse(xmlHttp.responseText);
          let row = this.getCurrentParcel();

          if (tmp.content.length > 0) {
            // add new attributes via Vue.set

            // one parcel can have 1-n rasters of the same product (time series!)
            // add all rasters (=time series)
            Vue.set(row, "timeseries", tmp.content); //url + tmp.content[0].png + "?key=" + key);

            //set max value of timeslider
            //document.getElementById("inpTimeSlider").max = tmp.content.length -1;

            try{ 
              //init only if in Non-Edit mode
              if (!document.getElementById("btnCreateParcel_" + this.mapid).classList.contains("is-active"))
                this.initTimeline();
            } 
            catch (err) {}

            //show raster in map
            this.showCurrentRaster();

            //enable time slider buttons
            try { this.disableTimeSlider(false); } catch (err) {}

            //hide spinner
            document.getElementById("mapSpinner_" + this.mapid).classList.add("is-hidden");
          }

        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    getCurrentParcel: function () {

      if (this.currentParcelID > 0) {
        // parcel_id assumed unique, so return only the first
        // compare strings
        return this.parcels.filter(p => p.parcel_id + "" == this.currentParcelID + "")[0];
      }
    },
    getTimeSeries: function () {

      if (this.currentParcelID > 0) {
        // parcel_id assumed unique, so return only the first
        // compare strings
        var p = this.getCurrentParcel();
        if (p.timeseries) {
          return p.timeseries;
        }
      }
    },
    getCurrentRaster: function () {

      console.debug("methods - getCurrentRaster");

      if (this.currentParcelID > 0) {
        // parcel_id assumed unique, so return only the first
        // compare strings
        var p = this.getCurrentParcel();
        if (p) {
          if (p.timeseries) {
            return p.timeseries[this.currentRasterIndex];
          }
        }
      }
    },
    showCurrentRaster: function () {

      console.debug("methods - showCurrentRaster");

      var row = this.getCurrentRaster();
      if (row) {
        this.map_addRaster(this.apiUrl + row.png + "?key=" + this.apiKey + "&colormap=" + this.colormap, row.bounds);

        if (this.mapLegendVisible) {
          this.showLegend(row);
        }

        // prepare download link for image
        try {
          this.prepareDownloadImageLink();
        }
        catch (err) {
          console.debug("could not prepare download image link.");
        }
      }
    },
    showLegend: function (row) {
      //no legend on product "visible"
      if (row.product != "visible") {
        //url
        var parcel_id = this.currentParcelID;
        var legendUrl = this.apiUrl + "/parcels/" + parcel_id + "/" + row.product + "/" + row.source + "/" +
          row.raster_id + ".png" + "?key=" + this.apiKey + "&legend=true" + "&colormap=" + this.colormap;

        //Show requests on the DEBUG console for developers
        console.debug("showLegend()");
        console.debug("GET " + legendUrl);

        let downloadingImage;
        if (row.product == "variations") {
          document.getElementById("mapLegendContent_" + this.mapid).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.mapid + '" src="' +
            '" title="The dark blue value stands for the minimum NDVI value in the parcel and dark red ' +
            'indicates the maximum NDVI values within the parcel for the measurement date">' +
            '<br><span>min NDVI max</span>';

          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.mapid).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.mapid).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.mapid).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        }
        if (row.product == "vitality") {
          document.getElementById("mapLegendContent_" + this.mapid).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.mapid +
            '" title="The brown value means no living green vegetation (NDVI value <= 0.1)' +
            'and dark green means dense living green vegetation (NDVI value >= 0.9)">' +
            '<br><span style="padding-left: 8px; padding-right: 20px;">0.1 NDVI 0.9</span>';

          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.mapid).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.mapid).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.mapid).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        } else {
          document.getElementById("mapLegendContent_" + this.mapid).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.mapid +
            '" title="">' +
            '<br><span style="padding-left: 8px; padding-right: 20px;">min Index max</span>';
          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.mapid).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.mapid).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.mapid).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        }
      } else {
        document.getElementById("mapLegendContent_" + this.mapid).classList.add("is-hidden");
      }
    },
    getIndexValueforCoordinate(latlng) {

      var parcel_id = this.currentParcelID;
      var productName = this.selectedProduct;
      var source = this.getCurrentRaster().source;
      var raster_id = this.getCurrentRaster().raster_id;

      var params = "/parcels/" + parcel_id + "/" + productName + "/" +
        source + "/" + raster_id +
        "?key=" + this.apiKey +
        "&lat=" + latlng.lat +
        "&lon=" + latlng.lng;

      var xmlHttp = new XMLHttpRequest();
      var async = true;

      //Show requests on the DEBUG console for developers
      console.debug("GET " + this.apiUrl + params);

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
          var tmp = JSON.parse(xmlHttp.responseText);

          if (tmp.content.length > 0) {
            this.popup.setContent('<span class="is-large"><b>Index value: ' +
              // Math.ceil(latlng.lat * 1000)/1000 + ", " + 
              // Math.ceil(latlng.lng * 1000)/1000 +"</b></span><br><span>"+
              this.formatDecimal(tmp.content[0].pixel_value) + "</span>");
          }
        }
      }.bind(this);
      xmlHttp.open("GET", this.apiUrl + params, async);
      xmlHttp.send();
    },
    createParcelAction: function () {

      try {
        let isQueryActive = document.getElementById("btnQueryIndexValue_" + this.mapid).classList.contains("is-active");
        if (isQueryActive) {
            this.disableQueryBtn();
        }        
      }
      catch (err)
      { console.debug("could not disable query button.");}

      let isActive = document.getElementById("btnCreateParcel_" + this.mapid).classList.contains("is-active");
      if (isActive) {

        try {
          this.disableCreateParcelBtn();
          document.getElementById(this.mapid).getElementsByClassName("mapOptionsTitle")[0].classList.remove("is-hidden");
          document.getElementById("timelineContainer_"+this.mapid).classList.remove("is-hidden");
        }
        catch (err) {
        }
        //remove elements of this.newParcel
        this.newParcel = {
          key: this.apiKey,
          geometry: "",
          crop: "",
          planting: "",
          harvest: "",
          name: "",
          entity: "",
          id: "",
          status: ""
        };
      } 
      else 
      {
        try { document.getElementById("timelineContainer_"+this.mapid).classList.add("is-hidden"); } catch (err) { }

        //reset mapOptions
        document.getElementById(this.mapid).getElementsByClassName("mapOptionsTitle")[0].classList.add("is-hidden");
        document.getElementById("mapOptions_"+ this.mapid).classList.add("is-hidden");
        document.getElementById(this.mapid).getElementsByClassName("mapOptionsTitle")[0].children[0].classList.remove("is-active");
        
        document.getElementById(this.mapid).classList.remove("is-inline");
        document.getElementById(this.mapid).classList.add("is-flex");

        document.getElementById("map_"+this.mapid).style.height = "480px";
        document.getElementById("map_"+this.mapid).style.width = "60%";
        this.mymap.invalidateSize(); // make sure map resizes also

        document.getElementById("divCreateParcel_" + this.mapid).classList.remove("is-hidden");
        document.getElementById("divNewParcelMsg_" + this.mapid).innerHTML = '';

        this.map_startEditing();

        try {
          document.getElementById("btnCreateParcel_" + this.mapid).classList.add('is-active');
          document.getElementById("btnCreateParcel_" + this.mapid).classList.add("is-dark");
          document.getElementById("btnCreateParcel_" + this.mapid).classList.remove("is-light");
        } catch (err) { }
        this.newParcel.key = this.apiKey;
      }
    },
    deleteParcelAction: function () {
      if (confirm("Do you really want to delete parcel " + this.currentParcelID + "?\n This action is not reversible!",
          "Delete Parcel")) {
        this.deleteParcel(this.currentParcelID);
      }
    },
    deleteParcel: function (parcel_id) {

      document.getElementById("btnDeleteParcel_" + this.mapid).classList.add("is-loading");

      var params = "/parcels/" + parcel_id + "?key=" + this.apiKey;

      //Show requests on the DEBUG console for developers
      console.debug("deleteParcel()");
      console.debug("DELETE " + this.apiUrl + params);

      var xmlHttp = new XMLHttpRequest();
      var async = true;

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) //if ready
        {
          console.debug("response " + xmlHttp.responseText + " - " + xmlHttp.status);

          if (xmlHttp.responseText == "1") {
            console.log("parcel deleted.");
          }
          if (xmlHttp.responseText == "0") {
            console.log("error deleting parcel.");
          }
          if (xmlHttp.responseText == "") {
            console.log("parcel marked for deletion.");
          }
          //refresh parcel list
          //this.removeFilter();

          //hide loading spinner
          document.getElementById("btnDeleteParcel_" + this.mapid).classList.remove("is-loading");
        }
      }.bind(this);

      xmlHttp.open("DELETE", this.apiUrl + params, async);
      xmlHttp.setRequestHeader('Content-type', 'application/json');

      xmlHttp.send(null);
    },
    registerParcel: function () {

      document.getElementById("btnRegisterParcel_" + this.mapid).classList.add("is-loading");

      // DON't deliver key in POST-Request
      // otherwise error: key is not authorized will return
      var params = "/parcels/";
      //var params = "/parcels/?key="+apiKey;  
      var postData = JSON.stringify(this.newParcel);

      //Show requests on the DEBUG console for developers
      console.debug("registerParcel()");
      console.debug("POST " + this.apiUrl + params);
      //console.debug(postData);

      var xmlHttp = new XMLHttpRequest();
      var async = true;

      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) //if ready
        {
          console.debug(xmlHttp.responseText);
          var tmp = JSON.parse(xmlHttp.responseText);

          document.getElementById("divNewParcelMsg_" + this.mapid).classList.remove("is-hidden");

          if (tmp.errors.length > 0) {
            // show error message
            document.getElementById("divNewParcelMsg_" + this.mapid).innerHTML = "Errors: " + tmp.errors + "<br>";
          }
          if (tmp.messages) {
            // show status message
            document.getElementById("divNewParcelMsg_" + this.mapid).innerHTML = "Response: " + tmp.messages.status + "<br>";
            this.newParcel.status = tmp.status;
          }
          if (tmp.errors.length == 0) {

            this.newParcel.id = tmp.id;

            //async - so pass the id to be set
            // empty viewModel first!
            this.parcels = [];

            this.getParcelTotalCount(filterString);
          }
          document.getElementById("btnRegisterParcel_" + this.mapid).classList.remove("is-loading");
        }
      }.bind(this);

      xmlHttp.open("POST", this.apiUrl + params, async);
      xmlHttp.setRequestHeader("Content-type", "application/json");
      xmlHttp.send(postData); //must be string
    },
    queryIndexValueAction: function () {

      try {
        let isEditActive = document.getElementById("btnCreateParcel_" + this.mapid).classList.contains("is-active");
        if (isEditActive) {
          this.disableEditBtn();
        }
      }
      catch (err) {}

      try {
        let isActive = document.getElementById("btnQueryIndexValue_" + this.mapid).classList.contains("is-active");
        // turn it off
        if (isActive) {
          this.disableQueryBtn();
        }
        //turn query on
        else {
          document.getElementById("btnQueryIndexValue_" + this.mapid).classList.add("is-active");
          document.getElementById("btnQueryIndexValue_" + this.mapid).classList.remove("is-light");
          document.getElementById("btnQueryIndexValue_" + this.mapid).classList.add("is-dark");
          //leaflet has its own interactive region within the map (bbox of layers)
          //so change cursor only for this element
          document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-interactive")[0].style.cursor = "crosshair";

          // disable panning and zooming in map
          this.mymap.dragging.disable();
          this.mymap.doubleClickZoom.disable();

          // add event handler for identify click/mousemove in map
          this.mymap.on('click', function (e) {

            //only if the clicked point is within the parcels bbox
            //todo: real geometry - not only bounds checking!
            if (this.parcelLayer.getBounds().contains(e.latlng)) {

              // resolution check for mousemove -
              // don't fire too much requests against the service
              // so compare to the last latlng value

              // console.log(mymap.distance(e.latlng, lastLatLng));
              // if ( mymap.distance(e.latlng, lastLatLng) > 2.0) {

              //get Index value (e.g. NDVI or NDRE) for coordinate
              this.getIndexValueforCoordinate(e.latlng);

              var popLocation = e.latlng;
              this.popup.setLatLng(popLocation).openOn(this.mymap);

              this.lastLatLng = e.latlng;
              // }
            }

          }.bind(this));
        }
      }
      catch (err) { 
        console.debug("could not disable query button.");
      }
    },
    map_addParcel: function (geom) {

      this.parcelLayer.clearLayers();

      this.geojsonFeature = {
        "type": "Feature",
        "properties": {
          "name": "parcel"
        },
        "geometry": geom
      };
      this.parcelLayer.addData(this.geojsonFeature);
      this.parcelLayer.bringToFront();
      this.parcelLayer.setStyle({
        opacity: 0.5,
        fillOpacity: 0.0,
        color: "yellow"
      });

      this.mymap.fitBounds(this.parcelLayer.getBounds());
    },
    map_addRaster: function (imageUrl, bounds) {

      console.log("map_addRaster()");
      console.log("GET " + imageUrl);

      this.imageLayer = L.imageOverlay(imageUrl, bounds);

      //add load event listener
      this.imageLayer.on('load', this.onImageLayerLoad);

      this.imageLayerGroup.addLayer(this.imageLayer);
      this.imageLayer.bringToFront();
    },
    onImageLayerLoad: function (e) {

      console.log("image ready!");
      // fade in via css transition
      this.imageLayer.setOpacity(1.0);

      // fade legend in via css transition
      if (this.mapLegendVisible) {
        try {
          document.getElementById("mapLegendContentImage_" + this.mapid).style.opacity = 1;
        } catch (err) {}
      }

      //add image filters
      let brightness = document.getElementById("inpBrightnessSlider_"+this.mapid).value;
      // transparency to opacity
      let transparency = (1.0 - parseFloat(document.getElementById("inpTransparencySlider_"+this.mapid).value));

      let filterString = "brightness(" + brightness + ")" + " opacity(" + transparency + ")";

      // do this for all images in this widget
      let images = document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-image-layer");
      for (var i = 0; i < images.length; i++) {
        images[i].style.filter = filterString;
      }

      // now remove previous layer after loading the current layer
      // must be equal the timeChangeInterval
      setTimeout( function() {
        try {
          let allImageLayers = this.imageLayerGroup.getLayers();
          if (allImageLayers.length > 1) {
            let prevLyr = allImageLayers[allImageLayers.length - 2];
            this.imageLayerGroup.removeLayer(prevLyr);
          }
        }
        catch (err) { console.debug(err); }
      }.bind(this)
      , this.imageChangeInterval);

    },
    map_removeParcel: function () {
      this.parcelLayer.clearLayers();
    },
    map_removeAllRasters: function () {
      this.imageLayerGroup.clearLayers();
    },
    map_startEditing: function () {

      this.drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: 'red',
              timeout: 2000
            }
          },
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: this.drawnItems
        }
      });

      this.mymap.addLayer(this.drawnItems);

      this.drawControl.setPosition('verticalcenterright');

      this.mymap.addControl(this.drawControl);
    },
    map_endEditing: function () {

      try {
        this.drawnItems.clearLayers();
        this.mymap.removeLayer(this.drawnItems);
        this.mymap.removeControl(this.drawControl);
      } catch (err) {
        //console.log(err);
      }
    },
    // https://stackoverflow.com/questions/33614912/how-to-locate-leaflet-zoom-control-in-a-desired-position
    // Create additional Control placeholders
    addControlPlaceholders: function (map) {
      var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

      function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;

        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
      }

      createCorner('verticalcenter', 'left');
      createCorner('verticalcenter', 'right');
    },
    //prepares the download link to the image
    prepareDownloadImageLink: function (format) {

      console.debug("prepareDownloadImageLink");

      let row = this.getCurrentRaster();
      
      let formats = ["png", "tif"];
      if (row) {
        document.getElementById("downloadImage_"+this.mapid).classList.remove("is-hidden");

        for (var i = 0; i < formats.length; i++) {
          
          let format = formats[i];
          let url = this.apiUrl + row.png.replace(".png", "."+format) + "?key=" + this.apiKey;

          if (format == "png") {                    
            url = url + "&colormap="+this.colormap
            document.getElementById("btnDownloadImagePng_"+this.mapid).href = url;
            document.getElementById("btnDownloadImagePng_"+this.mapid).download = row.source + "_" + row.raster_id + "." + format;
          }
          if (format == "tif") {             
            document.getElementById("btnDownloadImageTif_"+this.mapid).href = url;
            document.getElementById("btnDownloadImageTif_"+this.mapid).download = row.source + "_" + row.raster_id + "." + format;
            // open(url, "_blank");
          }
        }
      }
      else {
        document.getElementById("downloadImage_"+this.mapid).classList.add("is-hidden");
      }
    },
    /* GUI helpers */
    growLayerControl: function (event) {
      document.getElementById("btnLayerControl_" + this.mapid).classList.add("is-hidden");
      document.getElementById("layerControlContent_" + this.mapid).classList.remove("is-hidden");
    },
    shrinkLayerControl: function (event) {
      document.getElementById("layerControlContent_" + this.mapid).classList.add("is-hidden");
      document.getElementById("btnLayerControl_" + this.mapid).classList.remove("is-hidden");
    },
    growImageControl: function (event) {
      document.getElementById("btnDownloadImage_" + this.mapid).classList.add("is-hidden");
      document.getElementById("downloadImageContent_" + this.mapid).classList.remove("is-hidden");
    },
    shrinkImageControl: function (event) {
      document.getElementById("downloadImageContent_" + this.mapid).classList.add("is-hidden");
      document.getElementById("btnDownloadImage_" + this.mapid).classList.remove("is-hidden");
    },
    disableQueryBtn: function () {
      document.getElementById("btnQueryIndexValue_" + this.mapid).classList.remove("is-active");
      document.getElementById("btnQueryIndexValue_" + this.mapid).classList.remove("is-dark");
      document.getElementById("btnQueryIndexValue_" + this.mapid).classList.add("is-light");

      //works only if the map has an active parcel layer!
      if (document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-interactive").length > 0) {
        //leaflet has its own interactive region within the map (bbox of layers)
        //so change cursor only for this element
        document.getElementById("map_"+this.mapid).getElementsByClassName("leaflet-interactive")[0].style.cursor = "pointer";

        // enable panning and zooming in map
        this.mymap.dragging.enable();
        this.mymap.doubleClickZoom.enable();

        // remove event handler for identify click in map
        this.mymap.off('click');
      }
    },
    disableCreateParcelBtn: function () {

      document.getElementById("divCreateParcel_" + this.mapid).classList.add("is-hidden");
      document.getElementById(this.mapid).classList.add("is-inline");
      document.getElementById(this.mapid).classList.remove("is-flex");
      document.getElementById("map_"+this.mapid).style.height = "360px";
      document.getElementById("map_"+this.mapid).style.width = "auto";

      this.mymap.invalidateSize();

      this.map_endEditing();

      document.getElementById("btnCreateParcel_" + this.mapid).classList.remove('is-active');
      document.getElementById("btnCreateParcel_" + this.mapid).classList.remove("is-dark");
      document.getElementById("btnCreateParcel_" + this.mapid).classList.add("is-light");

      document.getElementById("divNewParcelMsg_" + this.mapid).innerHTML = '';
      document.getElementById("divNewParcelMsg_" + this.mapid).classList.add("is-hidden");
    },
    /* time slider */
    initTimeline: function () {

      // destroy existing first
      if (this.timeLine) {
        this.timeLine.off("click");
        this.timeLine.destroy();
      }

      let parcel = this.getCurrentParcel();
      let today = new Date().getTime();

      const MS_IN_A_DAY = 864e5;

      /* timeline test */
      var _visOptions = {
        width: "auto",
        height: "100%",
        type: "box",
        showCurrentTime: false,
        clickToUse: false,
        selectable: false,
        editable: false,
        moveable: true,
        stack: false,
        orientation: "bottom",
        showMajorLabels: false,
        showMinorLabels: true,
        zoomMin: MS_IN_A_DAY*7, //1 week zoom min
        // zoomMax is the timespan of start and endate + buffer of +20%
        zoomMax: (new Date(this.getCurrentParcel().enddate) - new Date(this.getCurrentParcel().startdate).getTime()) *1.2,
        snap: function (date, scale, step) {
          return Math.round( date / MS_IN_A_DAY) * MS_IN_A_DAY;
        }
      };

      var _visDs1;

      _visDs1 = new vis.DataSet;

      _visDs1.add([{
          id: 1,
          start: parcel.startdate,
          type: "point",
          className: "start",
          group: 1
        }, {
          id: 2,
          start: parcel.planting,
          type: "point",
          className: "planting",
          group: 1
        }, {
          id: 3,
          start: parcel.harvest,
          type: "point",
          className: "harvest",
          title: parcel.harvest,
          group: 1
        }, {
          id: 4,
          start: today,
          type: "point",
          className: "today",
          group: 1
        }, {
          id: 5,
          start: parcel.enddate,
          type: "point",
          className: "end",
          group: 1
        }]),
        _visDs1.add(parcel.timeseries.map(function (a, b) {
          return {
            id: b + 6, //begin with id 6 because all others are already taken
            start: new Date(a.date + ' 00:00:00'),
            type: "point",
            className: "special",
            title: a.date,
            group: 1
          }
        }));

      // fill dates
      /*
      for (var i = parcel.timeseries.length + 10, p_dates = this.fillDates(parcel.startdate, parcel.enddate), j = 0; j < p_dates.length; j ++) 
          _visDs1.add([{
              id: i,
              start: p_dates[j],
              type: "point",
              className: "otherdays",
              title: p_dates[j].simpleDate(),
              group: 0
          }]), i++; */

      this.timeLine = new vis.Timeline(document.getElementById("timeline_" + this.mapid), _visDs1, _visOptions);

      // margin of 10 days left and right of the timeline
      //this.timeLine.setWindow(new Date(parcel.startdate).getTime() - (180 * MS_IN_A_DAY), new Date(parcel.enddate).getTime() + (40 * MS_IN_A_DAY));

      this.timeLine.on("click", function (a) {
        //show raster of this datetime
        console.log(a.item);

        //do we have an item witch class special?
        let item = this.timeLine.itemsData.get(a.item);
        if (item) {
          if (item.className == "special") {
            let r = parcel.timeseries.map(d => d.date).indexOf(item.start.simpleDate());
            if (r >= 0) {
              this.currentRasterIndex = r;
            }
          }
        }

      }.bind(this));

      // fires on move of customeTime
      this.timeLine.on("timechanged", function (a) {
        //do we have an item witch class special?
        // snap it
        let snappedDate = new Date(this.timeLine.itemSet.options.snap(a.time)).simpleDate();
        let r = parcel.timeseries.map(r => r.date).indexOf(snappedDate);
        if (r >= 0) {
          this.currentRasterIndex = r;
        }

      }.bind(this));

      // first call: set marker on current time if ready 
      let p = this.getCurrentParcel();
      if (p) {
        console.debug("setting first marker on: "+ p.timeseries[this.currentRasterIndex].date);
        this.showCurrentTimeMarker(p.timeseries[this.currentRasterIndex].date);
      }
      //show timeline container
      document.getElementById("timelineContainer_"+this.mapid).classList.remove('is-hidden');
    },
    startPauseVideo: function () {
      
      console.log("startPauseVideo()");

      //playing -> pause
      if (this.isPlaying) {
        this.isPlaying = false;
        document.getElementById("player_" + this.mapid).children.btnPlayerOnOff.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(this.myTimer);
        document.getElementById("player_" + this.mapid).children.btnPlayerOnOff.classList.remove("is-active");
      }
      //paused -> play
      else {
        //reset to start?
        //this.currentTimeSliderPosition = 0;

        this.isPlaying = true;
        document.getElementById("player_" + this.mapid).children.btnPlayerOnOff.classList.add("is-active");

        document.getElementById("player_" + this.mapid).children.btnPlayerOnOff.innerHTML = '<i class="fas fa-pause"></i>';
        var timeSeriesCount = this.getTimeSeries().length;

        clearInterval(this.myTimer);
        //set slider +1 every interval
        this.myTimer = setInterval(function () {

          if (this.currentTimeSliderPosition <= timeSeriesCount) {
            //loop condition; set to min again
            if (this.currentTimeSliderPosition == timeSeriesCount) {
              this.currentTimeSliderPosition = 0;
            }

            this.currentRasterIndex = this.currentTimeSliderPosition + "";
            this.currentTimeSliderPosition++;
          }
        }.bind(this), this.imageChangeInterval);
      }
    },
    forwardTimeSeries: function () {
      var j = parseInt(this.currentRasterIndex);
      j += 1;
      if (j >= 0 && j < this.getTimeSeries().length) {
        this.currentRasterIndex = j + "";
      }
    },
    backwardTimeSeries: function () {
      var j = parseInt(this.currentRasterIndex);
      j -= 1;
      if (j >= 0 && j < this.getTimeSeries().length) {
        this.currentRasterIndex = j + "";
      }
    },
    disableTimeSlider: function (state) {

      document.getElementById("player_" + this.mapid).children.btnPlayerOnOff.disabled = state;
      /*document.getElementById("player_"+this.mapid).children.btnPlayerBackward.disabled = state;
      document.getElementById("player_"+this.mapid).children.btnPlayerForward.disabled = state;*/
    },
    showCurrentTimeMarker: function (date) {
      // add marker to timeline
      if (this.timeLine) {
        try {
          this.timeLine.removeCustomTime("current");
        } catch (err) {}
        // add marker on current image
        this.timeLine.addCustomTime(new Date(date).getTime(), "current");
      }
    },
    toggleLegend: function () {

      this.mapLegendVisible = document.getElementById("btnToggleLegend_" + this.mapid).classList.contains("is-active");

      if (this.mapLegendVisible) {

        document.getElementById("btnToggleLegend_" + this.mapid).classList.remove("is-active");
        document.getElementById("btnToggleLegend_" + this.mapid).classList.add("is-light");
        document.getElementById("btnToggleLegend_" + this.mapid).classList.remove("is-dark");

        document.getElementById("mapLegendContent_" + this.mapid).classList.add("is-hidden");

        this.mapLegendVisible = false;
      } else {

        this.showLegend(this.getCurrentRaster());

        document.getElementById("btnToggleLegend_" + this.mapid).classList.add("is-active");
        document.getElementById("btnToggleLegend_" + this.mapid).classList.remove("is-light");
        document.getElementById("btnToggleLegend_" + this.mapid).classList.add("is-dark");

        this.mapLegendVisible = true;
      }
    },
    toggleMapOptions: function() {
      let isMapOptionsActive = false;
      isMapOptionsActive = !(document.getElementById("mapOptions_"+this.mapid).classList.contains("is-hidden"));
  
      if (isMapOptionsActive) {
        document.getElementById("mapOptions_"+this.mapid).classList.add("is-hidden");
        document.getElementById(this.mapid).getElementsByClassName("mapOptionsTitle")[0].children[0].classList.remove("is-active");
      }
      else {
        document.getElementById(this.mapid).getElementsByClassName("mapOptionsTitle")[0].children[0].classList.add("is-active");  
        document.getElementById("mapOptions_"+this.mapid).classList.remove("is-hidden");

      }
    }, 
    toggleColormapOptions: function(selectedProduct) {
      let legProducts = ["visible", "vitality", "variations"];
  
      if (legProducts.includes(selectedProduct)) {
          this.colormap = ""; //reset to default
          document.getElementById("selColormap").disabled = true;
      }
      else {
          document.getElementById("selColormap").disabled = false;
      }
    },
    filterDatasourceProductCompat: function(source, products) {
      /*
          Handles compatibility of products & data_source
      */
      console.debug("filterDatasourceProductCompat("+source+")");
  
      let matrix = {"landsat8": ["visible", "vitality", "variations","ndvi", "ndwi", "savi", "evi2", "npcri"],
                    "sentinel2": ["visible", "vitality", "variations", "ndvi", "ndre1", "ndre2", "ndre3",
                                      "ndwi", "savi", "evi2", "cire", "npcri"]
                    };
  
      // source may be "landsat8", "sentinel2" or "" so check for length
      if (source.length > 0){
        // filter out the ones which do not fit in
        return products.filter(p=>matrix[source].includes(p))
      }
      else { //defaults to sentinel2 products if source not set
        return products.filter(p=>matrix["sentinel2"].includes(p))
      }
    },
    /* helper functions */
    formatDecimal: function (decimal, numberOfDecimals) {
      /* Helper function for formatting numbers to given number of decimals */

      var factor = 100;

      if (isNaN(parseFloat(decimal))) {
        return NaN;
      }
      if (numberOfDecimals == 1) {
        factor = 10;
      }
      if (numberOfDecimals == 2) {
        factor = 100;
      }
      if (numberOfDecimals == 3) {
        factor = 1000;
      }
      if (numberOfDecimals == 4) {
        factor = 10000;
      }
      if (numberOfDecimals == 5) {
        factor = 100000;
      }
      return Math.ceil(decimal * factor) / factor;
    },
    capitalize: function (s) {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    fillDates: function (a, b) {
      for (var c = new Date(a), d = new Date(b), e = [], f = c; d >= f;) {
        e.push(f), f = f.addDays(1);
      }
      return e;
    },
    loadJSscript: function (url, callback) {
      let script = document.createElement("script");  // create a script DOM node
      script.src = url;  // set its src to the provided URL
      script.async = true;
      document.body.appendChild(script);  // add it to the end of the body section of the page 
      script.onload = function () {
        callback();
      };
    }
  }
});
