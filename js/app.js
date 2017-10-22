//View model.

//Create map
function initMap()  {
    let map = new google.maps.Map(document.getElementById('Mymap'), {
        zoom: 15,
        center: model[0].location,
        mapTypeId: 'roadmap',
        mapTypeControl: false
    });

    let infowindow = new google.maps.InfoWindow();

    //Loop through model to get data and show markers.
    for (let i = 0; i < model.length; i++) {
        let markerItems = model[i];

        let marker = new google.maps.Marker({
            position: markerItems.location,
            map: map,
            content: markerItems.content,
            title: markerItems.title,
            animation: google.maps.Animation.DROP,
            id: i,
            icon: 'images/alien.png'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(`<div class = marker-content>${markerItems.title},${markerItems.content}.</div>`);
            infowindow.open(map, this);
            console.log(this);
        });

        let foursquare = `https://api.foursquare.com/v2/venues/search?ll=${markerItems.location.lat},${markerItems.location.lng}&section=coffee&client_id=L5CNUE1HNJSITDWYN1CJSYCHBOE324PAQILEGCYSBCDKZ4NH&client_secret=G4JAEF5OWTGZGETAYWVUMURAPBKC4KANKE32XV2EAQGXAF4N&v=20171021&m=foursquare`;
        fetch(foursquare).then(response => response.json()).then(addDetails).catch(error =>'<div>There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.</div>');

        function addDetails(data) {
            this.results = data.response.venues[0].name;   
        }
    }
}