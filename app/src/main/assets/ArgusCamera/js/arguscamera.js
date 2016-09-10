// implementation of AR-Experience (aka "World")
var World = {
	//  user's latest known location, accessible via userLocation.latitude, userLocation.longitude, userLocation.altitude
	userLocation: null,

	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,

    // true once data was fetched
    initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

    // list of AR.GeoObjects that are currently in the scene
    markerList: [],

    // The last selected marker
    currentMarker: null,

    locationUpdateCounter: 0,
    updatePlacemarkDistancesEveryXLocationUpdates: 10,


    // Add a new marker with the current userLocation and dummy data
    addMarker: () => {
        // create a new poi
        var newPoi = {
            "id": 123123,
            "latitude": parseFloat(World.userLocation.latitude) + (Math.random() / 5 - 0.1),
            "longitude": parseFloat(World.userLocation.longitude) + (Math.random() / 5 - 0.1),
            "altitude": parseFloat(World.userLocation.altitude),
            "title": "POI Title",
            "description": "POI description"
        }
        // add a message to the poi
        // push to cloud / update World var
        World.markerList.push(new Marker(newPoi));
//         AR.logger.info("New poi:");
//         AR.logger.info(newPoi.title)
//         AR.logger.info("New marker has been added.");
//         for (var i = 0; i < World.markerList.length; i++) {
//             AR.logger.info(World.markerList[i].titleLabel.text);
//             AR.logger.info(World.markerList[i].latitude);
//                for(var p in World.markerList[i].titleLabel.text){
//                    AR.logger.info(p);
//                }
         }
        // display the new poi by passing the previous markers plus the new one
          World.reloadPoisWithNew(World.markerList);
    },

    // Reloads the POIs already in display and adds the new one
    reloadPoisWithNew: (poiData) => {

        // empty markerlist
        World.markerList = []

        for(var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
            // push the markers into the world markerlist
            World.markerList.push(poiData[currentPlaceNr]);
        }

		// updates distance information of all placemarks
		World.updateDistanceToUserValues();

        // Updates status message as a user feedback that everything was loaded properly.
        World.updateStatusMessage(currentPlaceNr + ' places loaded');

        // set distance slider to 100%
        $("#panel-distance-range").val(100);
        $("#panel-distance-range").slider("refresh");

    },

    // called to inject new POI data
    loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
        // empty list of visible markers
        World.markerList = [];

//        AR.logger.info("POIDATA");
//        AR.logger.info("POIDATA-Length:" + poiData.length);
//        for (var i = 0; i < poiData.length; i++){
//            AR.logger.info("Lat:" + parseFloat(poiData[i].latitude));
//            AR.logger.info("Lon:" + parseFloat(poiData[i].longitude));
//        }
        /*
        	The example Image Recognition already explained how images are loaded and displayed in the augmented reality view. This sample loads an AR.ImageResource when the World variable was defined. It will be reused for each marker that we will create afterwards.
        */
        World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
        World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");


        // loop through POI information and create an AR.GeoObject(Marker) per POI
        for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
            var singlePoi = {
                "id": poiData[currentPlaceNr].id,
                "latitude": parseFloat(poiData[currentPlaceNr].latitude),
                "longitude": parseFloat(poiData[currentPlaceNr].longitude),
                "altitude": parseFloat(poiData[currentPlaceNr].altitude),
                "title": poiData[currentPlaceNr].name,
                "description": poiData[currentPlaceNr].description
            };
            /*
                To be able to deselect a marker while the user taps on the empty screen,
                the world object hods an array that contains each marker.
            */
            World.markerList.push(new Marker(singlePoi));

        }

        /*
        	For creating the marker a new object AR.GeoObject will be created at the specified geolocation. An AR.GeoObject connects one or more AR.GeoLocations with multiple AR.Drawables. The AR.Drawables can be defined for multiple targets. A target can be the camera, the radar or a direction indicator. Both the radar and direction indicators will be covered in more detail in later examples.
        var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);
        var markerImageDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
        	zOrder: 0,
        	opacity: 1.0
        });

        // create GeoObject
        var markerObject = new AR.GeoObject(markerLocation, {
        	drawables: {
        		cam: [markerImageDrawable_idle]
        	}
        });

        */

		// updates distance information of all placemarks
		World.updateDistanceToUserValues();

        // Updates status message as a user feedback that everything was loaded properly.
        World.updateStatusMessage(currentPlaceNr + ' places loaded');

        // set distance slider to 100%
        $("#panel-distance-range").val(100);
        $("#panel-distance-range").slider("refresh");

    },
    // sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
    updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
        for (var i = 0; i < World.markerList.length; i++) {
            World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
        }
    },


    // updates status message shown in small "i"-button aligned bottom center
    updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
            theme: themeToUse
        });
        $("#popupInfoButton").buttonMarkup({
            icon: iconToUse
        });
    },

    // location updates, fired every time you call architectView.setLocation() in native environment
    locationChanged: function locationChangedFn(lat, lon, alt, acc) {
        // AR.logger.info("locationChangedFn");
        // AR.logger.info("lat: " + lat);
        // AR.logger.info("lon: " + lon);
        // AR.logger.info("alt: " + alt);

		// store user's current location in World.userLocation, so you always know where user is
		World.userLocation = {
			'latitude': lat,
			'longitude': lon,
			'altitude': alt,
			'accuracy': acc
		};
        /*
        	The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
        */
         if (!World.initiallyLoadedData) {

             World.requestDataFromLocal(lat, lon);
             World.initiallyLoadedData = true;
         } else if (World.locationUpdateCounter === 0) {
             // update placemark distance information frequently
             // you max also update distances only every 10m with some more effort
             World.updateDistanceToUserValues();
         }

		// helper used to update placemark information every now and then (e.g. every 10 location upadtes fired)
		World.locationUpdateCounter = (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);
        // World.requestDataFromLocal(lat, lon);

    },

        // fired when user pressed maker in cam
    onMarkerSelected: function onMarkerSelectedFn(marker) {
        World.currentMarker = marker;

        // update panel values
        $("#poi-detail-title").html(marker.poiData.title);
        $("#poi-detail-description").html(marker.poiData.description);

        var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");

        $("#poi-detail-distance").html(distanceToUserValue);

        // show panel
        $("#panel-poidetail").panel("open", 123);

        $( ".ui-panel-dismiss" ).unbind("mousedown");

        $("#panel-poidetail").on("panelbeforeclose", function(event, ui) {
            World.currentMarker.setDeselected(World.currentMarker);
        });
    },

    // screen was clicked but no geo-object was hit
    onScreenClick: function onScreenClickFn() {
        // you may handle clicks on empty AR space too
    },

    // returns distance in meters of placemark with maxdistance * 1.1
    getMaxDistance: function getMaxDistanceFn() {

        // sort palces by distance so the first entry is the one with the maximum distance
        World.markerList.sort(World.sortByDistanceSortingDescending);

        // use distanceToUser to get max-distance
        var maxDistanceMeters = World.markerList[0].distanceToUser;

        // return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
        return maxDistanceMeters * 1.1;
    },

    // udpates values show in "range panel"
    updateRangeValues: function updateRangeValuesFn() {

        // get current slider value (0..100);
        var slider_value = $("#panel-distance-range").val();
        AR.logger.info("slider_value:" + slider_value);


        // max range relative to the maximum distance of all visible places
        var maxRangeMeters = Math.round(World.getMaxDistance() * (slider_value / 100));
        AR.logger.info("getMaxDistance:" + World.getMaxDistance());

        // range in meters including metric m/km
        var maxRangeValue = (maxRangeMeters > 999) ? ((maxRangeMeters / 1000).toFixed(2) + " km") : (Math.round(maxRangeMeters) + " m");

        // number of places within max-range
        var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

        // update UI labels accordingly
        $("#panel-distance-value").html(maxRangeValue);
        $("#panel-distance-places").html((placesInRange != 1) ? (placesInRange + " Places") : (placesInRange + " Place"));

        // update culling distance, so only places within given range are rendered
        AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);

        // update radar's maxDistance so radius of radar is updated too
        PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
    },

    // returns number of places with same or lower distance than given range
    getNumberOfVisiblePlacesInRange: function getNumberOfVisiblePlacesInRangeFn(maxRangeMeters) {

        // sort markers by distance
        World.markerList.sort(World.sortByDistanceSorting);

        // loop through list and stop once a placemark is out of range ( -> very basic implementation )
        for (var i = 0; i < World.markerList.length; i++) {
            if (World.markerList[i].distanceToUser > maxRangeMeters) {
                return i;
            }
        };

        // in case no placemark is out of range -> all are visible
        return World.markerList.length;
    },

    handlePanelMovements: function handlePanelMovementsFn() {

        $("#panel-distance").on("panelclose", function(event, ui) {
            $("#radarContainer").addClass("radarContainer_left");
            $("#radarContainer").removeClass("radarContainer_right");
            PoiRadar.updatePosition();
        });

        $("#panel-distance").on("panelopen", function(event, ui) {
            $("#radarContainer").removeClass("radarContainer_left");
            $("#radarContainer").addClass("radarContainer_right");
            PoiRadar.updatePosition();
        });
    },

    // display range slider
    showRange: function showRangeFn() {
        if (World.markerList.length > 0) {

            // update labels on every range movement
            $('#panel-distance-range').change(function() {
                World.updateRangeValues();
            });

            World.updateRangeValues();
            World.handlePanelMovements();

            // open panel
            $("#panel-distance").trigger("updatelayout");
            $("#panel-distance").panel("open", 1234);
        } else {

            // no places are visible, because the are not loaded yet
            World.updateStatusMessage('No places available yet', true);
        }
    },



    // request POI data
    // there will a request poi data from remote to get a json containg the data
    requestDataFromLocal: (centerPointLatitude, centerPointLongitude) => {
        AR.logger.info("requestDataFromLocal");

        var maxRange = 0.03;
        var poisToCreate = 10;
        // sample poi
        // ntust
        // Le Hua Night Market
        var poiData = [{
                "id": 1,
                "latitude": 25.006170,
                "longitude": 121.510801,
                "description": "This is the description of POI#1",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 2,
                "latitude": 25.006919,
                "longitude": 121.511155,
                "description": "This is the description of POI#1",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 3,
                "latitude": 25.006219,
                "longitude": 121.511305,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 4,
                "latitude": 25.004877,
                "longitude": 121.512642,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 5,
                "latitude": 25.002775,
                "longitude": 121.511239,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 6,
                "latitude": 25.000388,
                "longitude": 121.511081,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 7,
                "latitude": 25.008985,
                "longitude": 121.511331,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 8,
                "latitude": 25.008683,
                "longitude": 121.513360,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 9,
                "latitude": 25.009257,
                "longitude": 121.510088,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 10,
                "latitude": 25.008683,
                "longitude": 121.508618,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "POI#1"
            }, {
                "id": 11,
                "latitude": 25.013521,
                "longitude": 121.540795,
                "description": "This is the description of POI#",
                "altitude": "100.0",
                "name": "SCHOOL"
            }, {
                "id": 12,
                "latitude": 25.006649,
                "longitude": 121.511569,
                "description": "This is the description of HOUSE",
                "altitude": "100.0",
                "name": "HOUSE"
            }, {
                "id": 13,
                "latitude": 25.006681,
                "longitude": 121.511649,
                "description": "This is the description of HOUSE2",
                "altitude": "100.0",
                "name": "HOUSE2"
            }, {
                "id": 14,
                "latitude": 25.014239,
                "longitude": 121.541482,
                "description": "This is the description of RB",
                "altitude": "100.0",
                "name": "RB"
            }, {
                "id": 13,
                "latitude": 25.014188,
                "longitude": 121.541694,
                "description": "This is the description of the POND",
                "altitude": "100.0",
                "name": "Pond"
            }

        ];

        var poisToShow = [];

        // loop through every point to check if the distance is less than 3 meters
        for (var i = 0; i < poiData.length; i++) {
            // if distance is < 3 m
            // add this point to the points to display
	        AR.logger.info("Center lat:" + centerPointLatitude);
	        AR.logger.info("Center lon:" + centerPointLongitude);
//	        AR.logger.info("lon:" + centerPointLongitude + (Math.random() / 5 - 0.1));
	        // AR.logger.info("Poi lat:" + poi.latitude);
	        // AR.logger.info("Poi lon:" + poi.longitude);
            AR.logger.info("POI: "+ poiData[i].name);

			distP1P2 = distanceFrom(centerPointLatitude, centerPointLongitude, poiData[i].latitude, poiData[i].longitude);

	        AR.logger.info("Distance: " + distP1P2);

            if ( distP1P2 <= maxRange) {
                poisToShow.push(poiData[i]);
            }
        }

        function distanceFrom(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                (1 - c((lon2 - lon1) * p)) / 2;

            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        }

        // for (var i = 0; i < poisToCreate; i++) {
        //     poiData.push({
        //         "id": (i + 1),
        //         "longitude": (centerPointLongitude + (Math.random() / 5 - 0.1)),
        //         "latitude": (centerPointLatitude + (Math.random() / 5 - 0.1)),
        //         "description": ("This is the description of POI#" + (i + 1)),
        //         "altitude": "100.0",
        //         "name": ("POI#" + (i + 1))
        //     });
        // }

        World.loadPoisFromJsonData(poisToShow);

    },

	// helper to sort places by distance
	sortByDistanceSorting: function(a, b) {
		return a.distanceToUser - b.distanceToUser;
	},

	// helper to sort places by distance, descending
	sortByDistanceSortingDescending: function(a, b) {
		return b.distanceToUser - a.distanceToUser;
	}


};

/*
	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received.
*/
AR.context.onLocationChanged = World.locationChanged;

// forward clicks in empty area to world
AR.context.onScreenClick = World.onScreenClick;
