"use strict";angular.module("pgaApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ui.router","ngMaterial","ngLodash","ngGeolocation","uiGmapgoogle-maps","LocalStorageModule","ngAudio","angular-momentjs","timer","cgNotify"]).config(["$locationProvider","$stateProvider","$httpProvider","$urlRouterProvider","$mdThemingProvider","$momentProvider","uiGmapGoogleMapApiProvider","localStorageServiceProvider",function(a,b,c,d,e,f,g,h){g.configure({key:"AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg",v:"3.20",libraries:"weather,geometry,visualization"}),f.asyncLoading(!1).scriptUrl("//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"),h.setPrefix("pgaApp"),d.otherwise("/"),e.theme("default").primaryPalette("grey").dark(),b.state({name:"Main",url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state({name:"Test",url:"/test",tempalteUrl:"views/test.html"}).state({name:"Importer",url:"/import",templateUrl:"views/import.html"})}]).run(["$http","$rootScope","lodash","localStorageService","ngAudio","notify",function(a,b,c,d,e,f){function g(){b.filteredPokemon=c.chain(b.surroundingPokemon).filter(function(a){var d=b.isWatchingPokemon({id:a.pokemonId})&&a.distance<=b.appSettings.distance;return d?(c.includes(b.notified,a.id)||(b.notified.push(a.id),b.notificationMp3.play(),f({message:a.name+" sighted!",duration:3e3,position:"right"})),d):!1}).value()}b.notificationMp3=e.load("audio/notification.mp3"),b.pokemons=[],b.watchedPokemons=[],b.watchPokemon=function(a){var e=parseInt(a.id);null==b.watchedPokemons&&(b.watchedPokemons=[]),c.includes(b.watchedPokemons,e)||(b.watchedPokemons.push(e),d.set("watchedPokemons",JSON.stringify(b.watchedPokemons)))},b.unWatchPokemon=function(a){null==b.watchedPokemons&&(b.watchedPokemons=[]);var e=parseInt(a.id);c.remove(b.watchedPokemons,e),d.set("watchedPokemons",JSON.stringify(b.watchedPokemons))},b.isWatchingPokemon=function(a){return c.includes(b.watchedPokemons,parseInt(a.id))},b.setDistance=function(a){b.appSettings.distance=a,d.set("distance",a)},b.watchNone=function(){b.watchedPokemons=[],d.set("watchedPokemons",JSON.stringify(b.watchedPokemons)),b.updateMap()},b.watchAll=function(){b.watchedPokemons=[];for(var a in b.pokemons)b.watchPokemon(b.pokemons[a]);b.updateMap()},b.appSettings={},b.appSettings.distance=d.get("distance"),b.watchedPokemons=JSON.parse(d.get("watchedPokemons")),b.notified=[],b.appSettings.distance||b.setDistance(1e3),b.surroundingPokemon=[],b.filteredPokemon=[],b.clearLocalStorage=function(){d.clearAll()},b.updateMap=function(){b.$broadcast("surroundingPokemonChanged")},b.$watch("surroundingPokemon",function(){b.updateMap()}),b.$on("surroundingPokemonChanged",function(a,b){g()}),a.get("pokemon.json").success(function(a){b.pokemons=a.data})}]).service("pvApi",["$http","$geolocation","$rootScope",function(a,b,c){this.baseUrl="https://www.whereispokemon.com/fetch",this.maxDistance=1e3,this.fetchApiData=function(b){var d={lat:c.currentLocation.latitude,lng:c.currentLocation.longitude,distance:this.maxDistance};return a.post(this.baseUrl,d,function(a){return a.data},function(a){return console.log("server is busy"),a})}}]).service("pgaTable",["$http","$geolocation","$rootScope",function(a,b,c){this.formId="1JdBMtPa4V-5FZNeDMPw9gC63cU_PYfMY0yvLtFpKZIo",this.apiKey="AIzaSyBbw9PJvWsQn_qmBIMSxFAMrtSJcqM70Sg",this.reportSighting=function(b){var d="https://docs.google.com/forms/d/"+this.formId+"/formResponse?submit=Submit",e={"entry.52226537":b.id+" "+b.name,"entry.1840957835":c.currentLocation.latitude+" "+c.currentLocation.longitude};return angular.forEach(e,function(a,b){d+="&"+b+"="+a}),a.post(d).then(function(a){console.log(a)},function(a){console.log(a)})}}]).filter("parseInt",function(){return function(a){return parseInt(a)}}),angular.module("pgaApp").controller("MainCtrl",["$scope","$timeout","$interval","$mdSidenav","$rootScope","$http","lodash","pgaTable","$sce","$geolocation","pvApi","$moment",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(a){return n(function(){d(a).toggle().then(function(){})},200)}function n(c,d,e){var f;return function(){var e=a,g=Array.prototype.slice.call(arguments);b.cancel(f),f=b(function(){f=void 0,c.apply(e,g)},d||10)}}function o(){function b(a,b){return a.id==b.id}e.currentLocation&&k.fetchApiData(e.currentLocation).then(function(c){if(c.data.length){var d=c.data,f=g.differenceWith(d,e.surroundingPokemon,b),h=g.differenceWith(e.surroundingPokemon,d,b);g.union(f,h);e.surroundingPokemon=g.unionWith(e.surroundingPokemon,f,b),g.remove(e.surroundingPokemon,function(a){return g.includes(h,a.id)}),a.loading=!1}},function(b){swal("Please wait, We will refresh the map in a minute"),a.loading=!1})}a.appSettings=e.appSettings,a.loading=!0,a.toggleLeft=m("left"),a.toggleRight=m("right"),a.myPosition=j.position,a.reportFormUrl="https://docs.google.com/a/originoffice.com/forms/d/e/1FAIpQLSdwkzgXy1cta5zRzWBS4BL8DQKZhrxe8qdwqDQtabbxziUtPA/viewform",f.get("pokemon.json").success(function(a){e.pokemons=a,null==e.watchedPokemons&&(e.watchedPokemons=[],e.watchAll())}),a.openLegal=function(){swal("Legal","Pokémon images, names and information (c) 1995-2014 Nintendo/Game freak.\n\nImages and content were taken from the following resources:\n\nPokéAp\nPokémon Database\nveekun/pokedex")},a.updateDistance=function(a){e.setDistance(a),e.updateMap()},a.close=function(a){d(a).close()},j.getCurrentPosition({timeout:6e4}).then(function(b){a.myPosition.error&&swal("Please allow locations for this app to work"),e.currentLocation=b.coords,o()}),j.watchPosition({timeout:3e4,maximumAge:250,enableHighAccuracy:!0});var p={latitude:-33.8688,longitude:151.2093},q=16;a.map={center:p,zoom:q,markers:[],markersEvents:{click:function(b,c,d){a.map.window.model=d,a.map.window.show=!0}},window:{marker:{},show:!1,closeClick:function(){this.show=!1},options:{}}},a.makeCoords=function(a,b){return{latitude:a,longitude:b}},a.$on("$geolocation.position.changed",function(b,c){c&&(e.currentLocation=c.coords,a.map.center={latitude:c.coords.latitude,longitude:c.coords.longitude})}),c(o,45e3),a.showHelp=function(){swal({title:"<h5>How to use</h5>",type:"info",html:"The map will watch for selected pokemon around you<br/><br/>You may filter down by the left menu<br/><br/>Tap the pokemon on the map to see countdown timer<br/><br/>We Wish this tool will help fellow trainers :).<br/>",confirmButtonText:"close"})}}]),angular.module("pgaApp").controller("PokedexCtrl",["$scope","$timeout","$rootScope","$mdSidenav","pgaTable",function(a,b,c,d,e){a.close=function(){d("left").close().then(function(){})},a.togglePokemonWatch=function(a){c.isWatchingPokemon(a)?c.unWatchPokemon(a):c.watchPokemon(a),c.$broadcast("surroundingPokemonChanged")}}]),angular.module("pgaApp").controller("ImportCtrl",["$scope","$rootScope","$http","lodash","pgaTable",function(a,b,c,d,e){function f(b,d){c.get(h+d+i).then(function(c){if(c.data.results.length>0){var d=c.data.results[0].geometry.location;console.log(d),a.parsedCSV+=[Date(),b.Name,b.ID+" "+b.Name,d.lat+" "+d.lng].join(",")+"\n"}})}var g=[{Name:"Bulbasaur",ID:1,Location:"Leumeah Train Station, Foodworks Tahmoor Carpark, Bizim Market Auburn, Bankstown, West Pennant Hills, Surry Hills, Oyster Bay, Warragamba"},{Name:"Ivysaur",ID:2,Location:"North Sydney, M2 Interchange Carlingford, Bankstown, Rhodes"},{Name:"Venusaur",ID:3,Location:"Perth John Oldham Park, Sydney Before the Bridge between Tumbalong Park and Sussex st, Stocklands Wetherill Park, Botanic Gardens, Rhodes, Warragamba"},{Name:"Charmander",ID:4,Location:"Opera House, Rhodes, Darling Harbour, Watsons Bay, Balmain East, NORTH RYDE, Ingleburn, West Pennant Hills"},{Name:"Charmeleon",ID:5,Location:"Watsons Bay, Blacktown, Chatswood Westfield"},{Name:"Charizard",ID:6,Location:"Rhodes, Hornsby, Star Bar, Macquarie Uni Oval at Night Only,Regents Park, Opera House near botanic garden"},{Name:"Squirtle",ID:7,Location:"Opera house, NORTH RYDE, Hornsby Westfield, Chatswood Westfield, Mt druitt, Wynyard, EARLWOOD, Ingleburn, North Sydney Australia, Greystanes, Rhodes, Pyrmont, Strathfield (Train Station)"},{Name:"Wartortle",ID:8,Location:" Wollongong, University of Sydney (old teachers college), Circular Quay, Strathfield, opera house, NORTH RYDE, Bankstown Sports Club, Wynyard (once), Camperdown Park (Newtown), Liverpool Train station "},{Name:"Blastoise",ID:9,Location:"Opera House, Surry Hills Woolies, Cabramatta, Watsons Bay, Strathfield (Homebush Rd), Seven Hills (Pizza Hut), Chatswood Station, georges Hall EPPING, Marrickville (near Sydenham station), Greenacre, Rhodes"},{Name:"Caterpie",ID:10,Location:"Circular Quay, Newtown, Bankstown, Bigge Park Liverpool, University of Sydney (old teachers college), King st (newtown),Mt druitt,Greystanes, Ingleburn, Warragamba, *Everywhere there is grass*"},{Name:"Metapod",ID:11,Location:"University of Sydney(Wallace theater), Strathfield, Burwood Park,Greystanes,Mtdruitt"},{Name:"Butterfree",ID:12,Location:"Opera House (Circular Quay) , Newtown, Rhodes, University of Sydney (School of Physics), Watsons Bay, Seven Hills, Cabramatta Post Office,Liverpool, warragamba"},{Name:"Weedle",ID:13,Location:"EVERYWHERE THEYRE WEEDS."},{Name:"Kakuna",ID:14,Location:"Miller’s Point, Strathfield,Casula, Liverpool,Greystanes, Raby, warragamba, bankstown"},{Name:"Beedrill",ID:15,Location:"Surrey Hills, Revesby (once), Bankstown/Chester Hill"},{Name:"Pidgey",ID:16,Location:"Everywhere. This isnt specific to a place."},{Name:"Pidgeotto",ID:17,Location:null},{Name:"Pidgeot",ID:18,Location:"Rhodes, University of Sydney, Surry Hills, UNSW, eastwood"},{Name:"Rattata",ID:19,Location:"Everywhere. This isnt specific to a place."},{Name:"Raticate",ID:20,Location:"Surry Hills, Marrickville, University of Sydney, Revesby, James adaras, Rooty Hill"},{Name:"Spearow",ID:21,Location:"Universitbbbbby of Sydney, Revesby, Epping, Chatswood, Chipping Norton, Blacktown, Minto, Raby, Ingleburn, Macquarie Fields, warragamba"},{Name:"Fearow",ID:22,Location:"Artarmon, Central Park, Bass Hill, Bankstown, Sydney Opera House, Blacktown, Ingleburn RSL "},{Name:"Ekans",ID:23,Location:"Circular Quay, Newtown, Bankstown, University of Sydney, Central, Ultimo, UTS, UNSW, Watsons Bay, North Sydney, Lane Cove, Berowra, Ingleburn, Camden, warragamba"},{Name:"Arbok",ID:24,Location:" Rhodes, UTS, MACQUARIE UNI GROUNDS"},{Name:"Pikachu",ID:25,Location:"Star Casino (near the roundabout), Brighton Le Sands, Carss Bush Park, Opera House, University of Sydney (near school of physics), Rhodes, Naremburn park - Artarmon, Coogee Beach (Playground), Watsons Bay, Parramatta CBD, Enmore (Enmore Park), Rose Bay, Camelia Gardens (Caringbah), Cronulla (Esplenade), Mosman (Beauty Point), Nullified basketball courts, Victoria Park, Zetland (xx:25), Foodworks Tahmoor carpark, beverley park golf club"},{Name:"Raichu",ID:26,Location:"Rhodes"},{Name:"Sandshrew",ID:27,Location:"Mortdale, University of Sydney (old teachers college), Rhodes, Opera House, Bigge Park (Liverpool- rare), Centennial Park,Greystanes, Chatswood (rare), Town hall (once)"},{Name:"Sandslash",ID:28,Location:" Rhodes, City (once), Circular Quay (Opera House)"},{Name:"Nidoran♀",ID:29,Location:" Bigge Park (Liverpool), Fairfield, University of Sydney (near school of physics), Canley Vale, Cabramatta, UNSW, Epping, Mona Vale, Ingleburn, Hyde Park (nr museum station), warragamba"},{Name:"Nidorina",ID:30,Location:"Bondi Junction (in the centre), St James, Rhodes"},{Name:"Nidoqueen",ID:31,Location:"Found 1 at Hornsby, Wynyard, Found 2 at Abbotsbury"},{Name:"Nidoran♂",ID:32,Location:"Frenchs Forest KFC, Bigge Park (Liverpool), Fairfield, Camperdown Park, UNSW, Epping, Cabramatta, Watsons Bay, Raby, Pendle Hill, Bondi Junction, Rhodes, Wiley Park Train Station, Warragamba"},{Name:"Nidorino",ID:33,Location:" St James, Mona Vale"},{Name:"Nidoking",ID:34,Location:" North Ryde RSL (rare), QVB (Park Street), Olympic Park"},{Name:"Clefairy",ID:35,Location:"Randwick Racecourse, UNSW, Streets around centennial park, Chatswood, Wynyard/Australia Square, around Cecil Hills Lake, Rhodes, Kentlyn, RNSH St Leonards (high spawn), Pemulway lake after dark high population, warragamba"},{Name:"Clefable",ID:36,Location:"Hyde Park (St James Station), Town Hall, Canley Heights, Minto, Macquarie Fields, Rhodes, West Pennant Hills"},{Name:"Vulpix",ID:37,Location:"Bondi Beach, Rhodes, Olympic Park, Circular Quay, Epping, Macquarie Shopping Centre"},{Name:"Ninetales",ID:38,Location:"Opera House (Circular Quay), Rhodes"},{Name:"Jigglypuff",ID:39,Location:"Circular Quay, Sydney Uni Village (Newtown), Revesby Station, Eastgardens Top car park (sometimes), Ingleburn, Minto, Raby"},{Name:"Wigglytuff",ID:40,Location:"Circular Quay, Rhodes"},{Name:"Zubat",ID:41,Location:"Everywhere"},{Name:"Golbat",ID:42,Location:"Throughout city"},{Name:"Oddish",ID:43,Location:"Newtown, Bankstown, Blacktown, West Hoxton, Fairfield, Camperdown park, Rhodes, Canley Vale, Canley Heights, Cabramatta, Mona Vale, Berowra, Ingleburn, Raby, Kensington, Granville, Kentlyn, warragamba"},{Name:"Gloom",ID:44,Location:"Liverpool, Circular Quay, Mount Druitt, Ultimo, Prince Alfred Square (Parramatta), Warragamba"},{Name:"Vileplume",ID:45,Location:"The Crest (Bass Hill), Rhodes"},{Name:"Paras",ID:46,Location:"Newtown, Kogarah, Surry Hills, Bigge Park (Liverpool), Revesby, City, Ingleburn, Minto, Rhodes, Rouse Hill, Seven Hills, Raby, Eastwood, warragamba"},{Name:"Parasect",ID:47,Location:"Rhodes, Epping, City, Cecil Hills, West Pennant Hills"},{Name:"Venonat",ID:48,Location:"Pyrmont, Bankstown, Brighton Le Sands, University of Sydney, Victoria Park, Revesby, Rhodes, Mona Vale, Stanmore, City, Ingleburn, Minto, Raby, Top Ryde, warragamba"},{Name:"Venomoth",ID:49,Location:" Liverpool, Wynyard, Sans Souci, Kibble Park, Kogarah, Wynyard (once)"},{Name:"Diglett",ID:50,Location:"Sometimes around Hyde Park, Circular Quay, Rhodes, Ashfield Park, Sydney CBD George Street Near Wynyard Station / Park"},{Name:"Dugtrio",ID:51,Location:"Opera House (Circular Quay), Watsons Bay (once)"},{Name:"Meowth",ID:52,Location:"Opera House (Circular Quay) , Newtown, Rhodes, University of Sydney (School of Physics), Watsons Bay, Hyde Park, Maroubra, Minto, Blenheim park North Ryde, Leumeah,"},{Name:"Persian",ID:53,Location:"Rhodes, Opera House (Circular Quay), Five Dock, Hunters Hill"},{Name:"Psyduck",ID:54,Location:"Circular Quay, Surry Hills, Brighton Le Sands, Bigge Park (Liverpool), Town Hall (Sussex Street), kings park, Bondi Beach (very common), Victoria Park, Maroubra Beach, Rhodes,Parramatta near river 3x pokestops, Macquarie Uni, Cockle Bay (near wharf #2), Botanic Garden, Pyrmont Bridge (west), Mona Vale Beach, Darling Harbour, Campbelltown Train Station. Bondi Beach."},{Name:"Golduck",ID:55,Location:" Wollongong, Parramatta River, Rhodes(lure), Victoria Park, Opera House, Macquarie Uni (rare)"},{Name:"Mankey",ID:56,Location:" Rhodes, Opera House, Wynyard/Australia Square, Pyrmont Bridge, Sydney CBD"},{Name:"Primeape",ID:57,Location:" Tumbalong Park (Darling Harbour), Rhodes"},{Name:"Growlithe",ID:58,Location:"Kings Cross (main street), Bigge Park (Liverpool) Rhodes, Watsons Bay, Parramatta Park, Dundas Valley, Olympic Park, Ingleburn, Narwee, pendlehill/westmead"},{Name:"Arcanine",ID:59,Location:"John street (Cabramatta), Bigge Park (Liverpool) Rhodes, Town Hall, Stanmore station"},{Name:"Poliwag",ID:60,Location:"Bankstown, Cronulla, Bigge Park (Liverpool), Circular Quay, Fairfield, University of Sydney, Newtown, Rhodes, Canley vale, Cabramatta, UNSW, Watsons Bay, Rose Bay, Pymble, Pitt St Mall, Mona Vale, Dulwich Hill, Pyrmont, Ingleburn, Minto, Macquarie, warragamba"},{Name:"Poliwhirl",ID:61,Location:"Wollongong, Circular Quay, University of Sydney, Fairfield, Canley Vale, Rhodes, Guildford, Kogarah"},{Name:"Poliwrath",ID:62,Location:"Ryde ,parramatta park, Turramurra"},{Name:"Abra",ID:63,Location:"Bondi Beach (Uncommon), Camperdown park, Rhodes, Opera House (Circular Quay), NORTH SYDNEY, Maroubra(near the junction, cumberland golf course greystanes, warragamba"},{Name:"Kadabra",ID:64,Location:"Rhodes, Liverpool Plaza, Belmore Park near Central, Opera House, Hyde Park (near Museum Station)"},{Name:"Alakazam",ID:65,Location:"Wetherill Park (very rare), Darling Harbour (near National Maritime Museum)"},{Name:"Machop",ID:66,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square, Macquarie Centre,"},{Name:"Machoke",ID:67,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square"},{Name:"Machamp",ID:68,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square"},{Name:"Bellsprout",ID:69,Location:"Bankstown, Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square, warragamba"},{Name:"Weepinbell",ID:70,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square"},{Name:"Victreebel",ID:71,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square"},{Name:"Tentacool",ID:72,Location:"Rhodes, Opera House (Circular Quay), CHATSWOOD OVAL, North Sydney, Stanmore, Wynyard/Australia Square"},{Name:"Tentacruel",ID:73,Location:" Darling harbour, Rhodes, Circular Quay, Ultimo, Rockdale Plaza"},{Name:"Geodude",ID:74,Location:"Circular Quay (Near Customs House), North Sydney, Near Royal Botanic Gardens, Raby, Minto, Strathfield, Darling Harbour (Darling Park),North Parramatta near the mcdonalds, Rhodes"},{Name:"Graveler",ID:75,Location:"Brookvale Oval, Pyrmont / Ultimo (Union St), Parramatta Park (Old Government House)"},{Name:"Golem",ID:76,Location:"Pyrmont (sighted Jones Bay Wharf @11:45am), Rhodes, "},{Name:"Ponyta",ID:77,Location:"Circular Quay, Brighton Le Sands, University of Sydney, Rhodes, Cabramatta, Holsworthy (Rare - with incense), Watsons Bay (The Gap/cliff walk - many), Wiley Park (once),Elizabeth drive liverpool, Ingleburn, Castle Hill (Fred Caterson Reserve), Rhodes, Marsfield"},{Name:"Rapidash",ID:78,Location:"Opera House, Star Casino, Rhodes"},{Name:"Slowpoke",ID:79,Location:" Kingsgrove, Victoria Park, Rhodes, Darling Harbour, Wattle Grove Lake, Circular Quay, Strathfield, Pyrmont"},{Name:"Slowbro",ID:80,Location:"Marrickville train station, Fairfield, University of Sydney, Bondi Beach, Circular Quay, Epping"},{Name:"Magnemite",ID:81,Location:"Circular Quay, Opera House, Watsons Bay (Everywhere there), Rhodes, Rose Bay, Kurnell"},{Name:"Magneton",ID:82,Location:"Rhodes, Opera House (Circular Quay), Palm Beach"},{Name:"Farfetchd",ID:83,Location:"Asia Exclusive - Found in Korea (https://www.reddit.com/r/TheSilphRoad/comments/4sx5iz/farfetchd_found_in_korea/)"},{Name:"Doduo",ID:84,Location:"Living large in the burbs, especially Bigge Park (Liverpool - if you want like 20+ from standing there for 10 mins) anywhere in winston hills, Guildord, Merrylands, Sury Hills, Newtown, Burwood, Fairfield.AUSTRALIA EVERYWHERE - Australia Exclusive ;)"},{Name:"Dodrio",ID:85,Location:"Bankstown, Bigge Park (Liverpool), Fairfield, Five Dock, Strathfield, Cabramatta, Canley Heights, Parramatta, Canley Vale, Newtown, Burwood Park"},{Name:"Seel",ID:86,Location:"Opera House (Circular Quay), Rhodes, Watsons Bay, Balmain East, Balmoral, Pyrmont, the creek behind Ingleburn RSL, Rhodes"},{Name:"Dewgong",ID:87,Location:"shire (which shire, dickhead?) Kingsford (Near Willis St), Rose Bay (Near Richmond Rd)"},{Name:"Grimer",ID:88,Location:"Rhodes, University of Sydney, Cabramatta, Watsons Bay, Haberfield Robson Park (early morning), chelmsford road south wentworthville, North Sydney (Walker Street), Eastwood (Near Okeefe Cresent)"},{Name:"Muk",ID:89,Location:" Rhodes, Kogarah"},{Name:"Shellder",ID:90,Location:"Opera House (Circular Quay), Watsons Bay, Rhodes, concord west"},{Name:"Cloyster",ID:91,Location:"Rhodes, Strathfield (Train Station)"},{Name:"Gastly",ID:92,Location:"Star Casino, University of Sydney, Cabramatta, Rhodes, Bankstown, Strathfield, Marrickville (Wicks Park), Opera House, Town Hall, Point Piper, NORTH RYDE, MACQ PARK, All over the city, winston hills, Macarthur Square, centenary road merrylands 11am-1pm"},{Name:"Haunter",ID:93,Location:"Rhodes, Bankstown, Old South Head Road, Opera House (Circular Quay), north ryde, macq park, Kogarah (station)"},{Name:"Gengar",ID:94,Location:" Dee Why, Night time"},{Name:"Onix",ID:95,Location:"Darling Harbour, Parramatta, Circular Quay Nepean Rowing Club Penrith, Cabramatta Bowden Park, Riverwood, Fairfield park, Rhodes, Kareela (Sutherland shire) , Central Station, Doyle Grounds (North Parra), Epping, irrigation road south wentworthville 2x spawns"},{Name:"Drowzee",ID:96,Location:"Opera House, Marrickville, Rhodes, Royal Botanic Gardens (Sydney CBD), Macarthur"},{Name:"Hypno",ID:97,Location:"Circular Quay, Royal Botanic Gardens"},{Name:"Krabby",ID:98,Location:"Camperdown, Circular Quay, Brighton Le Sands, Blacktown, Bigge Park (Liverpool), Fairfield, Victoria Park, University of Sydney, Revesby, Darling Quarter, Strathfield, Mt Druitt Westfield, Burwood"},{Name:"Kingler",ID:99,Location:" Fairfield, Canley Heights, Circular Quay, Rhodes Bigge park liverpool"},{Name:"Voltorb",ID:100,Location:"Opera House, Cabramatta Park, Circular Quay, Rhodes, Watsons Bay, Kurnell, Clifton Gardens reserve (near the swimming enclosure)"},{Name:"Electrode",ID:101,Location:"Star Casino, Opera House, Rhodes"},{Name:"Exeggcute",ID:102,Location:"Circular Quay, Kogarah, Quakers Hill (night), Brighton Le Sands, Victoria Park, University of Sydney, Surry Hills, Kingsgrove, north sydney oval, Ingleburn, Raby, Minto, Manly Beachfront, Cabramatta, Liverpool, Fairfield, Marsfield, UNSW upper campus"},{Name:"Exeggutor",ID:103,Location:"Camperdown Park, Opera House, Fairfield West Plaza, Rhodes, Parramatta (George St), Parramatta River"},{Name:"Cubone",ID:104,Location:" Surry Hills, Rhodes, Cabramatta, Epping, West Ryde, Bankstown, Opera House, Picton, Fairfield plaza, hylands road greystanes, mawson park in campbelltown "},{Name:"Marowak",ID:105,Location:" Fairfield, Rhodes, EPPING ROAD NEAR MARSFIELD "},{Name:"Hitmonlee",ID:106,Location:"Surry Hills (Harmony Park), Allawah, Rhodes, found 1 at Chatswood Westfield, Padstow Reserve, Parramatta (Train Station)"},{Name:"Hitmonchan",ID:107,Location:" Kingsgrove, Rhodes, Strathfield, Macquarie Park, Watsons Bay (once), Allawah, Parramatta (Train Station)"},{Name:"Lickitung",ID:108,Location:" Kellyville, Pennant Hills, Randwick, Ingleburn, Croydon, Pendle Hill (Civic Park), Rhodes"},{Name:"Koffing",ID:109,Location:"Opera House, Rhodes, Strathfield, Rose Bay, Rooty Hill, Wynyard, Parramatta (Train Station)"},{Name:"Weezing",ID:110,Location:"Chinatown, Town Hall Station "},{Name:"Rhyhorn",ID:111,Location:"Hyde Park, Star Casino, Newtown, Rhodes, Parramatta Park (They are everywhere), Eastwood, Circular Quay, Burwood Park, Anzac Memorial Park Kellyville, Willoughby, the Con, Progress Park Auburn, West Pennant Hills, warragamba"},{Name:"Rhydon",ID:112,Location:"Rhodes, Opera House (Circular Quay), Dee Why, West Pennant Hills"},{Name:"Chansey",ID:113,Location:"St. Leos Park, Star City Casino (Pyrmont, near Cafe XXII)"},{Name:"Tangela",ID:114,Location:"Marrickville train station, Fairfield, University of Sydney, Bexley North, Bigge Park (Liverpool), Wiley Park, Strathfield, Flemington, Raby, Minto, Ingleburn, Calmsley Hill Farm, Allawah"},{Name:"Kangaskhan",ID:115,Location:"Park on Broughton St in Concord, Central Station (Sydney, Near Eddy Ave)"},{Name:"Horsea",ID:116,Location:"Woolloomooloo Wharf, Copacabana Beach, warragamba, Parramatta Park "},{Name:"Seadra",ID:117,Location:"Centennial Park, Dee Why, Rhodes, Glebe"},{Name:"Goldeen",ID:118,Location:"Surry Hills, Auburn, Newtown, Hurstville, Luna Park, Bankstown, Circular Quay, Bigge Park (Liverpool), Fairfield, Five Dock, Camperdown park, University of Sydney, Victoria park, Revesby, Hornsby, Balmain, Pyrmont, Raby, warragamba"},{Name:"Seaking",ID:119,Location:"Opera House, Rhodes, Balmain, Prince Alfred Square (Parra), Darling Harbour"},{Name:"Staryu",ID:120,Location:"Circular Quay, Quakers Hill (night), Brighton Le Sands, Bigge Park (Liverpool), Fairfield, University of Sydney, Victoria Park, Revesby, Epping, UNSW, Rhodes, Pyrmont, Ingleburn, Minto, Raby, Maroubra Beach, warragamba"},{Name:"Starmie",ID:121,Location:"Parramatta (Train Station), Parramatta River, Circular Quay"},{Name:"Mr. Mime",ID:122,Location:"Europe Exclusive"},{Name:"Scyther",ID:123,Location:"Auburn, Kogarah, Liverpool, Broadway shopping centre, Fairfield City Council, Cabramatta, Eastwood, Old South Head Road, Watsons Bay (The Gap cliff walk), Eastwood (with lure), Carslaw Building (University of Sydney), Darling Harbour, Circular Quay, Sylvania Waters, Wynyard park, Kirrawee, Ingleburn, Strathfield, Homebush, Drummoyne"},{Name:"Jynx",ID:124,Location:"Nanoscience Building (University of Sydney), Opera House, Rhodes, UNSW Upper campus, Watsons Bay, Australian Technology park, Flemington once)"},{Name:"Electabuzz",ID:125,Location:"Mrs Macquaries Chair, Botanical Gardens, Rhodes, Killara Golf Course, Opera House (Circular Quay), Burwood Park, Martin Place, Fairlight Beach Walkway (heaps)"},{Name:"Magmar",ID:126,Location:"The Spot, Randwick, University of Sydney, Town Hall, Milsons Point, Rose Bay, City, Eastwood, Granville Station, Blacktown Westpoint, Opera House, Redfern Station, Artarmon, Rhodes, Kogarah, Wynyard, Abbotsbury, Quakers Hill, Burwood, West Pennant Hills"},{Name:"Pinsir",ID:127,Location:"Surry Hills, Kogarah, Brighton Le Sands, Heathcote, blacktown (common), Bigge Park (Liverpool), Newtown, University of Sydney, Fairfield City Council, Watsons Bay, Strathfield, Willoughby, Dulwich Hill, Raby, Minto, Holsworthy, Ingleburn, Macquarie Fields, Plough and Harrow Park, Birkenhead Point, Earlwood, UTS/ABC building. Wetherill Park Stocklands, hyde park, Parramatta Park"},{Name:"Tauros",ID:128,Location:"America Exclusive"},{Name:"Magikarp",ID:129,Location:"Everywhere there is water (including fountains), Parramatta River (has 3 Pokestops), Darlinghurst in city has a stop near the kids park that spawns 2 or more ever 5 minutes. Bondi Beach, Heaps near Opera House"},{Name:"Gyarados",ID:130,Location:"Darling Harbour, Circular Quay "},{Name:"Lapras",ID:131,Location:"Opera House, Circular Quay, Rhodes, Bondi Beach"},{Name:"Ditto",ID:132,Location:"Not even once, there is some mention of perth on facebook"},{Name:"Eevee",ID:133,Location:"Chinatown, Rhodes, Rockdale, warragamba"},{Name:"Vaporeon",ID:134,Location:"Opera House, Ballina, Rhodes, Darling Harbour, Eastwood"},{Name:"Jolteon",ID:135,Location:"Rhodes, Darling Harbour"},{Name:"Flareon",ID:136,Location:"Macquarie Fields"},{Name:"Porygon",ID:137,Location:"Opera House, Cabramatta, Bankstown, Eastwood, Artarmon"},{Name:"Omanyte",ID:138,Location:"Parramatta road at annandale, Circular Quay, Pyrmont"},{Name:"Omastar",ID:139,Location:"rhodes (once), Homebush"},{Name:"Kabuto",ID:140,Location:"Circular quay, Pyrmont, Milperra (on the southern side of Milperra Rd at the Henry Lawson Dr interchange, in the park on the right hand side heading south towards the M5. If you hit the Uni turnoff youve gone too far), Rhodes,westmead (hawskbury road, kissing point road ermington), Cabramatta, Strathfield (Train Station)"},{Name:"Kabutops",ID:141,Location:"Rhodes (once), Homebush"},{Name:"Aerodactyl",ID:142,Location:"Circular Quay, Belmore Park, Taylor Square, Darling Park (near Darling Habour), turramurra, Bondi Junction, George St Cinema, 10km egg Pemulway hill stop, Greystanes between brighton st and gozo road. Oyster Bay Park, Hyde Park, Egg 10 Km Pokestop (Star City Casino) Pyrmont"},{Name:"Snorlax",ID:143,Location:"Roads to Rhodes, near circular quay train station, Town Hall (once), Cabramatta west"},{Name:"Articuno",ID:144,Location:null},{Name:"Zapdos",ID:145,Location:null},{Name:"Moltres",ID:146,Location:null},{Name:"Dratini",ID:147,Location:"Rhodes, Circular Quay, Parramatta River, Parramatta Park, Strathfield (Train Station)"},{Name:"Dragonair",ID:148,Location:"City (Hyde Park), Bondi Beach, Sydney Opera House, Canley Heights, University of Sydney, Victoria Park, Darling Harbour, Circular Quay, Canterbury, Miss Macquaries Chair , Harbourside (Darling Harbour), Old Government House (Parramatta Park)"},{Name:"Dragonite",ID:149,Location:"China Town (Next to N2 and Arisun), North Sydney - in between 65 Berry Street and North Sydney Train Station, Summer Hill Train Station (Once), Hyde park (telstra building, once), Cecil Hills (is it?????)"},{Name:"Mewtwo",ID:150,Location:null},{Name:"Mew",ID:151,Location:null}],h="https://maps.googleapis.com/maps/api/geocode/json?address=",i="&key="+e.apiKey;a.jsonInput=JSON.stringify(g,null,4),a.parsePokemon=function(){a.parsedCSV="TimeStamp,pokemonName,pokemonID,Location\n";try{var b=JSON.parse(a.jsonInput);d.forEach(b,function(a,b){if(void 0!==a.Location&&null!==a.Location){var c=a.Location.split(",");for(var d in c)f(a,c[d])}})}catch(c){return void swal(c)}},a.parseInput=function(){a.parsePokemon()}}]),angular.module("pgaApp").run(["$templateCache",function(a){a.put("views/import.html",'<div ng-controller="ImportCtrl" flex layout="column" style="min-height: 100%"> <md-content layout-padding> <h1>Importer (WIP)</h1> </md-content> <md-content layout-padding> <md-input-container flex> <label>Json</label> <textarea ng-model="jsonInput" cols="100" rows="50"></textarea> </md-input-container> </md-content> <md-content layout-padding flex> <p> Will parse the json into a csv file geocoding the locations. You can enter multiple locations with "," </p> <h3>CSV here <md-button ng-click="parseInput()">Convert to CSV</md-button></h3> <p style="white-space: pre">{{parsedCSV}}</p> </md-content> </div>'),a.put("views/infowindow.tpl.html",'<div class="gm-pro-popup"> <timer end-time="parameter.model.expiration_time * 1000" style="font-weight: bold">{{minutes}}m:{{seconds}}s</timer> </div>'),a.put("views/main.html",'<!-- <div id="OverLay" class="animate-slideDown interactive" ng-click="hideOverlay = true" ng-show="hideOverlay">\r\n  <h1 class="pop-text">\r\n    Welcome to the Pokemon Go Assistant\r\n    <span style="font-size: 12pt; display: block; margin: .5em 0;"></span>\r\n  </h1>\r\n</div> --> <div class="pikachuLoading" ng-show="loading"> <img src="images/loading.44ceeb59.gif" alt="Loading"> <h2 class="pop-text" style="text-align: center; color: yellow; text-shadow: 0px 0px 8px rgba(0, 0, 0, 1)">Loading</h2> </div> <section layout="row" flex> <!-- Left --> <md-sidenav class="md-sidenav-left" md-component-id="left" md-disable-backdrop md-whiteframe="4"> <md-content layout-padding ng-controller="PokedexCtrl"> <!-- content --> <md-input-container style="margin: 1em; margin-bottom: 0"> <label>Search</label> <md-icon class="name"> <i class="fa fa-times interactive pop-text" ng-click="findFilter = \'\'" aria-hidden="true"></i> </md-icon> <input ng-model="findFilter" ng-model-options="{debounce: 80}"> </md-input-container> <ul style="margin: 0"> <li class="pokemon pop-text"> <div flex ng-click="showHelp()"> <i class="fa fa-question-circle interactive" aria-hidden="true"> <span>How to Use?</span> </i> </div> </li> <li style="padding: 1em"> <md-slider-container> <span>Distance: {{appSettings.distance}}m </span> <md-slider flex min="1" max="1000" ng-model="appSettings.distance" ng-change="updateDistance(appSettings.distance)" aria-label="distance"> </md-slider> </md-slider-container></li> <li layout="row" class="pokemon animate-fade"> <div flex class="pop-text"> <span class="pokemon-id interactive" ng-click="watchAll()">Show All</span> </div> <div flex style="max-width: 30px; text-align: right" ng-click="watchNone()"> <i class="fa fa-times pop-text interactive" aria-hidden="true"></i> </div> </li> <li layout="row" ng-repeat="pokemon in pokemons | filter: findFilter" class="pokemon animate-fade" ng-class=" {\'active\' : isWatchingPokemon(pokemon) }"> <div flex class="pop-text"> <span class="pokemon-id interactive" ng-click="togglePokemonWatch(pokemon)">{{pokemon.id}}</span> <span class="interactive" ng-click="togglePokemonWatch(pokemon)">{{pokemon.name}}</span> </div> <div flex style="max-width: 50px; text-align: right" ng-click="togglePokemonWatch(pokemon)"> <i class="fa fa-eye pop-text interactive" aria-hidden="true"></i> </div> </li> <li class="pokemon"> <div class="interactive pop-text" ng-click="openLegal()">(<i class="fa fa-gavel" aria-hidden="true"> Legal</i>)</div> </li> </ul> </md-content> </md-sidenav> </section> <div style="height: 100vh"> <md-button ng-click="toggleLeft()" class="md-raised md-primary" style="height: 50px; font-weight: bold; left: 0; position: fixed; z-index: 10; color: white"> <span>Menu</span> </md-button> <div class="full-height" ng-include="\'views/map.html\'" ng-></div> <div class="bottomBar"> <a class="pop-text" href="mailto:Patrick_lai@hellokitty.com?Subject=Reports" target="_top"> Reports </a> / <a class="pop-text" href="mailto:Patrick_lai@hellokitty.com?Subject=Suggetions" target="_top"> Suggetions </a> / <a class="pop-text" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=patrick_lai%40hellokitty%2ecom&lc=AU&no_note=0&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted" target="_blank"> Donations </a> to <a class="pop-text" href="mailto:Patrick_lai@hellokitty.com?Subject=Pokemon" target="_top"> Patrick_lai@hellokitty.com </a> </div> </div>'),
a.put("views/map.html",'<div class="full-height"> <ui-gmap-google-map center="map.center" zoom="map.zoom"> <ui-gmap-markers models="filteredPokemon" idkey="\'id\'" coords="\'self\'" icon="\'image\'" events="map.markersEvents"> </ui-gmap-markers> <ui-gmap-window show="map.window.show" coords="map.window.model" options="map.window.options" closeclick="map.window.closeClick()" templateurl="\'views/infowindow.tpl.html\'" templateparameter="map.window"></ui-gmap-window> <ui-gmap-marker coords="map.center" idkey="\'myPosition\'"></ui-gmap-marker> </ui-gmap-google-map> </div>')}]);