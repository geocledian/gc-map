/*
 Vue.js Geocledian map component
 created:     2019-11-04, jsommer
 last update: 2020-07-02, Tarun
 version: 0.9.5
*/
"use strict";

//lanugage strings
const gcMapLocales = {
  "en": {
    "options": { 
                "title": "Map options",
                "colormapLabel": "Colormap",
                "imageBrightnessLabel": "Image Brightness",
                "imageTransparencyLabel": "Image Transparency",
                "sliderReset": "Reset",
                "colormap": {
                    "default": "Default",
                    "vitality": "Vitality",
                    "variations": "Variations (relative)",
                    "ndvi": "NDVI",
                    "ndre1": "NDRE1",
                    "ndre2": "NDRE2",
                    "ndwi": "NDWI",
                    "ndwi_fc": "NDWI (Forest coniferous)",
                    "ndwi_fb": "NDWI (Forest broadleaf)",
                    "savi": "SAVI",
                    "evi2": "EVI2",
                    "cire": "CIRE",
                    "npcri": "NPCRI",
                    "pseudocolor": "Pseudocolor (relative)",
                    "redblue": "Red-Blue (relative)",
                    "bluered": "Blue-Red (relative)"
                }
    },
    "products": { 
                "sos": "Start of season",
                "pos": "Peak of season",
                "eos": "End of season",
                "vitality": "Vitality",
                "variations": "Variations",
                "visible": "Visible (RGB)",
                "ndvi": "NDVI",
                "ndre1": "NDRE1",
                "ndre2": "NDRE2",
                "ndwi": "NDWI",
                "savi": "SAVI",
                "evi2": "EVI2",
                "cire": "CIRE",
                "npcri": "NPCRI"
    },
    "layers": { 
            "parcels": "Parcels",
            "images": "Images"
    },
    "map": { 
            "zoomIn": "Zoom in",
            "zoomOut": "Zoom out",
            "searchLabel": "Search location",
            "buttons": {
                "createParcel": { "title": "Create new parcel" },
                "deleteParcel": { "title": "Delete parcel" },
                "downloadImagePNG": { "title": "Download as PNG" },
                "downloadImageTIF": { "title": "Download as GeoTiff" },
                "toggleLegend": { "title": "Toggle legend"},
                "queryIndexValue": { "title": "Query Index value"},
            },
            "popups" : { 
              "parcelID": "ParcelID",
              "indexValue": "Index value",
              "value": "Value"
            },
            "drawControl" : {
              "L_drawLocal_draw_toolbar_actions_title": "Cancel Drawing",
              "L_drawLocal_draw_toolbar_actions_text": "Cancel",
              "L_drawLocal_draw_toolbar_finish_title": "Finish  Drawing",
              "L_drawLocal_draw_toolbar_finish_text": "Finish",
              "L_drawLocal_draw_toolbar_undo_title": "Undo Drawing",
              "L_drawLocal_draw_toolbar_undo_text": "Undo",
              "L_drawLocal_draw_toolbar_buttons_polygon": "Draw a Polygon",
              "L_drawLocal_draw_handlers_polygon_tooltip_start":"Click to start drawing shape",
              "L_drawLocal_draw_handlers_polygon_tooltip_cont":"Click to continue drawing shape",
              "L_drawLocal_draw_handlers_polygon_tooltip_end":"Click first point to close this shape",
              "L_drawLocal_edit_toolbar_actions_save_title": "Save changes",
              "L_drawLocal_edit_toolbar_actions_save_text": "Save",
              "L_drawLocal_edit_toolbar_actions_cancel_title": "Cancel editing, discards all changes",
              "L_drawLocal_edit_toolbar_actions_cancel_text": "Cancel",
              "L_drawLocal_edit_toolbar_actions_clearAll_title": "Clear all Layers",
              "L_drawLocal_edit_toolbar_actions_clearAll_text": "Clear All",
              "L_drawLocal_edit_toolbar_buttons_edit": "Edit Layers",
              "L_drawLocal_edit_toolbar_buttons_editDisabled": "No Layers to edit",
              "L_drawLocal_edit_toolbar_buttons_remove": "Delete Layers",
              "L_drawLocal_edit_toolbar_buttons_removeDisabled": "No layers to delete",
              "L_drawLocal_edit_handlers_edit_tooltip_text":"Drag handles or markers to edit features",
              "L_drawLocal_edit_handlers_edit_tooltip_subtext": "Click cancel to undo changes",
              "L_drawLocal_edit_handlers_remove_tooltip_text":"Click on a feature to remove",
            }
    },
    "legend": {},
    "newParcel" : {
      "title": "New parcel attributes",
      "apikey": "API Key",
      "crop": "Crop",
      "entity": "Entity",
      "name": "Name",
      "seeding": "Seeding",
      "harvest": "Harvest",
      "promotion": "Promotion",
      "register": "Register parcel",
      "date_format_hint": "YYYY-MM-DD"
    },
    "api_msg": {
      "unauthorized_key" : "Sorry, the given API key is not authorized!",
      "invalid_key" : "Sorry, the given API key's validity expired!",
      "support": "Please contact <a href='https://www.geocledian.com'>geo|cledian</a> for support.",
      "new_parcel_msg_ok": "",
      "new_parcel_msg_err": ""
    }
  },
  "de": {
      "options": { "title": "Kartenoptionen",
                   "colormapLabel": "Farbgebung",
                   "imageBrightnessLabel": "Bild - Helligkeit",
                   "imageTransparencyLabel": "Bild - Transparenz",
                   "sliderReset": "Zurücksetzen",
                   "colormap": {
                    "default": "Standard",
                    "vitality": "Vitalität",
                    "variations": "Variabilität (relativ)",
                    "ndvi": "NDVI",
                    "ndre1": "NDRE1",
                    "ndre2": "NDRE2",
                    "ndwi": "NDWI",
                    "ndwi_fc": "NDWI (Nadelwald)",
                    "ndwi_fb": "NDWI (Laubwald)",
                    "savi": "SAVI",
                    "evi2": "EVI2",
                    "cire": "CIRE",
                    "npcri": "NPCRI",
                    "pseudocolor": "Pseudofarben (relativ)",
                    "redblue": "Rot-Blau (relativ)",
                    "bluered": "Blau-Rot (relativ)"
                }
              },
      "products": { 
                  "sos": "Saisonbeginn",
                  "pos": "Saisonales Maximum",
                  "eos": "Saisonende",
                  "vitality": "Vitalität",
                  "variations": "Zonen",
                  "visible": "Foto",
                  "ndvi": "NDVI",
                  "ndre1": "NDRE1",
                  "ndre2": "NDRE2",
                  "ndwi": "Wassergehalt",
                  "savi": "SAVI",
                  "evi2": "EVI2",
                  "cire": "Blattfläche",
                  "npcri": "NPCRI"
      },
      "layers": { 
                  "parcels": "Felder",
                  "images": "Bilder"
      },
      "map": { 
          "zoomIn": "Hineinzoomen",
          "zoomOut": "Herauszoomen",
          "searchLabel": "Suche nach Ort",
          "buttons": {
              "createParcel": { "title": "Neues Feld erzeugen" },
              "deleteParcel": { "title": "Feld löschen" },
              "downloadImagePNG": { "title": "Download als PNG" },
              "downloadImageTIF": { "title": "Download als GeoTiff" },
              "toggleLegend": { "title": "Legende an/aus" },
              "queryIndexValue": { "title": "Indexwert abfragen" },
          },
          "popups" : { 
            "parcelID": "Parcel Nr",
            "indexValue": "Index Wert",
            "value": "Wert"
          },
          "drawControl" : {
            "L_drawLocal_draw_toolbar_actions_title": "Zeichnung abbrechen",
            "L_drawLocal_draw_toolbar_actions_text": "Abbrechen",
            "L_drawLocal_draw_toolbar_finish_title": "Zeichnung beenden",
            "L_drawLocal_draw_toolbar_finish_text": "Beenden",
            "L_drawLocal_draw_toolbar_undo_title": "Zeichnung rückgängig machen",
            "L_drawLocal_draw_toolbar_undo_text": "Rückgängig",
            "L_drawLocal_draw_toolbar_buttons_polygon": "Ein Polygon zeichnen",
            "L_drawLocal_draw_handlers_polygon_tooltip_start": "Klicken um eine Zeichnung zu starten",
            "L_drawLocal_draw_handlers_polygon_tooltip_cont": "Klicken um die Zeichnung fortzuführen",
            "L_drawLocal_draw_handlers_polygon_tooltip_end": "Ersten Punkt anklicken, um das Polygon zu schließen",
            "L_drawLocal_edit_toolbar_actions_save_title": "Änderungen speichern",
            "L_drawLocal_edit_toolbar_actions_save_text": "Speichern",
            "L_drawLocal_edit_toolbar_actions_cancel_title": "Bearbeitung abbrechen, alle Änderungen verwerfen",
            "L_drawLocal_edit_toolbar_actions_cancel_text": "Abbrechen",
            "L_drawLocal_edit_toolbar_actions_clearAll_title": "Inhalte in allen Layern leeren",
            "L_drawLocal_edit_toolbar_actions_clearAll_text": "Alles leeren",
            "L_drawLocal_edit_toolbar_buttons_edit": "Layer bearbeiten",
            "L_drawLocal_edit_toolbar_buttons_editDisabled": "Keine Layer zu bearbeiten",
            "L_drawLocal_edit_toolbar_buttons_remove": "Layer löschen",
            "L_drawLocal_edit_toolbar_buttons_removeDisabled": "Keine Layer zu löschen",
            "L_drawLocal_edit_handlers_edit_tooltip_text":"Markierungen ziehen, um Objekte zu bearbeiten",
            "L_drawLocal_edit_handlers_edit_tooltip_subtext": "Abbrechen klicken, um die Änderungen rückgängig zu machen",
            "L_drawLocal_edit_handlers_remove_tooltip_text":"Auf ein Objekt klicken, um es zu löschen",
          }
      },
      "legend": {},
      "newParcel" : {
        "title": "Neues Feld - Attribute",
        "apikey": "API Schlüssel",
        "crop": "Fruchtart",
        "entity": "Entität",
        "name": "Name",
        "seeding": "Pflanzung",
        "harvest": "Ernte",
        "promotion": "Demo",
        "register": "Feld registrieren",
        "date_format_hint": "JJJJ-MM-TT"
      },
      "api_msg": {
        "unauthorized_key" : "Tut uns leid, der angegebene API Schlüssel existiert nicht!",
        "invalid_key" : "Tut uns leid, die Gültigkeit des angegebenen API Schlüssels ist abgelaufen.",
        "support": "Bitte kontaktieren Sie <a href='https://www.geocledian.com'>geo|cledian</a> für weitere Unterstützung.",
        "new_parcel_msg_ok": "",
        "new_parcel_msg_err": ""
      }
  },
}

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
    gcWidgetId: {
      type: String,
      default: 'map1',
      required: true
    },
    gcApikey: {
      type: String,
      default: '39553fb7-7f6f-4945-9b84-a4c8745bdbec'
    },
    gcHost: {
        type: String,
        default: 'geocledian.com'
    },
    gcProxy: {
      type: String,
      default: undefined
    },
    gcApiBaseUrl: {
      type: String,
      default: "/agknow/api/v3"
    },
    gcApiSecure: {
      type: Boolean,
      default: true
    }, 
    gcCurrentParcelId: {
      type: Number,
      default: -1
    },
    gcBasemap: {
      type: String,
      default: 'osm' //'google', 'arcgis', 'osm'
    },
    gcDataSource: {
      type: String,
      default: "" // "landsat8", "sentinel2" or "" [all]
    },
    gcAvailableProducts: {
      type: String,
      default: "visible,vitality,variations,ndvi,ndwi,ndre1,ndre2,savi,evi2,cire,npcri"
    },
    gcImageChangeInterval: {
      type: String,
      default: "800" // milliseconds for change in video mode; check also .leaflet-image-layer class for fade in effect
    },
    gcAvailableTools: {
      type: String,
      default: "edit,delete,query,legend,downloadImage,productSelector,video"
    },
    gcAvailableOptions: {
      type: String,
      default: 'optionsTitle,colorMap,imageBrightness,imageTransparency'
    },
    gcOptionsCollapsed: {
      type: Boolean,
      default: true // or false
    },
    gcLanguage: {
      type: String,
      default: 'en' // 'en' | 'de'
    },
    gcSelectedDate: { 
      type: String,
      default: ""
    },
    gcSelectedProduct: {
      type: String,
      default: ""
    },
    gcInitialLoading: {
      type: Boolean,
      default: true // true: load first parcels by filter or false: wait for parcels to be set later
    },
    gcDrawcontrolPosition: {
      type: String,
      default: 'bottomleft' // 'bottomleft' or 'verticalcenterright' or 'verticalcenterleft'
    },
    gcLegendPosition: {
      type: String,
      default: 'topright' // 'bottomleft' or 'topright' 
    }
  },
  template: `<div :id="this.gcWidgetId" class="is-inline">

              <div class="level" style="margin-bottom: 0px;">
           
              <p class="gc-options-title is-inline is-size-6 is-orange" 
                  style="margin-bottom: 1.0rem; cursor: pointer;" 
                  v-on:click="toggleMapOptions"
                  v-if="availableOptions.includes('optionsTitle')">
               {{$t("options.title")}}
               <i :class="[gcOptionsCollapsed ? '': 'is-active', 'fas', 'fa-angle-down', 'fa-sm']"></i>
              </p>

              <!-- watermark -->
              <div class="is-inline-block" style="opacity: 0.65; margin-bottom: 0.5rem;" 
                v-if="!availableOptions.includes('nologo')">
                <span style="font-size: 0.7rem;">powered by</span><br>
                <img src="img/logo.png" alt="geo|cledian" style="width: 100px; margin: -10px 0;">
              </div>

              </div>

              <div :id="'mapOptions_'+gcWidgetId" :class="[gcOptionsCollapsed ? 'is-hidden': '', 'mapOptions', 'is-horizontal', 'is-flex']">
              <div class="is-horizontal is-flex">
                <div class="field is-vertical" v-show="availableOptions.includes('colorMap')">
                  <div class="field-label">
                    <label class="label has-text-left is-grey"> {{$t("options.colormapLabel")}} </label></div>
                  <div class="control">
                    <div class="select is-small">
                      <select v-model="colormap" :disabled="this.colormapEnabled === false">
                          <option value="" selected>{{$t("options.colormap.default")}}</option>
                          <option value="variations">{{$t("options.colormap.variations")}}</option>
                          <option value="vitality">{{$t("options.colormap.vitality")}}</option>
                          <option value="ndvi">{{$t("options.colormap.ndvi")}}</option>
                          <option value="ndre1">{{$t("options.colormap.ndre1")}}</option>
                          <option value="ndre2">{{$t("options.colormap.ndre2")}}</option>
                          <option value="ndwi">{{$t("options.colormap.ndwi")}}</option>
                          <option value="ndwi_fc">{{$t("options.colormap.ndwi_fc")}}</option>
                          <option value="ndwi_fb">{{$t("options.colormap.ndwi_fb")}}</option>
                          <option value="savi">{{$t("options.colormap.savi")}}</option>
                          <option value="evi2">{{$t("options.colormap.evi2")}}</option>
                          <option value="cire">{{$t("options.colormap.cire")}}</option>
                          <option value="npcri">{{$t("options.colormap.npcri")}}</option>
                          <option value="pseudocolor">{{$t("options.colormap.pseudocolor")}}</option>
                          <option value="redblue">{{$t("options.colormap.redblue")}}</option>
                          <option value="bluered">{{$t("options.colormap.bluered")}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- image options -->
                <div class="field is-vertical">
                <!-- brightness only available for visible product -->
                <div class="field" v-show="availableOptions.includes('imageBrightness') && this.selectedProduct === 'visible'">
                  <div class="field-label">
                    <label class="label has-text-left is-grey"> {{$t("options.imageBrightnessLabel")}} </label></div>
                  <div class="control">
                    <div class="is-small">
                      <input :id="'inpBrightnessSlider_' + this.gcWidgetId" type="range" class="slider is-small is-orange" min="0.5" max="15.0" value="1.0" step="0.1" 
                          v-model="imageBrightness">
                      <button class="button is-small is-orange is-light" style="vertical-align: middle !important;" :title="$t('options.sliderReset')" v-on:click="imageBrightness=1.0;">
                        <i class="fas fa-undo fa"></i>
                      </button>
                    </div>
                  </div>
              </div>
              <div class="field" v-show="availableOptions.includes('imageTransparency')">
                <div class="field-label">
                  <label class="label has-text-left is-grey"> {{$t("options.imageTransparencyLabel")}} </label></div>
                <div class="control">
                  <div class="is-small">
                    <input :id="'inpTransparencySlider_'+ this.gcWidgetId" type="range" class="slider is-small is-orange" min="0.0" max="1.0" value="0.0" step="0.1"
                        v-model="imageTransparency">
                    <button class="button is-small is-orange is-light" style="vertical-align: middle !important;" :title="$t('options.sliderReset')" v-on:click="imageTransparency=0.0;">
                      <i class="fas fa-undo fa"></i>
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div><!-- image options -->
            </div><!-- map options -->

            <!-- attributive css here -->
            <div gc-map class="notification gc-api-message" v-show="this.api_err_msg.length > 0" v-html="this.api_err_msg"></div>

            <!-- container for map and newParcel div -->
            <div :id="'innerContainer_'+ this.gcWidgetId" class="is-inline">

            <div :id="'map_'+ this.gcWidgetId" class="gc-map" v-show="this.api_err_msg.length==0">
            <!-- mobile: onclick and onblur events instead of onmouseover and onmouseout -->
            <div :id="'layerControl_'+gcWidgetId" class="layerControl" v-on:mouseover="growLayerControl" 
                                    v-on:mouseout="shrinkLayerControl" 
                                    v-on:click="growLayerControl" 
                                    v-on:blur="shrinkLayerControl">
              <button gc-map :id="'btnLayerControl_'+gcWidgetId" class="button is-light is-orange">
                <img src="img/layers.png" width="18px" height="18px">
              </button>
              <div :id="'layerControlContent_'+gcWidgetId" class="layerControlContent is-hidden" style="display: inline-grid;">
                <input :id="'rdBasemap1_'+gcWidgetId" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+gcWidgetId" 
                    value="arcgis" v-model="currentBasemap"  v-if="this.isArcGISValid">
                <label :for="'rdBasemap1_'+gcWidgetId" class="is-orange is-small"  v-if="this.isArcGISValid">ArcGIS Online</label>
                <input :id="'rdBasemap2_'+gcWidgetId" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+gcWidgetId" 
                value="osm" v-model="currentBasemap"> 
                <label :for="'rdBasemap2_'+gcWidgetId" class="is-orange is-small">OpenstreetMap</label>
                <input :id="'rdBasemap3_'+gcWidgetId" type="radio" class="is-checkradio is-orange is-small" :name="'basemap_'+gcWidgetId"
                    value="google" v-model="currentBasemap" v-if="isGoogleValid"> 
                <label :for="'rdBasemap3_'+gcWidgetId" class="is-orange is-small" v-if="isGoogleValid">Google Hybrid</label>
              <hr>
                <input :id="'cbOperational1_'+gcWidgetId" type="checkbox" class="is-checkradio is-orange is-small"
                  v-model="parcelLayerVisible">
                <label :for="'cbOperational1_'+gcWidgetId" class="is-orange is-small">{{$t("layers.parcels")}}</label>
                <input :id="'cbOperational2_'+gcWidgetId" type="checkbox" class="is-checkradio is-orange is-small" 
                    v-model="imageLayerVisible"> 
                <label :for="'cbOperational2_'+gcWidgetId" class="is-orange is-small">{{$t("layers.images")}}</label>
              </div>
            </div><!-- layerControl -->

            <div :id="'divMapBtns_'+gcWidgetId" class="divMapBtns" style="padding-top: 42px; padding-left: 6px; float: left;">
                <button gc-map :title="$t('map.buttons.createParcel.title')" :class="[this.activeMapActions.includes('edit') ? ['is-dark', 'is-active'] : 'is-light', 'button', 'is-orange']" 
                        v-on:click="createParcelAction" v-show="availableTools.includes('edit')">
                  <i class="fas fa-edit"></i>
                </button>
              
              <button gc-map :id="'btnDeleteParcel_'+gcWidgetId" :title="$t('map.buttons.deleteParcel.title')" class="button is-light is-orange" 
                      v-on:click="deleteParcelAction" v-show="availableTools.includes('delete')" disabled>
                <i class="fas fa-trash-alt"></i>
              </button>
              
                <button gc-map :id="'btnQueryIndexValue_'+this.gcWidgetId" :title="$t('map.buttons.queryIndexValue.title')" :class="[this.activeMapActions.includes('query') ? ['is-dark', 'is-active'] : 'is-light', 'button', 'is-orange']"
                      v-on:click="queryIndexValueAction" v-show="availableTools.includes('query')" disabled>
                  <i class="fas fa-info-circle"></i>
                </button>
                <button gc-map :id="'btnToggleLegend_'+gcWidgetId" :title="$t('map.buttons.toggleLegend.title')" :class="[this.activeMapActions.includes('legend') ? ['is-dark', 'is-active'] : 'is-light', 'button', 'is-orange']"
                      v-on:click="toggleLegend"
                      v-on:mouseover=""
                      v-if="availableTools.includes('legend')">
                  <i class="fas fa-list-ul"></i>
                </button>
                <!-- URL will be injected here in the a-tags after sucessful load of raster in map -->
                <!-- Download is implemented this way because png is shown in browser per default; but it
                      should download the image directly -->
                <div :id="'downloadImage_'+gcWidgetId" class="downloadImage has-text-centered"
                                                                 v-if="availableTools.includes('downloadImage')"
                                                                  v-on:mouseover="growImageControl" 
                                                                  v-on:mouseout="shrinkImageControl" 
                                                                  v-on:click="growImageControl" 
                                                                  v-on:blur="shrinkImageControl">

                  <button gc-map :id="'btnDownloadImage_'+gcWidgetId" class="button is-orange is-light">
                    <i class="fas fa-download"></i>
                  </button>
                  <div :id="'downloadImageContent_'+gcWidgetId" class="is-hidden" style="display: inline-grid;">
                    <a gc-map :id="'btnDownloadImagePng_'+gcWidgetId" :title="$t('map.buttons.downloadImagePNG.title')" class="button is-light is-orange" 
                        href="" download="" target="_blank" style="padding-left: 0.45rem; padding-right: 0.45rem;">
                        <!-- line-height: 0.75rem; -->
                        <div style="display: inline-grid; vertical-align: middle;">
                          <span class="is-size-7" style="line-height: 0.75rem;"><i class="fas fa-download"></i></span>
                          <span class="is-size-7" style="line-height: 0.75rem;">png</span>
                        </div>
                      </a>
                    <a gc-map :id="'btnDownloadImageTif_'+gcWidgetId" :title="$t('map.buttons.downloadImageTIF.title')" class="button is-light is-orange" 
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

            <div class="mapSpinner spinner" v-show="this.isloading">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>

            <div :id="'mapLegendContent_'+gcWidgetId" 
                  :class="[gcLegendPosition === 'topright' ? 'topright' : 'bottomleft', 'mapLegendContent','has-text-justified','is-hidden']">
            </div>

            <!-- product selector -->
            <div class="field product-selector"
                  v-if="availableTools.includes('productSelector')">
              <div class="control">
                <div class="select is-small">
                <select v-model="selectedProduct" class="is-small">
                  <option v-for="p in availableProducts" v-bind:value="p">
                    <span>{{ $t('products.'+p)}}</span>
                  </option>
                </select>
                </div>
              </div>
            </div> <!-- product selector -->

          </div><!-- map -->
          <!-- divCreateParcel -->
          <!-- flex-grow 1 is looks better for aligning label and field -->
          <div class="is-hidden" :id="'divCreateParcel_'+this.gcWidgetId" style="margin-top: 0.75em; margin-left: 1em; margin-right: 1em; flex-grow: 1 !important;"> 
              <p class="subtitle is-6 is-orange"><i class="fas fa-plus-circle fa-lg"></i> {{ $t('newParcel.title') }} </p>  
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.apikey') }} </label></div>
                <div class="control">
                  <input type="text" class="input is-small"
                          placeholder="[00000000-0000-0000-0000-00000000000]" v-model="newParcel.key">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.crop') }} </label></div>
                <div class="control">
                    <input type="text" class="input is-small"
                          :placeholder="'['+$t('newParcel.crop')+']'" v-model="newParcel.crop">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.seeding') }} </label></div>
                <div class="control">
                    <input :id="'inpPlantDate_'+ gcWidgetId" type="text" class="input is-small"
                          :placeholder="'[' + $t('newParcel.date_format_hint') +']'" v-model="newParcel.planting" v-on:change="">
                </div>
              </div>
              <div class="field is-horizontal">
                  <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.harvest') }}</label></div>
                  <div class="control">
                      <input :id="'inpHarvestDate_'+ gcWidgetId" type="text" class="input is-small"
                          :placeholder="'[' + $t('newParcel.date_format_hint') +']'" v-model="newParcel.harvest" v-on:change="">
                  </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.name') }} </label></div>
                <div class="control">
                    <input type="text" class="input is-small"
                    :placeholder="'['+$t('newParcel.name')+']'" v-model="newParcel.name">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.entity') }} </label></div>
                <div class="control">
                  <input type="text" class="input is-small"
                  :placeholder="'['+$t('newParcel.entity')+']'" v-model="newParcel.entity">
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small"><label class="label is-grey has-text-left"> {{ $t('newParcel.promotion') }} </label></div>
                <div class="control" style="position: relative; top: 0.5rem;"> <!-- centers checkbox -->
                  <input type="checkbox" class="content is-small"
                            v-model="newParcel.promotion">
                </div>
              </div>
              <div class="has-text-centered">
                <button :id="'btnRegisterParcel_'+this.gcWidgetId" class="button is-light is-orange" v-on:click="registerParcel()">
                    <i class="fas fa-save fa-sm"></i><span class="content"> {{ $t('newParcel.register') }} </span>
                </button>
              </div>
              <div :id="'divNewParcelMsg_'+this.gcWidgetId" class="notification is-light is-grey is-normal is-hidden">
                {{ this.api_msg }}
              </div>
            </div><!-- divCreateParcel -->

            </div>
            <!-- container for map and newParcel div -->

            <div :id="'timelineContainer_'+this.gcWidgetId" class="" v-show="availableTools.includes('video') && !activeMapActions.includes('edit')">
            <!-- video -->
            <div :id="'player_'+this.gcWidgetId" class="gc-player is-pulled-left" style="z-index: 1000; position: relative; left: 0px; bottom: 0px; margin-bottom: 0px!important;">
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
            <div :id="'timeline_'+this.gcWidgetId">
            </div>
            </div>
            </div><!-- gcWidgetId -->`,
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
      drawControl: undefined,
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
      colormapEnabled: true,
      imageBrightness: 1.0,
      imageTransparency: 0.0,
      currentBasemap: this.gcBasemap,
      currentRasterIndex: 0,
      internalCurrentParcelID: -1, //for internal use of widget only, if not set from outer gcCurrentParcelId prop
      internalSelectedProduct: "", //for internal use of widget only, if not set from outer gcSelectedProduct prop
      parcels: [],
      offset: 0,
      pagingStep: 250,
      total_parcel_count: 250,
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
      zoomControl: undefined,
      searchControl: undefined,
      currentTimeseries: [],
      isGoogleValid: true, //will be set automatically to false if Google Maps API fails
      //
      // Make sure you comply with terms of use for ESRI ArcGIS Online Services first: https://www.esri.com/en-us/legal/terms/full-master-agreement
      //
      isArcGISValid: false, //to be set manually from developer!
      isloading: false, // indicates if data is being loaded or not
      api_err_msg: "", // if there is an error from the API, it will stored here; if length > 0 it will be displayed
      activeMapActions: [] // may contain "edit", "query", "legend"
    }
  },
  computed: {
    apiKey: {
      get: function () {
          return this.gcApikey;
      }
    },
    apiHost: {
        get: function () {
            return this.gcHost;
        }
    },
    apiBaseUrl: {
        get: function () {
            return this.gcApiBaseUrl;
      }
    },
    apiSecure: {
      get: function () {
          return this.gcApiSecure;
      }
    },
    currentParcelID: {
      get: function() {
        // if parcel id is not set externally via prop, take the internal one!
        if (this.gcCurrentParcelId === -1)
          return this.internalCurrentParcelID;
        else 
          return this.gcCurrentParcelId;
      },
      set: function(newValue) {
        // always emit to root
        this.$root.$emit('currentParcelIdChange', newValue);

        // if parcel id is not set externally via prop, take the internal one!
        if (this.gcCurrentParcelId === -1)
          this.internalCurrentParcelID = newValue;
      }
    },
    availableProducts: {
      get: function () {
        //filter S2/LS8 products dependent on data source
        return this.filterDatasourceProductCompat(this.selectedSource, this.gcAvailableProducts.split(","));
      },
    },
    selectedSource: {
      get: function () {
        return this.gcDataSource;
      },
      set: function (newValue) {
        this.$root.$emit("dataSourceChange", newValue);
      }
    },
    availableTools: {
      get: function () {
        return (this.gcAvailableTools.split(","));
      },
    },
    selectedDate: {
      get: function() {
        return this.gcSelectedDate;
      },
      set: function(value) {
        console.debug("selectedDate - setter: "+value);
        // emitting to root instance 
        this.$root.$emit("queryDateChange", value);
      }
    },
    currentDate: {
      get: function () {
        // currentRasterIndex to date
        var p = this.getCurrentParcel();
        if (p) {
          if (p.timeseries) {
            if (this.currentRasterIndex >= 0)
              return p.timeseries[this.currentRasterIndex].date;
          }
        }
      },
      set: function (newValue) {

        if (!this.isDateValid(newValue)) {
          console.error("currentDate - setter: date invalid: "+newValue);
          return;
        }
        if (this.currentParcelID > 0) {
          // parcel_id assumed unique, so return only the first
          // compare strings
          var p = this.getCurrentParcel();
          if (p) {
            if (p.timeseries) {
              // snaps to closest date
              let idx = this.getClosestTimeSeriesIndex(new Date(newValue).simpleDate());
              //let idx = p.timeseries.indexOf(p.timeseries.filter(t=>t.date == new Date(newValue).simpleDate() )[0]);
              if (idx >= 0) {
                // changing the index will change the image (if date is available)
                this.currentRasterIndex = idx;
              }
            }
          }
        }
      }
    },
    availableOptions: {
      get: function() {
        return (this.gcAvailableOptions.split(","));
      }
    },
    currentLanguage: {
      get: function() {
        // will always reflect prop's value 
        return this.gcLanguage;
      },
    },
    selectedProduct: {
      get: function() {
        // workaround for external setting of not existent product (sos,eos,pos) 
        // fallback to vitality if present
        if (["sos","eos","pos"].includes(this.gcSelectedProduct) && this.availableProducts.includes("ndvi")){
          return "ndvi";
        }
        else {
          if (this.gcSelectedProduct.length>0)
            return this.gcSelectedProduct;
          else
            return this.internalSelectedProduct;
        }
      },
      set: function (newValue) {
        this.internalSelectedProduct = newValue;
        //notify root - through props it will change this.gcSelectedProduct
        this.$root.$emit('selectedProductChange', newValue);
      }
    },
  },
  i18n: { 
    locale: this.currentLanguage,
    messages: gcMapLocales
  },
  created: function () {
    console.debug("gc-map created!");
    this.changeLanguage();
  },
  /* when vue component is mounted (ready) on DOM node */
  mounted: function () {
    
    console.debug("gc-map - mounted!");

    // listen on size change handler
    this.$root.$on("containerSizeChange", this.containerSizeChange);
    
    try {
      this.changeLanguage();
    } catch (ex) {}
    
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
          document.getElementById("btnQueryIndexValue_" + this.gcWidgetId).disabled = false;
          document.getElementById("btnToggleLegend_" + this.gcWidgetId).disabled = false;
        } else {
          console.debug("disabling btnQueryIndexValue");
          //end query mode if active
          try {this.disableQueryBtn();} catch (err) {}
          //disable button
          document.getElementById("btnQueryIndexValue_" + this.gcWidgetId).disabled = true;
          document.getElementById("btnToggleLegend_" + this.gcWidgetId).disabled = true;
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
    currentParcelID: function (newValue, oldValue) {

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
        if (this.activeMapActions.includes('query')) {
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
        let images = document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-image-layer");
        for (var i = 0; i < images.length; i++) {
          images[i].style.filter = filterString;
        }
      }
    },
    imageTransparency: function (newValue, oldValue) {
        
      if (newValue != oldValue) {
        let filterString = "brightness( "+this.imageBrightness +") opacity("+(1.0 - newValue)+")";
        // do this for all images in this widget
        let images = document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-image-layer");
        for (var i = 0; i < images.length; i++) {
          images[i].style.filter = filterString;
        }
      }
    },
    parcels(newValue, oldValue) {
      //notify root
      this.$root.$emit("parcelsChange", newValue);
    },
    currentLanguage(newValue, oldValue) {
      this.changeLanguage();

      //refresh legend also if active - because HTML is created dynamically, translation changes will not fire as usual
      if (this.parcels.length > 0 && this.activeMapActions.includes("legend")) {
        this.addLegendControl(this.mymap);
      }
      //refresh leaflet map controls
      this.initZoomControl();
      this.initSearchControl();
      // only reinit draw control if editing is toggled - otherwise it will show up in any case
      if (this.drawControl)
        this.initDrawControl();

      //reset date pickers
      this.initDatePickers();
    },
    gcSelectedDate(newValue, oldValue) {
      console.debug("gcSelectedDateChange");
      //set date
      this.currentDate = newValue;
    },
    currentTimeseries(newValue, oldValue) {
      console.debug("timeseriesChange");
      console.debug(newValue);
      //notify root
      this.$root.$emit("timeseriesChange", newValue);
    }
  },
  methods: {
    getApiUrl: function (endpoint, request_method) {
      /* handles requests directly against  geocledian endpoints with API keys
          or (if gcProxy is set)
        also requests against the URL of gcProxy prop without API-Key; then
        the proxy or that URL has to add the api key to the requests against geocledian endpoints
      */
      let protocol = 'http';

      if (this.apiSecure) {
        protocol += 's';
      }

      // if (this.apiEncodeParams) {
      //   endpoint = encodeURIComponent(endpoint);
      // }
      
      if (request_method === "POST") {
        // omit API KEY on POST; it should be already inside the JSON Payload
        // if the API is passed as query parameter in the URL, API will fail with "key is not authorized!"
        return (this.gcProxy ? 
          protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint  : 
          protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint);
      }
      else {
        // with or without apikey depending on gcProxy property
        return (this.gcProxy ? 
                  protocol + '://' + this.gcProxy + this.apiBaseUrl + endpoint  : 
                  protocol + '://' + this.gcHost + this.apiBaseUrl + endpoint + "?key="+this.apiKey);
      }
    },
    initMap: function () {
      console.debug("initMap()");

      // now init map
      try {
        /* init map */
        this.mymap = L.map("map_"+this.gcWidgetId, {
          zoomControl: false
        });
      } catch (err) {
        // TODO notice for UI
        console.error("Error initializing the map with id '" + this.gcWidgetId + "'!");
  
        this.$el.innerHTML = "";
        this.$destroy();
        return;
      }   
      
      //init popup for index value lat/lon
      this.popup = L.popup({autoClose: true, closeOnClick: false}).setContent('<span class="is-large"><b>'+this.$t("map.popups.indexValue")+ ': ');

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

      this.initZoomControl();

      // set map center to Landshut
      this.mymap.setView(new L.LatLng(48.535, 12.152), 10);
  
      this.addControlPlaceholders(this.mymap);
  
      this.initSearchControl();

      if (this.gcInitialLoading === true) {
        //initial loading data
        console.debug("initial data loading");
        this.getParcelTotalCount(this.filterString);
      }

      //space enables start stop of video
      document.addEventListener('keyup', (e) => {
        if (e.code === "Space") {       
          this.startPauseVideo();
        } 
      });

      this.initDatePickers();

      //init datepickers - load external Javascript file in this component
      // this.loadJSscript("css/bulma-ext/bulma-calendar.min.js", function() {
      //   this.initDatePickers();
      //   }.bind(this)
      // );
    },
    destroyMap () {
      if (this.mymap) {
        this.mymap.off();
        this.mymap.remove();
      }
    },
    initZoomControl() {
      if (this.zoomControl) {
        this.mymap.removeControl(this.zoomControl);
      }
      // add zoom control (position)
      this.zoomControl = new L.Control.Zoom({
        position: 'bottomright',
        zoomInTitle: this.$t("map.zoomIn"),
        zoomOutTitle: this.$t("map.zoomOut"),
      }).addTo(this.mymap);
    },
    initSearchControl() {
      // GeoSearch Control
      if (this.searchControl) {
        this.mymap.removeControl(this.searchControl);
      }
      let provider = new window.GeoSearch.OpenStreetMapProvider();

      this.searchControl = new window.GeoSearch.GeoSearchControl({
        provider: provider,
        //style: 'bar',
        autoComplete: true,
        autoCompleteDelay: 250,
        animateZoom: true,
        autoClose: true,
        searchLabel: this.$t("map.searchLabel"),
        keepResult: true,
        position: 'bottomright'
      }).addTo(this.mymap);
    },
    initDatePickers() {

      if (this.inpPlantDatePicker) {
        this.inpPlantDatePicker.destroy();
      }

      this.inpPlantDatePicker = new bulmaCalendar( document.getElementById( 'inpPlantDate_'+this.gcWidgetId ), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.gcLanguage, // internationalization
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
      
      if (this.inpHarvestDatePicker) {
        this.inpHarvestDatePicker.destroy();
      }
      this.inpHarvestDatePicker = new bulmaCalendar( document.getElementById( 'inpHarvestDate_'+this.gcWidgetId ), {
        startDate: new Date(), // Date selected by default
        dateFormat: 'yyyy-mm-dd', // the date format `field` value
        lang: this.gcLanguage, // internationalization
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
    },
    initDrawControl() {

      if (this.drawControl) {
        this.mymap.removeControl(this.drawControl);
      }
        
      // i18n for drawControl
      L.drawLocal.draw.toolbar.actions.title = this.$t("map.drawControl.L_drawLocal_draw_toolbar_actions_title");
      L.drawLocal.draw.toolbar.actions.text = this.$t("map.drawControl.L_drawLocal_draw_toolbar_actions_text");
      L.drawLocal.draw.toolbar.finish.title = this.$t("map.drawControl.L_drawLocal_draw_toolbar_finish_title");
      L.drawLocal.draw.toolbar.finish.text = this.$t("map.drawControl.L_drawLocal_draw_toolbar_finish_text");
      L.drawLocal.draw.toolbar.undo.title = this.$t("map.drawControl.L_drawLocal_draw_toolbar_undo_title");
      L.drawLocal.draw.toolbar.undo.text = this.$t("map.drawControl.L_drawLocal_draw_toolbar_undo_text");
      L.drawLocal.draw.toolbar.buttons.polygon = this.$t("map.drawControl.L_drawLocal_draw_toolbar_buttons_polygon");
      L.drawLocal.draw.handlers.polygon.tooltip.start = this.$t("map.drawControl.L_drawLocal_draw_handlers_polygon_tooltip_start");
      L.drawLocal.draw.handlers.polygon.tooltip.cont = this.$t("map.drawControl.L_drawLocal_draw_handlers_polygon_tooltip_cont");
      L.drawLocal.draw.handlers.polygon.tooltip.end = this.$t("map.drawControl.L_drawLocal_draw_handlers_polygon_tooltip_end");
      L.drawLocal.edit.toolbar.actions.save.title = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_save_title");
      L.drawLocal.edit.toolbar.actions.save.text = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_save_text");
      L.drawLocal.edit.toolbar.actions.cancel.title = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_cancel_title");
      L.drawLocal.edit.toolbar.actions.cancel.text = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_cancel_text");
      L.drawLocal.edit.toolbar.actions.clearAll.title = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_clearAll_title");
      L.drawLocal.edit.toolbar.actions.clearAll.text = this.$t("map.drawControl.L_drawLocal_edit_toolbar_actions_clearAll_text");
      L.drawLocal.edit.toolbar.buttons.edit = this.$t("map.drawControl.L_drawLocal_edit_toolbar_buttons_edit");
      L.drawLocal.edit.toolbar.buttons.editDisabled = this.$t("map.drawControl.L_drawLocal_edit_toolbar_buttons_editDisabled");
      L.drawLocal.edit.toolbar.buttons.remove = this.$t("map.drawControl.L_drawLocal_edit_toolbar_buttons_remove");
      L.drawLocal.edit.toolbar.buttons.removeDisabled = this.$t("map.drawControl.L_drawLocal_edit_toolbar_buttons_removeDisabled");
      L.drawLocal.edit.handlers.edit.tooltip.text = this.$t("map.drawControl.L_drawLocal_edit_handlers_edit_tooltip_text");
      L.drawLocal.edit.handlers.edit.tooltip.subtext = this.$t("map.drawControl.L_drawLocal_edit_handlers_edit_tooltip_subtext");
      L.drawLocal.edit.handlers.remove.tooltip.text = this.$t("map.drawControl.L_drawLocal_edit_handlers_remove_tooltip_text");

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

      this.drawControl.setPosition(this.gcDrawcontrolPosition);

      this.mymap.addControl(this.drawControl);
      
    },
    getParcelTotalCount: function (filterString) {

      this.isloading = true;
      this.api_err_msg = ""; // empty api messages

      const endpoint = "/parcels";
      let params;

      if (filterString) {
        params = filterString + "&count=True";
      } else {
        params = "&count=True";
      }

      //Show requests on the DEBUG console for developers
      console.debug("getParcelTotalCount()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint) + params,
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;

          if (tmp.content == "key is not authorized") {
            // show message, hide spinner, don't show map
            this.api_err_msg = this.$t('api_msg.unauthorized_key') + "<br>" + this.$t('api_msg.support');
            this.isloading = false;
            return;
          }
          if (tmp.content == 	"api key validity expired") {
              // show message, hide spinner, don't show map
              this.api_err_msg = this.$t('api_msg.invalid_key') + "<br>" + this.$t('api_msg.support');
              this.isloading = false;
              return;
          }

          if ("count" in tmp) {

            this.total_parcel_count = tmp.count;

            // minimum of 250
            if (this.total_parcel_count < this.pagingStep) {
              this.pagingStep = this.total_parcel_count;
            } else {
              this.pagingStep = 250;
            }

            if (this.total_parcel_count == 0) {
              return;
            } 
            else {
              // now get all parcels
              if (this.currentParcelID > 0) {
                this.getAllParcels(this.currentParcelID, this.offset, filterString);
              } 
              else {
                this.getAllParcels(undefined, this.offset, filterString);
              }
            }
          }
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    getAllParcels: function (parcel_id, offset, filterString) {

      // show spinner
      this.isloading = true;
      this.api_err_msg = ""; // empty api messages

      //download in chunks of n parcels
      let limit = 6000; //this.pagingStep;
      
      const endpoint = "/parcels";
      let params = "&limit=" + limit; //set limit to maximum (default 1000)

      if (offset) {
        params = params + "&offset=" + offset;
      }
      if (filterString) {
        params = params + filterString;
      }

      //Show requests on the DEBUG console for developers
      console.debug("getAllParcels()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint) + params,
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;
          if (tmp.content == "key is not authorized") {
            // show message, hide spinner, don't show map
            this.api_err_msg = this.$t('api_msg.unauthorized_key') + "<br>" + this.$t('api_msg.support');
            this.isloading = false;
            return;
          }
          if (tmp.content == 	"api key validity expired") {
              // show message, hide spinner, don't show map
              this.api_err_msg = this.$t('api_msg.invalid_key') + "<br>" + this.$t('api_msg.support');
              this.isloading = false;
              return;
          }

          this.parcels = [];

          if (tmp.content.length == 0) {
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
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
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
        
        // TODO: change to declarative vue style with v-show / v-if ; get rid of HTML ids
        try { document.getElementById("btnDeleteParcel_" + this.gcWidgetId).disabled = false; } catch (err) {}
        if (this.selectedProduct != "visible") {
          try { document.getElementById("btnQueryIndexValue_" + this.gcWidgetId).disabled = false; } catch (err) {}
          try { document.getElementById("btnToggleLegend_" + this.gcWidgetId).disabled = false; } catch (err) {}
        }
      } else {
        try { document.getElementById("btnDeleteParcel_" + this.gcWidgetId).disabled = true; } catch (err) {}
        try { document.getElementById("btnQueryIndexValue_" + this.gcWidgetId).disabled = true; } catch (err) {}
        try { document.getElementById("btnToggleLegend_" + this.gcWidgetId).disabled = true; } catch (err) {}
      }
    },
    //returns detailed data from REST service by passing the selected parcel_id
    filterDetailData: function () {

      console.debug("methods - filterDetailData");

      this.getParcelsAttributes(this.currentParcelID);
    },
    getParcelsAttributes(parcel_id) {

      const endpoint = "/parcels/" + parcel_id;

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsAttributes()");
      console.debug("GET " + this.getApiUrl(endpoint));
      
      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint),
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;
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
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    getParcelsProductData: function (parcel_id, productName, source) {

      //show spinner
      this.isloading = true;

      const endpoint = "/parcels/" + parcel_id + "/" + productName
      let params = "&source=" + source + "&order=date";

      // empty timeseries first!
      this.currentTimeseries = [];

      //Show requests on the DEBUG console for developers
      console.debug("getParcelsProductData()");
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint) + params,
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;
          let row = this.getCurrentParcel();

          if (tmp.content.length > 0) {
            // add new attributes via Vue.set

            // one parcel can have 1-n rasters of the same product (time series!)
            // add all rasters (=time series)
            Vue.set(row, "timeseries", tmp.content); //url + tmp.content[0].png + "?key=" + key);

            //also set current timeseries
            this.currentTimeseries = tmp.content;

            //set max value of timeslider
            //document.getElementById("inpTimeSlider").max = tmp.content.length -1;

            try{ 
              //init only if in Non-Edit mode
              if (!this.activeMapActions.includes("edit"))
                this.initTimeline();
            } 
            catch (err) {}

            //show raster in map
            this.showCurrentRaster();

            //enable time slider buttons
            try { this.disableTimeSlider(false); } catch (err) {}

            //hide spinner
            this.isloading = false;
          }
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
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
        const endpoint =  row.png;
        let params = "&colormap=" + this.colormap;
        this.map_addRaster(this.getApiUrl(endpoint) + params, row.bounds);

        if (this.activeMapActions.includes("legend")) {
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
        let parcel_id = this.currentParcelID;
        const endpoint =  "/parcels/" + parcel_id + "/" + row.product + "/" + row.source + "/" + row.raster_id + ".png";
        let params = "&legend=true" + "&colormap=" + this.colormap;
        let legendUrl = this.getApiUrl(endpoint) + params;

        //Show requests on the DEBUG console for developers
        console.debug("showLegend()");
        console.debug("GET " + legendUrl);

        let downloadingImage;
        if (row.product == "variations") {
          document.getElementById("mapLegendContent_" + this.gcWidgetId).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.gcWidgetId + '" src="' +
            '" title="The dark blue value stands for the minimum NDVI value in the parcel and dark red ' +
            'indicates the maximum NDVI values within the parcel for the measurement date">' +
            '<br><span>min NDVI max</span>';

          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.gcWidgetId).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        }
        if (row.product == "vitality") {
          document.getElementById("mapLegendContent_" + this.gcWidgetId).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.gcWidgetId +
            '" title="The brown value means no living green vegetation (NDVI value <= 0.1)' +
            'and dark green means dense living green vegetation (NDVI value >= 0.9)">' +
            '<br><span style="padding-left: 8px; padding-right: 20px;">0.1 NDVI 0.9</span>';

          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.gcWidgetId).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        } else {
          document.getElementById("mapLegendContent_" + this.gcWidgetId).innerHTML = '<span style="font-size: 13px"><b>Legend</b></span><br><img class="mapLegendContentImage" id="mapLegendContentImage_' + this.gcWidgetId +
            '" title="">' +
            '<br><span style="padding-left: 8px; padding-right: 20px;">min Index max</span>';
          //download async
          downloadingImage = new Image();
          downloadingImage.onload = function () {
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).src = downloadingImage.src;
            document.getElementById("mapLegendContent_" + this.gcWidgetId).classList.remove("is-hidden");
            document.getElementById("mapLegendContentImage_" + this.gcWidgetId).style.opacity = 1;
          }.bind(this);
          downloadingImage.src = legendUrl;

          return;
        }
      } else {
        document.getElementById("mapLegendContent_" + this.gcWidgetId).classList.add("is-hidden");
      }
    },
    getIndexValueforCoordinate(latlng) {

      let parcel_id = this.currentParcelID;
      let productName = this.selectedProduct;
      let source = this.getCurrentRaster().source;
      let raster_id = this.getCurrentRaster().raster_id;

      const endpoint =  "/parcels/" + parcel_id + "/" + productName + "/" + source + "/" + raster_id;
      let params =  "&lat=" + latlng.lat + "&lon=" + latlng.lng;

      //Show requests on the DEBUG console for developers
      console.debug("GET " + this.getApiUrl(endpoint) + params);

      // Axios implement start
      axios({
        method: 'GET',
        url: this.getApiUrl(endpoint) + params,
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;

          if (tmp.content.length > 0) {
            this.popup.setContent('<span class="is-large"><b>' + this.$t("map.popups.indexValue")+ ': '+
              // Math.ceil(latlng.lat * 1000)/1000 + ", " + 
              // Math.ceil(latlng.lng * 1000)/1000 +"</b></span><br><span>"+
              this.formatDecimal(tmp.content[0].pixel_value) + "</span>");
          }
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    createParcelAction: function () {

      try {
        if (this.activeMapActions.includes("query")) {
            this.disableQueryBtn();
        }        
      }
      catch (err)
      { console.debug("could not disable query button.");}

      if (this.activeMapActions.includes("edit")) {

        try {
          // document.getElementById(this.gcWidgetId).getElementsByClassName("gc-logo")[0].classList.remove("is-hidden");
          this.disableCreateParcelBtn();
          // document.getElementById(this.gcWidgetId).getElementsByClassName("gc-options-title")[0].classList.remove("is-hidden");
          // if (this.availableTools.includes('video')) {
          //   document.getElementById("timelineContainer_"+this.gcWidgetId).classList.remove("is-hidden");
          // }
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
        // try { 
        //   document.getElementById("timelineContainer_"+this.gcWidgetId).classList.add("is-hidden"); 
        // } catch (err) { }

        //reset mapOptions
        // document.getElementById(this.gcWidgetId).getElementsByClassName("gc-options-title")[0].classList.add("is-hidden");
        // document.getElementById("mapOptions_"+ this.gcWidgetId).classList.add("is-hidden");
        // document.getElementById(this.gcWidgetId).getElementsByClassName("gc-options-title")[0].children[0].classList.remove("is-active");
        // document.getElementById(this.gcWidgetId).getElementsByClassName("gc-logo")[0].classList.add("is-hidden");

        // document.getElementById(this.gcWidgetId).classList.remove("is-inline");
        // document.getElementById(this.gcWidgetId).classList.add("is-flex");
        document.getElementById("innerContainer_" + this.gcWidgetId).classList.remove("is-inline");
        document.getElementById("innerContainer_" + this.gcWidgetId).classList.add("is-flex");

        // document.getElementById("map_"+this.gcWidgetId).style.height = "480px";
        document.getElementById("map_"+this.gcWidgetId).style.width = "70%";
        this.mymap.invalidateSize(); // make sure map resizes also

        document.getElementById("divCreateParcel_" + this.gcWidgetId).classList.remove("is-hidden");
        document.getElementById("divNewParcelMsg_" + this.gcWidgetId).innerHTML = '';

        this.map_startEditing();

        if (!this.activeMapActions.includes("edit"))
          this.activeMapActions.push("edit");

        // try {
        //   document.getElementById("btnCreateParcel_" + this.gcWidgetId).classList.add('is-active');
        //   document.getElementById("btnCreateParcel_" + this.gcWidgetId).classList.add("is-dark");
        //   document.getElementById("btnCreateParcel_" + this.gcWidgetId).classList.remove("is-light");
        // } catch (err) { }
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

      document.getElementById("btnDeleteParcel_" + this.gcWidgetId).classList.add("is-loading");

      const endpoint = "/parcels/" + parcel_id;

      //Show requests on the DEBUG console for developers
      console.debug("deleteParcel()");
      console.debug("DELETE " + this.getApiUrl(endpoint));

      // Axios implement start
      axios({
        method: 'DELETE',
        url: this.getApiUrl(endpoint),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then(function (response) {
        if(response.status === 200){
          var tmp = response.data;

          // if (xmlHttp.responseText === "1") {
          //   console.log("parcel deleted.");
          // }
          // if (xmlHttp.responseText === "0") {
          //   console.log("error deleting parcel.");
          // }
          if (xmlHttp.responseText === "") {
            console.log("parcel marked for deletion.");
          }

          //TODO: refresh map & switch to next parcel if possible
          // workaround: delay at least 5 seconds; DELETE operation is asynchronous on the server side
          // it will return 0 or 1 but the deleting will handled some time because its not high priority
          setTimeout( function() {
            this.destroyMap();
            this.initMap();
            /// empty current parcel id so the first one will be selected
            this.currentParcelID = -1;
            this.getParcelTotalCount(this.filterString);
  
            document.getElementById("btnDeleteParcel_" + this.gcWidgetId).classList.remove("is-loading");
            //hide loading spinner
            this.isloading = false;
          }.bind(this), 5000);
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    registerParcel: function () {

      document.getElementById("btnRegisterParcel_" + this.gcWidgetId).classList.add("is-loading");

      // DON't deliver key in POST-Request
      // otherwise error: key is not authorized will return
      const endpoint = "/parcels/";
      let postData = JSON.stringify(this.newParcel);

      //Show requests on the DEBUG console for developers
      console.debug("registerParcel()");
      console.debug("POST " + this.getApiUrl(endpoint, "POST"));
      //console.debug(postData);

      // Axios implement start
      axios({
        method: 'POST',
        url: this.getApiUrl(endpoint, "POST"),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data: postData,
      }).then(function (response) {
        if(response.status === 200){
          console.debug(response.data);
          var tmp = response.data;

          document.getElementById("divNewParcelMsg_" + this.gcWidgetId).classList.remove("is-hidden");

          if (tmp.errors.length > 0) {
            // show error message
            document.getElementById("divNewParcelMsg_" + this.gcWidgetId).innerHTML = "Errors: " + tmp.errors + "<br>";
          }
          if (tmp.messages) {
            // show status message
            document.getElementById("divNewParcelMsg_" + this.gcWidgetId).innerHTML = "Response: " + tmp.messages.status + "<br>";
            this.newParcel.status = tmp.status;
          }
          if (tmp.errors.length == 0) {

            this.newParcel.id = tmp.id;

            //async - so pass the id to be set
            // empty viewModel first!
            this.parcels = [];

            this.getParcelTotalCount(this.filterString);
          }
          document.getElementById("btnRegisterParcel_" + this.gcWidgetId).classList.remove("is-loading");
        }
      }.bind(this)).catch(err => {
        console.log("err= " + err);
      })
      // Axios implement end
    },
    queryIndexValueAction: function () {

      try {
        if (this.activeMapActions.includes("edit")) {
          this.disableCreateParcelBtn();
        }
      }
      catch (err) {}

      try {
        // turn it off
        if (this.activeMapActions.includes("query")) {
          this.disableQueryBtn();
        }
        //turn query on
        else {
          if (!this.activeMapActions.includes("query"))
            this.activeMapActions.push("query");

          //leaflet has its own interactive region within the map (bbox of layers)
          //so change cursor only for this element
          document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-interactive")[0].style.cursor = "crosshair";

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
      if (this.activeMapActions.includes("legend")) {
        try {
          document.getElementById("mapLegendContentImage_" + this.gcWidgetId).style.opacity = 1;
        } catch (err) {}
      }

      //add image filters
      let brightness = document.getElementById("inpBrightnessSlider_"+this.gcWidgetId).value;
      // transparency to opacity
      let transparency = (1.0 - parseFloat(document.getElementById("inpTransparencySlider_"+this.gcWidgetId).value));

      let filterString = "brightness(" + brightness + ")" + " opacity(" + transparency + ")";

      // do this for all images in this widget
      let images = document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-image-layer");
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
      , this.gcImageChangeInterval);

    },
    map_removeParcel: function () {
      this.parcelLayer.clearLayers();
    },
    map_removeAllRasters: function () {
      this.imageLayerGroup.clearLayers();
    },
    map_startEditing: function () {

      this.initDrawControl();

      this.mymap.addLayer(this.drawnItems);
    },
    map_endEditing: function () {

      try {
        this.drawnItems.clearLayers();
        this.mymap.removeLayer(this.drawnItems);
        this.mymap.removeControl(this.drawControl);
        this.drawControl = undefined;
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
        document.getElementById("downloadImage_"+this.gcWidgetId).classList.remove("is-hidden");

        for (var i = 0; i < formats.length; i++) {
          const endpoint = row.png.replace(".png", "."+format);
          let format = formats[i];
          let url = this.getApiUrl(endpoint);

          if (format == "png") {                    
            url = url + "&colormap="+this.colormap
            document.getElementById("btnDownloadImagePng_"+this.gcWidgetId).href = url;
            document.getElementById("btnDownloadImagePng_"+this.gcWidgetId).download = row.source + "_" + row.raster_id + "." + format;
          }
          if (format == "tif") {             
            document.getElementById("btnDownloadImageTif_"+this.gcWidgetId).href = url;
            document.getElementById("btnDownloadImageTif_"+this.gcWidgetId).download = row.source + "_" + row.raster_id + "." + format;
            // open(url, "_blank");
          }
        }
      }
      else {
        document.getElementById("downloadImage_"+this.gcWidgetId).classList.add("is-hidden");
      }
    },
    /* GUI helpers */
    growLayerControl: function (event) {
      document.getElementById("btnLayerControl_" + this.gcWidgetId).classList.add("is-hidden");
      document.getElementById("layerControlContent_" + this.gcWidgetId).classList.remove("is-hidden");
    },
    shrinkLayerControl: function (event) {
      document.getElementById("layerControlContent_" + this.gcWidgetId).classList.add("is-hidden");
      document.getElementById("btnLayerControl_" + this.gcWidgetId).classList.remove("is-hidden");
    },
    growImageControl: function (event) {
      document.getElementById("btnDownloadImage_" + this.gcWidgetId).classList.add("is-hidden");
      document.getElementById("downloadImageContent_" + this.gcWidgetId).classList.remove("is-hidden");
    },
    shrinkImageControl: function (event) {
      document.getElementById("downloadImageContent_" + this.gcWidgetId).classList.add("is-hidden");
      document.getElementById("btnDownloadImage_" + this.gcWidgetId).classList.remove("is-hidden");
    },
    disableQueryBtn: function () {
      
      this.removeFromArray(this.activeMapActions, "query");

      //works only if the map has an active parcel layer!
      if (document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-interactive").length > 0) {
        //leaflet has its own interactive region within the map (bbox of layers)
        //so change cursor only for this element
        document.getElementById("map_"+this.gcWidgetId).getElementsByClassName("leaflet-interactive")[0].style.cursor = "pointer";

        // enable panning and zooming in map
        this.mymap.dragging.enable();
        this.mymap.doubleClickZoom.enable();

        // remove event handler for identify click in map
        this.mymap.off('click');
      }
    },
    disableCreateParcelBtn: function () {

      document.getElementById("divCreateParcel_" + this.gcWidgetId).classList.add("is-hidden");
      document.getElementById("innerContainer_" + this.gcWidgetId).classList.add("is-inline");
      document.getElementById("innerContainer_" + this.gcWidgetId).classList.remove("is-flex");
      document.getElementById("map_"+this.gcWidgetId).style.width = "100%";

      this.mymap.invalidateSize();

      this.map_endEditing();

      this.removeFromArray(this.activeMapActions, "edit");

      document.getElementById("divNewParcelMsg_" + this.gcWidgetId).innerHTML = '';
      document.getElementById("divNewParcelMsg_" + this.gcWidgetId).classList.add("is-hidden");
    },
    containerSizeChange(size) {
      /* handles the resize of the map if parent container size changes */
      this.mymap.invalidateSize();
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

      this.timeLine = new vis.Timeline(document.getElementById("timeline_" + this.gcWidgetId), _visDs1, _visOptions);

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
      //document.getElementById("timelineContainer_"+this.gcWidgetId).classList.remove('is-hidden');
    },
    startPauseVideo: function () {
      
      console.log("startPauseVideo()");

      //playing -> pause
      if (this.isPlaying) {
        this.isPlaying = false;
        document.getElementById("player_" + this.gcWidgetId).children.btnPlayerOnOff.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(this.myTimer);
        document.getElementById("player_" + this.gcWidgetId).children.btnPlayerOnOff.classList.remove("is-active");
      }
      //paused -> play
      else {
        //reset to start?
        //this.currentTimeSliderPosition = 0;

        this.isPlaying = true;
        document.getElementById("player_" + this.gcWidgetId).children.btnPlayerOnOff.classList.add("is-active");

        document.getElementById("player_" + this.gcWidgetId).children.btnPlayerOnOff.innerHTML = '<i class="fas fa-pause"></i>';
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
        }.bind(this), this.gcImageChangeInterval);
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

      document.getElementById("player_" + this.gcWidgetId).children.btnPlayerOnOff.disabled = state;
      /*document.getElementById("player_"+this.gcWidgetId).children.btnPlayerBackward.disabled = state;
      document.getElementById("player_"+this.gcWidgetId).children.btnPlayerForward.disabled = state;*/
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

      if (this.activeMapActions.includes("legend")) {
        // hide
        this.removeFromArray(this.activeMapActions, "legend");

        document.getElementById("mapLegendContent_" + this.gcWidgetId).classList.add("is-hidden");

      } else {

        this.showLegend(this.getCurrentRaster());

        this.activeMapActions.push("legend");
      }
    },
    toggleMapOptions: function() {
      this.gcOptionsCollapsed = !this.gcOptionsCollapsed;
    }, 
    toggleColormapOptions: function(selectedProduct) {
      let products = ["visible", "vitality", "variations"];
  
      // disable colormap for these products
      if (products.includes(selectedProduct)) {
          this.colormap = ""; //reset to default
          this.colormapEnabled = false;
      }
      else {
        this.colormapEnabled = true;
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
    getClosestTimeSeriesIndex: function (queryDate) {
      /* returns the nearest Date to the given parcel_id and query date */
      const p = this.getCurrentParcel();
      const exactDate = this.getClosestDate(p.timeseries.map(d => new Date(d.date)), new Date(queryDate));
      console.debug("closest date of given date "+ queryDate + " is "+ exactDate.simpleDate());
      // find the index of the closest date in timeseries now
      return p.timeseries.map(d => d.date).indexOf(exactDate.simpleDate());
    },
    /* helper functions */
    removeFromArray: function(arry, value) {
      let index = arry.indexOf(value);
      if (index > -1) {
          arry.splice(index, 1);
      }
      return arry;
    },
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
    isDateValid: function (date_str) {
      /* Validates a given date string */
      if (!isNaN(new Date(date_str))) {
          return true;
      }
      else {
          return false;
      }
    },
    getClosestDate: function (arr, queryDate) {
      console.debug("getClosestDate()");
      /* Returns the closest date in a array of dates
         with the sort function */
      let i = arr.sort(function(a, b) {
        var distancea = Math.abs(queryDate - a);
        var distanceb = Math.abs(queryDate - b);
        return distancea - distanceb; // sort a before b when the distance is smaller
      });
      return i[0];
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
    },
    changeLanguage() {
      //this.$i18n.i18next.changeLanguage(this.currentLanguage);
      this.$i18n.locale = this.currentLanguage;
    },
  }
});
