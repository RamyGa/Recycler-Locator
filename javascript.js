let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let infoPane;

function initMap() {
    
    // Initialize variables
    bounds = new google.maps.LatLngBounds();//represents a rectangle in geographical coordinates
    infoWindow = new google.maps.InfoWindow;//displays content (usually text or images) in a popup window above the map, at a given location
    currentInfoWindow = infoWindow;//infoWindow assigned to variable currentInfoWindow


    infoPane = document.getElementById('panel');//reference to the html panel on the left side of the map


    if (navigator.geolocation) {//If the object exists, geolocation services are available/and permission has not been denied

        navigator.geolocation.getCurrentPosition((position) =>{//get current position of device
            pos = {//position of the user
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {//reference to the html map passed to the map object
                center: pos,
                zoom: 15,
                streetViewControl: false,
            });
            bounds.extend(pos);//extends the predefined bounds to the position bounds passed in

            infoWindow.setPosition(pos);//set the info (pop up) window above the users current positon
            infoWindow.setContent('Your current location');//info box will state this string
            infoWindow.open(map);//opens the info window on the map passed in
            map.setCenter(pos);//centers the map to the position passed in

            getNearbyPlaces(pos);// will call the the getNearbyPlaces function and pass in the current location of the user
        }, () => {
            // Browser supports geolocation, but user has denied permission, handled with this handler
            handleLocationError(true, infoWindow);
        });
    }

    else {
        // Browser doesn't support geolocation, handled with this handler
        handleLocationError(false, infoWindow);
    }
}

// If user denies permission for their current location then we will handle that by defaulting the starting position to this lat long position
function handleLocationError(browserHasGeolocation, infoWindow) {
    pos = { lat: 36.382133, lng: -94.203728 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 15,
        streetViewControl: false,
    });

    // Display an InfoWindow at the map center
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Geolocation permissions denied. Using default location.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;


    getNearbyPlaces(pos);//call the getNearbyPlaces function and pass in the default lat and lon
}

//this function will get passed in either the default position or the users current position
//once position is passed in we make request object and pass in object key/value pairs
//In this case we want the location to be the position passed in,
// the rank will be based on how close they are to the provided position, and the keyword we want to search the area for is 'recycle'
function getNearbyPlaces(position) {
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'recycle'
    };

    service = new google.maps.places.PlacesService(map);//Creates a new instance of the PlacesService that renders attributions in the specified container.
    service.nearbySearch(request, nearbyCallback);//Retrieves a list of places near a particular location, based on keyword or type.
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {//if status 200, create the markers with given results (data passed in via request object)
        createMarkers(results);
    }
}

// Set markers at the location of each place result
function createMarkers(places) {
    places.forEach(place => {//loop through the places
        var photos = place.photos;//will grab photos of each place and assign it to photos variable
        if (!photos) {//if one doesnt exist then just return
            return;
        }
        let marker = new google.maps.Marker({//new marker object with given specifications will be added to the map
            position: place.geometry.location,
            map: map,
            title: place.name,
        });

        // click listener for each marker
        google.maps.event.addListener(marker, 'click', () => {//if a marker is clicked we will display referenced data in request object
            let request = {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos']
            };


            //grab details of a place when the user clicks on a marker
            service.getDetails(request, (placeResult, status) => {
                showDetails(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });


    //once all the markers have been placed, adjust the bounds of the map to be able to show all the markers within the visible area
    map.fitBounds(bounds);
}


// Creates an info window above a clicked marker with details like name and rating
function showDetails(placeResult, marker, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
            '</strong><br>' + 'Rating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
    } else {
        console.log('showDetails failed: ' + status);
    }
}


// For the sidebar
function showPanel(placeResult) {
    // If infoPane is already open, close it
    if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
    }

    // Clear the previously displayed data
    while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
    }


    //If there is a photo then provide the photo
    if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
    }

    // Add place details with text formatting
    let name = document.createElement('h1');
    name.classList.add('place');
    name.textContent = placeResult.name;
    infoPane.appendChild(name);
    if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
    }
    let address = document.createElement('p');
    address.classList.add('details');
    address.textContent = placeResult.formatted_address;
    infoPane.appendChild(address);
    if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
    }

    // Open the infoPane
    infoPane.classList.add("open");
}