var myCenter = new google.maps.LatLng(20.5937,78.9629);
var geocoder = new google.maps.Geocoder();
stateDetail = [];
function loadMaperr() {

    $.getJSON("state.json", function (data) {
        $.each(data.features, function (key, val) {
            var geometry = val.geometry.coordinates[0] + ',' + val.geometry.coordinates[1];
            var desc = val.properties.Description;
            var descDetails = desc.split('<br>');
            var statedata = descDetails[8].split(':');
            var stateCode = statedata[1].trim();
            stateDetail[stateCode] = geometry;
        });
    });

    $.getJSON("IT_Town.json", function (data) {

        var items = [];
        var description = [];
        var marker_list1 = [];
        var marker_list1 = [];
        var discomList = [];
        $.each(data.features, function (key, val) {

            $.each(val, function (index, detail) {
                if(index == 'geometry'){

                    var desc = val.properties.Description;
                    var descDetails = desc.split('<br>');

                    var statedata = descDetails[8].split(':');
                    var discomdata = descDetails[9].split(':');

                    var stateCode = statedata[1].trim();
                    var discomCode = discomdata[1].trim();

                    if(stateCode == '32'){
                        if(discomCode == '601') {
                            console.log('heee');
                        }else {
                            console.log('hiiii')
                        }
                    }

                    description.push(desc);
                    if(discomList.indexOf(discomCode) != -1) {
                        $.each(detail, function (index1, detail1) {
                            if (index1 == 'coordinates') {
                                items.push(stateDetail[stateCode]);
                            }
                        });
                    }else {
                        discomList.push(discomCode);
                    }
                }

            });
        });

        console.log(discomList);

        initializes(items,description);

    });
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

        if($description[index]){
            var desc = $description[index];
            var descDetails = desc.split('<br>');
            var statedata = descDetails[7].split(':');
            var state = statedata[1].trim();
        }
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
            infowindow.open(map, marker);
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
    google.maps.event.addListener(markerCluster, 'mouseover', function(){

    });
    markerCluster.onClickZoom = function() { return multiChoice(markerCluster); }
}

function multiChoice(mc) {

    console.log('here'); return false;

    var cluster = mc.clusters_;
    // if more than 1 point shares the same lat/long
    // the size of the cluster array will be 1 AND
    // the number of markers in the cluster will be > 1
    // REMEMBER: maxZoom was already reached and we can't zoom in anymore
    if (cluster.length == 1 && cluster[0].markers_.length > 1)
    {
        var markers = cluster[0].markers_;
        for (var i=0; i < markers.length; i++)
        {
            // you'll probably want to generate your list of options here...
        }

        return false;
    }

    return true;
}
