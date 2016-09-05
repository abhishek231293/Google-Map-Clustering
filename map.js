var myCenter = new google.maps.LatLng(20.5937,78.9629);
var geocoder = new google.maps.Geocoder();
stateDetail = [];
var items = [];
var description = [];
function loadMap($level) {

    if($level != 'discom') {
        $.ajax({
            type: "get",
            data: {'section': 'all_india'},
            url: "connection.php"
        }).done(function (result) {
            result = JSON.parse(result);
            $.each(result, function (index1, detail1) {
                items.push(detail1.location);
                description.push("Discom ID :: " + detail1.discom_id + ": Town Name::" + detail1.town_name);
            });
            initializes(items, description);
        });
    }else{
        $.ajax({
            type: "get",
            data: {'section': 'state_level'},
            url: "connection.php"
        }).done(function (result) {
            result = JSON.parse(result);
            $.each(result, function (index1, detail1) {
                items.push(detail1.location);
                description.push("Discom ID :: " + detail1.discom_id + ": Town Name::" + detail1.town_name);
            });
            initializes(items, description);
        });
    }


}

function initializes($locations,$description)
{

    var mapProp = {
        center:myCenter,
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: true,
    };
    var prev_infowindow =false;
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var marker = {};
    var marker1= {};
    var marker2= {};

    var markers  = [];
    var markers1  = [];
    var markers2  = [];

    var icon = {
        url: "marker1.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var bounds = new google.maps.LatLngBounds();
    $.each($locations, function( index, value ) {
        var location = value.split(',').map(Number);
        myLatLng = new google.maps.LatLng(location[1],location[0]);

        marker = new google.maps.Marker({
            position:myLatLng,
            icon: icon
        });

        marker.setMap(null);
        markers.push(marker);
        marker.setMap(map);

        var content = $description[index];
        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'mouseover', function(){
            if( prev_infowindow ) {
                prev_infowindow.close();
            }

            prev_infowindow = infowindow;
            infowindow.open(map);
        });

        google.maps.event.addListener(marker,'mouseover', (function(marker,content,infowindow){
            return function() {
                infowindow.setContent(content);
                infowindow.open(map,marker);
            };
        })(marker,content,infowindow));
        bounds.extend(myLatLng);

    });
    var options = {
        imagePath: 'm',
        zoomOnClick: true,
        gridSize: 20
    };

    var markerCluster  = new MarkerClusterer(map, markers, options);

    google.maps.event.addListener(map, 'click', function (event) {
        setTimeout(function () {
            if (!clusterClicked) {

                // alert('Map click executed');
                loadMap('discom');

            }
            else {
                clusterClicked = false;

            }
        }, 0);
    });

    google.maps.event.addListener(markerCluster, "clusterclick", function (cluster) {
        clusterClicked = false;
    });

}
