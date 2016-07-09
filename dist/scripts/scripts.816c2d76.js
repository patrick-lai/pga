"use strict";angular.module("pgaApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ui.router","ngMaterial","ngLodash","ngGeolocation"]).config(["$locationProvider","$stateProvider","$httpProvider","$urlRouterProvider","$mdThemingProvider",function(a,b,c,d,e){a.html5Mode(!0),d.otherwise("/"),e.theme("default").primaryPalette("grey").dark(),b.state({name:"Main",url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state({name:"Test",url:"/test",tempalteUrl:"views/test.html"})}]).service("pgaTable",["$http","$geolocation",function(a,b){this.formId="1JdBMtPa4V-5FZNeDMPw9gC63cU_PYfMY0yvLtFpKZIo",this.reportSighting=function(c){var d=this;return b.getCurrentPosition({timeout:1e4}).then(function(b){var e="https://docs.google.com/forms/d/"+d.formId+"/formResponse?submit=Submit",f={"entry.1679630058":c.name,"entry.52226537":c.id,"entry.1840957835":b.coords.latitude+","+b.coords.longitude},g="";return angular.forEach(f,function(a,b){g+="&"+b+"="+a}),console.log(e+g),a.post(e+g).then(function(a){console.log(a)},function(a){console.log(a)})})}}]).filter("parseInt",function(){return function(a){return parseInt(a)}}),angular.module("pgaApp").controller("MainCtrl",["$scope","$timeout","$mdSidenav","$rootScope","$http","lodash","pgaTable","$sce","$geolocation",function(a,b,c,d,e,f,g,h,i){function j(a){return k(function(){c(a).toggle().then(function(){})},200)}function k(c,d,e){var f;return function(){var e=a,g=Array.prototype.slice.call(arguments);b.cancel(f),f=b(function(){f=void 0,c.apply(e,g)},d||10)}}return a.toggleLeft=j("left"),a.toggleRight=j("right"),d.mapsUrl="views/map.html",e.get("scripts/pokemon.json").success(function(b){a.pokemons=b}),a.getIframeUrl=function(){var a=d.currentPokemon?parseInt(d.currentPokemon.id):0;d.currentLocation||(d.currentLocation="&lat=-33.50&lng=150.84279004958148");var b="https://www.google.com/fusiontables/embedviz?q=select+col3+from+1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw+where+col2+%3D+"+a+"&viz=MAP&h=false&"+d.currentLocation+"&t=1&z=15&l=col3&y=3&tmplt=4&hml=GEOCODABLE";return h.trustAsResourceUrl(b)},a.openLegal=function(){swal("Legal","Pokémon images, names and information (c) 1995-2014 Nintendo/Game freak.\n\nImages and content were taken from the following resources:\n\nPokéAp\nPokémon Database\nveekun/pokedex")},a.close=function(a){c(a).close().then(function(){})},i.getCurrentPosition({timeout:1e4}).then(function(a){d.currentLocation="&lat="+a.coords.latitude+"&lng="+a.coords.longitude})}]),angular.module("pgaApp").controller("PokedexCtrl",["$scope","$timeout","$rootScope","$mdSidenav",function(a,b,c,d){a.close=function(){d("left").close().then(function(){})},a.setPokemon=function(b){c.currentPokemon=b,a.close()}}]),angular.module("pgaApp").controller("ReportCtrl",["$scope","$timeout","$rootScope","$mdSidenav","pgaTable",function(a,b,c,d,e){a.close=function(){d("right").close().then(function(){})},a.reportSighting=function(b){swal({title:"Was there a "+b.name+" around this area?",type:"info",showCancelButton:!0,confirmButtonColor:"#FF754A",cancelButtonColor:"#bbb",confirmButtonText:"Yes"}).then(function(){e.reportSighting(b).then(function(b){swal("Marked!!","Your Sighting has been marked","success"),a.close()})})}}]),angular.module("pgaApp").run(["$templateCache",function(a){a.put("views/main.html",'<!-- <div id="OverLay" class="animate-slideDown interactive" ng-click="hideOverlay = true" ng-show="hideOverlay">\n  <h1 class="pop-text">\n    Welcome to the Pokemon Go Assistant\n    <span style="font-size: 12pt; display: block; margin: .5em 0;"></span>\n  </h1>\n</div> --> <section layout="row" flex> <!-- Left --> <md-sidenav class="md-sidenav-left" md-component-id="left" md-disable-backdrop md-whiteframe="4"> <md-toolbar style="background-color: transparent"> <md-input-container style="margin: 1em"> <label>Search</label> <md-icon class="name"> <i class="fa fa-times interactive pop-text" ng-click="close(\'left\')" aria-hidden="true"></i> </md-icon> <input ng-model="findFilter" ng-model-options="{debounce: 80}"> </md-input-container> </md-toolbar> <md-content layout-padding ng-controller="PokedexCtrl"> <!-- content --> <ul style="margin: 0"> <li class="pokemon"> <div class="interactive pop-text" ng-click="openLegal()">(<i class="fa fa-gavel" aria-hidden="true"> Legal</i>)</div> </li> <li ng-repeat="pokemon in pokemons | filter: findFilter" ng-click="setPokemon(pokemon)" class="pokemon animate-fade" ng-class=" {\'active\' : currentPokemon == pokemon }"> <div class="pop-text interactive">{{pokemon.id}} {{pokemon.name}}</div> </li> </ul> </md-content> </md-sidenav> <!-- Right --> <md-sidenav class="md-sidenav-right" md-component-id="right" md-disable-backdrop md-whiteframe="4"> <md-toolbar class="md-warn"> <md-input-container style="margin: 1em"> <label style="color: black; text-shadow: none">What did you see</label> <md-icon class="name"> <i class="fa fa-times interactive pop-text" ng-click="close(\'right\')" aria-hidden="true"></i> </md-icon> <input ng-model="reportFilter" ng-model-options="{debounce: 80}"> </md-input-container> </md-toolbar> <md-content layout-padding ng-controller="ReportCtrl"> <!-- content --> <ul style="margin: 0"> <li ng-repeat="pokemon in pokemons | filter: reportFilter" ng-click="reportSighting(pokemon)" class="pokemon animate-fade"> <div class="pop-text interactive">{{pokemon.id}} {{pokemon.name}}</div> </li> </ul> </md-content> </md-sidenav> </section> <div style="height: 100vh"> <md-button ng-click="toggleLeft()" class="md-raised md-primary" style="left: 0; position: fixed; z-index: 10; color: white"> <span ng-hide="currentPokemon">Find Pokemon</span> <span ng-show="currentPokemon">{{currentPokemon.name}} Sightings</span> </md-button> <md-button ng-click="toggleRight()" class="md-raised md-warn" style="right: 0; position: fixed; z-index: 10"> Report a Sighting </md-button> <div class="full-height" ng-include="mapsUrl" ng-></div> </div>'),a.put("views/map.html",'<div class="full-height"> <!-- <ng-map id="pokemonMap" zoom="5" center="current-location" class="full-height">\r\n    <marker animation="DROP" position="current-location"></marker>\r\n    <fusion-tables-layer query="{{getQuery()}}"\r\n      heatmap = "{enabled: false}">\r\n    </fusion-tables-layer>\r\n  </ng-map> --> <iframe class="full-height" style="width: 100%" scrolling="no" frameborder="no" ng-src="{{getIframeUrl()}}"></iframe> </div>'),a.put("views/mapDataOverlay.html","<fusion-tables-layer query=\"{\r\n  select: 'Location',\r\n  from: '1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw',\r\n  where: 'PokedexId = {{currentPokemon.id}}'}\" heatmap=\"{enabled: false}\"> </fusion-tables-layer>"),a.put("views/test.html",'<!DOCTYPE html> <html> <head> <meta name="viewport"> <title>PokemonGoMap - Google Fusion Tables</title> <style type="text/css">html, body, #googft-mapCanvas {\r\n  height: 300px;\r\n  margin: 0;\r\n  padding: 0;\r\n  width: 500px;\r\n}</style> <script type="text/javascript" src="https://maps.google.com/maps/api/js?v=3"></script> <script type="text/javascript">function initialize() {\r\n    google.maps.visualRefresh = true;\r\n    var isMobile = (navigator.userAgent.toLowerCase().indexOf(\'android\') > -1) ||\r\n      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));\r\n    if (isMobile) {\r\n      var viewport = document.querySelector("meta[name=viewport]");\r\n'+"      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');\r\n    }\r\n    var mapDiv = document.getElementById('googft-mapCanvas');\r\n    mapDiv.style.width = isMobile ? '100%' : '500px';\r\n    mapDiv.style.height = isMobile ? '100%' : '300px';\r\n    var map = new google.maps.Map(mapDiv, {\r\n      center: new google.maps.LatLng(-33.912629848608894, 150.84279004958148),\r\n      zoom: 19,\r\n      mapTypeId: google.maps.MapTypeId.ROADMAP\r\n    });\r\n\r\n    layer = new google.maps.FusionTablesLayer({\r\n      map: map,\r\n      heatmap: { enabled: false },\r\n      query: {\r\n        select: \"col3\",\r\n        from: \"1b4XoPuboTQ-x6K_uoIpjEg0k4Nwa8gEewhFpDypw\",\r\n        where: \"col2 \\x3d 9\"\r\n      },\r\n      options: {\r\n        styleId: 3,\r\n        templateId: 4\r\n      }\r\n    });\r\n\r\n    if (isMobile) {\r\n      var legend = document.getElementById('googft-legend');\r\n      var legendOpenButton = document.getElementById('googft-legend-open');\r\n      var legendCloseButton = document.getElementById('googft-legend-close');\r\n      legend.style.display = 'none';\r\n      legendOpenButton.style.display = 'block';\r\n      legendCloseButton.style.display = 'block';\r\n      legendOpenButton.onclick = function() {\r\n        legend.style.display = 'block';\r\n        legendOpenButton.style.display = 'none';\r\n      }\r\n      legendCloseButton.onclick = function() {\r\n        legend.style.display = 'none';\r\n        legendOpenButton.style.display = 'block';\r\n      }\r\n    }\r\n  }\r\n\r\n  google.maps.event.addDomListener(window, 'load', initialize);</script> </head> <body> <div id=\"googft-mapCanvas\"></div> </body> </html>")}]);