mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v11",
	center: spot.geometry.coordinates,
	zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

new mapboxgl.Marker()
	.setLngLat(spot.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(
			`<h5>${spot.title}</h5><div>${spot.location}</div>`
		)
	)
	.addTo(map);
