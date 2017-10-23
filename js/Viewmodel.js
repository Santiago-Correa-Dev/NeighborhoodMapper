//Loop through model to get data and show markers.
let Viewmodel = function() {
    let self = this;
    self.error = ko.observable('');
    self.mapmarkerdata = [];

    for (let i = 0; i < locations.length; i++) {
        //Marker information
        let position = locations[i].location;
        let title = locations[i].title;
        let content = locations[i].content;

        let marker = new google.maps.Marker({
            position: position,
            map: map,
            content: content,
            title: title,
            showItem: ko.observable(locations[i].show),
            selectedItem: ko.observable(locations[i].selected),
            animation: google.maps.Animation.DROP,
            id: i,
            venues: locations[i].id,
            icon: 'images/alien.png'
        });

        self.mapmarkerdata.push(marker);
    }

    self.addfoursquare = function(marker) {
        // Foursquare api.
        let foursquare = 'https://api.foursquare.com/v2/venues/' + marker.venues + '?client_id=L5CNUE1HNJSITDWYN1CJSYCHBOE324PAQILEGCYSBCDKZ4NH&client_secret=G4JAEF5OWTGZGETAYWVUMURAPBKC4KANKE32XV2EAQGXAF4N&v=20171021&m=foursquare';
        fetch(foursquare).then(response => response.json()).then(function addDetails(data) {
            //Results store the response.
            let results = data.response.venue;
            //This part adds the name of the place nearby to each location
            marker.name = results.name;
        }).catch(function(e) {
            //If there is any issue at all with the foursqare api the user will be alerted.
            self.error("Foursquare data is unavailable.");
        });
    };


    let addinfo = function(marker) {
        //add api names to markers
        self.addfoursquare(marker);

        //add the click event listener to each marker
        marker.addListener('click', function() {
            //set this marker to the selected state
            self.setMarkers(marker);
        });
    };

    //  iterate through the mapmarkerdata array and add marker api names to markers
    for (let i = 0; i < self.mapmarkerdata.length; i++) {
        addinfo(self.mapmarkerdata[i]);
    }

    self.searchFiltertext = ko.observable('');


    self.filterList = function() {
        //variable for search text
        let currentText = self.searchFiltertext();
        infowindow.close();

        //Search filter
        if (currentText.length === 0) {
            self.showAll(true);
        } else {
            for (let i = 0; i < self.mapmarkerdata.length; i++) {
                // Check if the text that is searched can be found in the filter's list.
                if (self.mapmarkerdata[i].title.toLowerCase().indexOf(currentText.toLowerCase()) > -1) {
                    self.mapmarkerdata[i].showItem(true);
                    self.mapmarkerdata[i].setVisible(true);
                } else {
                    self.mapmarkerdata[i].showItem(false);
                    self.mapmarkerdata[i].setVisible(false);
                }
            }
        }
        infowindow.close();
    };



    // This function is available to show all markers.
    self.showAll = function(marker) {
        for (let i = 0; i < self.mapmarkerdata.length; i++) {
            self.mapmarkerdata[i].showItem(marker);
            self.mapmarkerdata[i].setVisible(marker);
        }
    };

    // This function is used to make all the markers unselected.
    self.hideAll = function() {
        for (let i = 0; i < self.mapmarkerdata.length; i++) {
            self.mapmarkerdata[i].selectedItem(false);
        }
    };

    self.currentLocation = self.mapmarkerdata[0];

    // This function is used to make all the markers selected and show one name of a nearby place.
    self.setMarkers = function(location) {
        self.hideAll();
        location.selectedItem(true);

        self.currentLocation = location;

        Name = function() {
            if (self.currentLocation.name === '' || self.currentLocation.name === undefined) {
                return " is nearby : Unknown";
            } else {
                return "is nearby : " + self.currentLocation.name;
            }
        };

        var InfoWindow = '<div>' + self.currentLocation.title + '</div>' + "<div>" + Name() + '</div>';

        infowindow.setContent(InfoWindow);

        infowindow.open(map, location);
    };
};