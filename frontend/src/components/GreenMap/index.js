import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { kRing, geoToH3 } from "h3-js";
import DetailsPanel from "../DetailsPanel";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibG9yaXN1bml0byIsImEiOiJja3p5NWN0dm0wN2JzMnVwOWtmbmRkMDc2In0.CJxAtEw3pm0q4Iut7t09Xw";

// Viewport settings

function GreenMap({ setPolygonDetails, selectedPolygon, goTo, setGoTo }) {
  const [initialViewState, setInitialViewState] = useState({
    longitude: 7.6436,
    latitude: 45.069,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });
  const [lat_long_zoom, setLat_long_zoom] = useState([]);
  const [h3Map, setH3Map] = useState(new Map());
  const [layer, setLayer] = useState([]);
  const [addedPolygonsIds, setAddedPolygonsIds] = useState(new Set());
  const [selectedPolygonLayer, setSelectedPolygonLayer] = useState(null);

  useEffect(() => {
    setAddedPolygonsIds(new Set());
    setLayer([]);
    let map = new Map();

    const prom = new Promise((setup) => {
      fetch("http://localhost:5000/h3", { method: "GET" })
        .then((res) => res.json())
        .then((data) => setup(data));
    });

    let tmp = [];
    prom.then((data) => {
      data.forEach((index) => {
        map.set(index, { loaded: false });
        tmp.push(index);
      });
      console.log(map);
      setH3Map(map);
    });
  }, []);

  const checkPrefetchH3Areas = (res) => {
    const h3 = geoToH3(lat_long_zoom[0], lat_long_zoom[1], res);
    let visionH3Indexes = kRing(h3, 1);

    visionH3Indexes.forEach((index) => {
      if (h3Map.has(index) && h3Map.get(index).loaded == false) {
        h3Map.set(index, { loaded: true });
        console.log("carico " + index);

        const prom = new Promise((setup) => {
          fetch("http://localhost:5000/polygon/" + index, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((data) => setup(data));
        });

        prom
          .then((data) => {
            const filtered = data.filter(
              (poly) => !addedPolygonsIds.has(poly.properties.id)
            );

            var set = addedPolygonsIds;
            console.log(set);
            filtered.forEach((poly) => set.add(poly.properties.id));
            setAddedPolygonsIds(set);
            setLayer((prev) => [
              ...prev,
              new GeoJsonLayer({
                id: "geojson-layer-" + index,
                data: data,
                pickable: true,
                stroked: false,
                filled: true,
                extruded: true,
                pointType: "circle",
                lineWidthScale: 20,
                lineWidthMinPixels: 2,
                getFillColor: [160, 160, 180, 200],
                getPointRadius: 100,
                getElevation: 10,
                getLineWidth: 1,
                autoHighlight: true,
                highlightColor: [131, 158, 124, 255],
                onClick: (info, event) => {
                  setPolygonDetails(info.object.properties);
                  console.log(info.object);
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
                      getFillColor: [49, 94, 38, 200],
                      getPointRadius: 100,
                      getElevation: 10,
                      getLineWidth: 1,
                    })
                  );
                  goToCoords(
                    info.object.properties.center.coordinates,
                    info.object.properties.area
                  );
                },
              }),
            ]);
          })
          .then(console.log(layer));
      }
    });
  };

  const goToCoords = (coords, area) => {
    console.log(area);
    let zoom;
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
    console.log(coords[1]);
    setInitialViewState({
      longitude: coords[0] + 0.003,
      latitude: coords[1],
      zoom: zoom,
      pitch: 0,
      bearing: 0,
      transitionDuration: 800,
    });
  };

  if (goTo != null) {
    setInitialViewState({
      longitude: goTo[0],
      latitude: goTo[1],
      zoom: 11,
      pitch: 0,
      bearing: 0,
      transitionDuration: 800,
    });
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100vh",
        maxWidth: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={selectedPolygon ? [...layer, selectedPolygonLayer] : [...layer]}
        getTooltip={({ object }) =>
          object && {
            html: `<h2>${object.properties.id}</h2><div>${object.message}</div>`,
            style: {
              backgroundColor: "var(--primary-green)",
              marginTop: "-5rem",
            },
          }
        }
        onViewStateChange={({ viewState }) => {
          setLat_long_zoom([
            viewState.latitude,
            viewState.longitude,
            viewState.zoom,
          ]);

          console.log(
            viewState.latitude +
              " " +
              viewState.longitude +
              " " +
              viewState.zoom
          );
        }}
        onLoad={() => {}}
        onDragEnd={() => {
          //console.log('drag');
          if (lat_long_zoom[2] > 11) {
            checkPrefetchH3Areas(6);
          }
          if (lat_long_zoom[2] > 14) {
            checkPrefetchH3Areas(7);
          }
          //checkPrefetchH3Areas();
        }}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </div>
  );
}

export default GreenMap;
