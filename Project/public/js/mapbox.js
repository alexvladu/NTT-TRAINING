/* eslint-disable */
const mapboxAccessToken = 'pk.eyJ1IjoiYWxleDEyNDAiLCJhIjoiY205c3JsajRtMDI1bTJrcXJtbGRudnlsaSJ9._Dns4gvDJwLyRuFfJjxHFA';
const map = new mapboxgl.Map({
    accessToken: mapboxAccessToken,
    container: 'map',
    style: 'mapbox://styles/alex1240/cm9ss7lu800jp01sb3b13dzr8',
});
const locations=JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations[0]);

const bounds = new mapboxgl.LngLatBounds();
locations.forEach(loc=>{
    //Create marker
    const el=document.createElement('div');
    el.className = 'marker';

    //Adding marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    //Add popup
    new mapboxgl.Popup({
        offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

    //Extend map bound to current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds);