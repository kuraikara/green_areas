import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { kRing, geoToH3 } from 'h3-js';
import { GeoJsonLayer } from '@deck.gl/layers';

const MAP_STYLE = 'mapbox://styles/lorisunito/ckzy5r00f000514oaowjhz1r3';

const RESOLUTION = 7;

// Viewport settings
const INITIAL_VIEW_STATE = {
	longitude: 7.682412510965831,
	latitude: 45.06705819516297,
	zoom: 17,
	pitch: 0,
	bearing: 0,
	maxZoom: 18,
	//minZoom: 12,
};

function MyMap({ props }) {
	const [addedPolygonsIds, setAddedPolygonsIds] = useState(new Set());
	const [polygons, setPolygons] = useState([]);
	const [h3Indexes, setH3Indexes] = useState(new Map());

	//setting up the indezes of h3 areas that need to be fetched at right time
	useEffect(() => {
		let map = new Map();
		props.forEach((h3Index) => {
			map.set(h3Index, false);
		});
		setH3Indexes(map);
	}, []);

	//setting up the deck layer for the polygons
	const polygonsLayer = new GeoJsonLayer({
		id: 'polygons-layer',
		getFillColor: [255, 0, 0, 50],
		getLineColor: [0, 255, 0, 255],
		getLineWidth: 10,
		lineWidthMinPixels: 0.5,
		// data: geodata,
		data: polygons,
	});

	//function to fetch a single h3 area and update the polygons state
	const fetchH3Index = async (h3Index) => {
		const res = await fetch('http://localhost:5000/polygon/' + h3Index, {
			method: 'GET',
		});
		const data = await res.json();
		let toAdd = [];
		data.forEach((polygon) => {
			if (!addedPolygonsIds.has(polygon.properties.id)) {
				toAdd.push(polygon);
				setAddedPolygonsIds((prev) => new Set(prev.add(polygon.properties.id)));
			}
		});
		toAdd.length > 0 ? setPolygons((prev) => [...prev, ...toAdd]) : null;
	};

	//function to calculate the prefetching of h3 areas and fetching if needed
	const checkPrefetchH3Areas = async (lat, lon) => {
		const h3 = geoToH3(lat, lon, RESOLUTION);
		let visionH3Indexes = kRing(h3, 1);
		visionH3Indexes.forEach((h3Index) => {
			if (h3Indexes.get(h3Index) === false) {
				console.log('loading ' + h3Index);
				fetchH3Index(h3Index);
				h3Indexes.set(h3Index, true);
			}
		});
	};

	return (
		<DeckGL
			initialViewState={INITIAL_VIEW_STATE}
			controller={{ inertia: true }}
			layers={[polygonsLayer]}
			onViewStateChange={({ viewState }) => {
				checkPrefetchH3Areas(viewState.latitude, viewState.longitude);
			}}
		>
			<StaticMap
				mapStyle={MAP_STYLE}
				mapboxApiAccessToken={process.env.mapbox_key}
			/>
		</DeckGL>
	);
}

export default MyMap;
