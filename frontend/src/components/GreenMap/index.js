import React, { useState, useEffect, useCallback, useContext } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { kRing, geoToH3, h3ToChildren } from "h3-js";
import { LinearInterpolator } from "@deck.gl/core";
import { MapContext } from "../../MapPage";
import axios from "axios";
import useMap from "../../hooks/useMap";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1IjoibG9yaXN1bml0byIsImEiOiJja3p5NWN0dm0wN2JzMnVwOWtmbmRkMDc2In0.CJxAtEw3pm0q4Iut7t09Xw";

// Viewport settings

function GreenMap({ indexes }) {
	const {
		setPolygonDetails,
		polygonDetails: selectedPolygon,
		goTo,
		setGoTo,
	} = useMap();
	const calculatePolyView = (coords, area) => {
		console.log("calculatePolyView");
		let zoom = 11;
		if (area != null) {
			if (area > 0.005) {
				zoom = 11.8;
			} else if (area > 0.002 && area < 0.005) {
				zoom = 12.4;
			} else if (area > 0.001 && area < 0.002) {
				zoom = 13;
			} else if (area > 0.0005 && area < 0.001) {
				zoom = 13.7;
			} else if (area > 0.00009 && area < 0.0005) {
				zoom = 14.3;
			} else if (area > 0.00001 && area < 0.0009) {
				zoom = 15;
			} else {
				zoom = 16;
			}
		}

		const height = window.innerHeight;
		const width = window.innerWidth;
		const isMobile = width < 1000;
		let long;
		let lat;
		const unit = 2 ** zoom;
		if (isMobile) {
			long = coords[0];
			lat = coords[1] - height / 10 / unit;
		} else {
			console.log("not mobile");
			long = coords[0] + width / 8 / unit;
			lat = coords[1];
		}

		return { longitude: long, latitude: lat, zoom: zoom, bearing: 0, pitch: 0 };
	};
	const [viewState, setViewState] = useState(
		selectedPolygon == null
			? {
					longitude: 7.6436,
					latitude: 45.069,
					zoom: 15,
					pitch: 0,
					bearing: 0,
			  }
			: calculatePolyView(
					selectedPolygon.properties.center.coordinates,
					selectedPolygon.properties.area
			  )
	);
	const [h3Indexes, setH3Indexes] = useState(indexes);
	const [layer, setLayer] = useState([]);
	const [addedPolygonsIds, setAddedPolygonsIds] = useState(new Set());
	const [selectedPolygonLayer, setSelectedPolygonLayer] = useState(null);
	const [updateView, setUpdateView] = useState(true);
	/* const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 1000px)")
  ); */

	useEffect(() => {
		console.log("primo avvio" + selectedPolygon);
		if (selectedPolygon != null) {
			setSelectedPolygonLayer(
				new GeoJsonLayer({
					data: selectedPolygon,
					pickable: false,
					stroked: false,
					filled: true,
					extruded: true,
					pointType: "circle",
					lineWidthScale: 20,
					lineWidthMinPixels: 2,
					getFillColor: [49, 94, 38, 255],
					getPointRadius: 100,
					getElevation: 0,
					getLineWidth: 1,
				})
			);
		}
	}, []);

	const getResolutionByZoom = (zoom) => {
		if (viewState.zoom >= 15) return 8;
		else if (viewState.zoom >= 14) return 7;
		else if (viewState.zoom >= 13) return 6;
		else return null;
	};

	const setLoadedH3 = (index, res) => {
		h3Indexes.set(index, { loaded: true });
		if (res == 6) {
			let children = h3ToChildren(index, 7);
			children.push(h3ToChildren(index, 8));
			children.forEach((child) => {
				if (!h3Indexes.has(child)) {
					h3Indexes.set(child, { loaded: true });
				}
			});
		} else if (res == 7) {
			let children = h3ToChildren(index, 8);
			children.forEach((child) => {
				if (!h3Indexes.has(child)) {
					h3Indexes.set(child, { loaded: true });
				}
			});
		}
	};

	const checkPrefetchH3Areas = () => {
		const res = getResolutionByZoom(viewState.zoom);

		const centeredH3 = geoToH3(viewState.latitude, viewState.longitude, res);

		const prefetchH3 = kRing(centeredH3, 2);

		prefetchH3.forEach((h3) => {
			if (h3Indexes.has(h3) && h3Indexes.get(h3).loaded == false) {
				setLoadedH3(h3, res);
				console.log("prefetching");
				fetchPolygons(h3);
			}
		});
	};

	const fetchPolygons = async (h3Index) => {
		axios
			.get(`http://localhost:5000/polygon/${h3Index}`)
			.then((res) => {
				//await setLoadedPolygons(data, res);
				const newlayer = getNewFilteredLayer(h3Index, res.data);
				setLayer((prev) => [...prev, newlayer]);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getNewFilteredLayer = (index, data) => {
		const filtered = data.filter(
			(poly) => !addedPolygonsIds.has(poly.properties.id)
		);

		var set = addedPolygonsIds;

		if (filtered.length == 0) return;
		filtered.forEach((poly) => set.add(poly.properties.id));
		setAddedPolygonsIds(set);

		return new GeoJsonLayer({
			id: index,
			data: filtered,
			pickable: true,
			stroked: false,
			filled: true,
			extruded: true,
			pointType: "circle",
			lineWidthScale: 20,
			lineWidthMinPixels: 2,
			getFillColor: [131, 158, 124, 100],
			getPointRadius: 100,
			getElevation: 0,
			getLineWidth: 1,
			autoHighlight: true,
			highlightColor: [131, 158, 124],
			onClick: (info, event) => {
				setPolygonDetails(info.object);
				setSelectedPolygonLayer(
					new GeoJsonLayer({
						data: info.object,
						pickable: false,
						stroked: false,
						filled: true,
						extruded: true,
						pointType: "circle",
						lineWidthScale: 20,
						lineWidthMinPixels: 2,
						getFillColor: [49, 94, 38, 255],
						getPointRadius: 100,
						getElevation: 0,
						getLineWidth: 1,
					})
				);
				goToPoly(
					info.object.properties.center.coordinates,
					info.object.properties.area
				);
			},
		});
	};

	const goToPoly = (coords, area) => {
		setUpdateView(false);
		setViewState({
			...calculatePolyView(coords, area),
			transitionDuration: 500,
			transitionInterpolator: new LinearInterpolator(),
			onTransitionEnd: () => {
				setUpdateView(true);
			},
		});
	};

	useEffect(() => {
		if (goTo != null) {
			console.log(goTo);
			console.log("MISPOSTO");
			goToCity(goTo);

			setGoTo(null);
		}
	}, [goTo]);

	const goToCity = useCallback((coords) => {
		setUpdateView(false);
		setViewState({
			longitude: coords[1],
			latitude: coords[0],
			zoom: 12,
			pitch: 0,
			bearing: 0,
			transitionDuration: 500,
			transitionInterpolator: new LinearInterpolator(),
			onTransitionEnd: () => {
				setUpdateView(true);
			},
		});
		checkPrefetchH3Areas();
	}, []);

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
				layers={selectedPolygon ? [...layer, selectedPolygonLayer] : [...layer]}
				/* _typedArrayManagerProps={
          isMobile ? { overAlloc: 1, poolSize: 0 } : null
        } */
				getTooltip={({ object }) =>
					object && {
						html: `<h2>${object.properties.id}</h2><div>${object.message}</div>`,
						style: {
							width: "7rem",
							borderRadius: "0.5rem",
							backgroundColor: "#fff",
							marginTop: "-5rem",
							zIndex: "150",
							marginLeft: "-3.5rem",
							textAlign: "center",
							color: "#000",
							boxShadow: "0 0 0.3rem 0.3rem rgba(0, 0, 0, 0.2)",
						},
					}
				}
				onViewStateChange={(v) => {
					if (updateView) {
						setViewState(v.viewState);
						checkPrefetchH3Areas();
					}
				}}
				onLoad={() => {
					checkPrefetchH3Areas();
				}}
				onDragEnd={() => {
					//checkPrefetchH3Areas();
				}}
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

export default GreenMap;
