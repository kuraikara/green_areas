import React, { useState, useEffect, useCallback, useContext } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import {
	H3HexagonLayer,
	_Tileset2D as Tileset2D,
	TileLayer,
} from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { kRing, geoToH3, h3ToChildren, h3ToParent } from "h3-js";
import { LinearInterpolator } from "@deck.gl/core";
import { MapContext } from "../../pages/MapPage";
import axios from "../../apis/greenServer";
import useMap from "../../hooks/useMap";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1IjoibG9yaXN1bml0byIsImEiOiJja3p5NWN0dm0wN2JzMnVwOWtmbmRkMDc2In0.CJxAtEw3pm0q4Iut7t09Xw";

const viewState = {
	longitude: 7.905030400290451,
	latitude: 43.86137904862206,
	zoom: 15,
	pitch: 0,
	bearing: 0,
};

class QuadkeyTileset2D extends Tileset2D {
	getTileIndices(opts) {
		const { x, y, z } = opts;
		console.log(geoToH3(x, y, z));
		return super
			.getTileIndices(opts)
			.map(({ x, y, z }) => ({ q: geoToH3(x, y, z) }));
	}

	getTileId({ q }) {
		return q;
	}

	getTileMetadata(index) {
		return {}; // Depending on use-case. OSM calculates bbox here, but TileLayer doesn't require it
	}

	getTileZoom({ q }) {
		return q;
	}

	getParentIndex(index) {
		const q = h3ToParent(index.q, index.q.length - 1);
		return { q };
	}
}

const layerprova = new TileLayer({
	TilesetClass: QuadkeyTileset2D,
	data: "http://localhost:5000/polygons/{q}",
	renderSubLayers: (props) => {
		console.log(props);
	},
});

function GreenMapV2({ indexes }) {
	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				minWidth: "100%",
				minHeight: "100vh",
				width: "100%",
				height: "100vh",
				maxWidth: "100%",
				maxHeight: "100vh",
				overflow: "hidden",
				zIndex: "50",
			}}
		>
			<DeckGL
				initialViewState={viewState}
				controller={true}
				layers={[layerprova]}
				/* _typedArrayManagerProps={
          isMobile ? { overAlloc: 1, poolSize: 0 } : null
        } */
			>
				<StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
			</DeckGL>
			{viewState.zoom < 13 && (
				<h1
					style={{
						zIndex: "100",
						position: "absolute",
						bottom: "10px",
						textAlign: "center",
						width: "100%",
					}}
				>
					Avvicinati per visualizzare i parchi!
				</h1>
			)}
		</div>
	);
}

export default GreenMapV2;
