//Create map
let map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('Mymap'), {
        zoom: 15,
        center: locations[0].location,
        mapTypeId: 'roadmap',
        mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow();

    ko.applyBindings(new Viewmodel());
}

function mapError() {
    document.getElementById('error').innerHTML = "Error in Map!";
}
