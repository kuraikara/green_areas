import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { kRing, geoToH3 } from "h3-js";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibG9yaXN1bml0byIsImEiOiJja3p5NWN0dm0wN2JzMnVwOWtmbmRkMDc2In0.CJxAtEw3pm0q4Iut7t09Xw";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 7.6436,
  latitude: 45.069,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

function Map() {
  /*const [lat_long_zoom, setLat_long_zoom] = useState([]);
  const [vision, setVision] = useState([]);
  const [h3Map, setH3Map] = useState(new Map());
  const [layer, setLayer] = useState([]);
  const [addedPolygonsIds, setAddedPolygonsIds] = useState(new Set());

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
      setLayer(
        new H3HexagonLayer({
          id: "h3-hexagon-layer",
          data: tmp,
          pickable: true,
          wireframe: false,
          filled: true,
          extruded: true,
          elevationScale: 1,
          opacity: 0.5,
          getHexagon: (d) => d,
          getFillColor: (d) => [70, 160, 70, 200],
          getElevation: (d) => 1,
        })
      );
    });
  }, []);

  var h3Layer = new H3HexagonLayer({
    id: "h3-hexagon-layer",
    data: vision,
    pickable: true,
    wireframe: false,
    filled: true,
    extruded: true,
    elevationScale: 1,
    opacity: 0.5,
    getHexagon: (d) => d,
    getFillColor: (d) => [70, 160, 70, 200],
    getElevation: (d) => 1,
  });

  const layers = [];

  const checkPrefetchH3Areas = (res) => {
    const h3 = geoToH3(lat_long_zoom[0], lat_long_zoom[1], res);
    let visionH3Indexes = kRing(h3, 2);
    setVision(visionH3Indexes);
    //setLayer([]);
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
              }),
            ]);
          })
          .then(console.log(layer));
      }
    });
  };
*/
  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        //layers={layer}
        /*onViewStateChange={({ viewState }) => {
        setLat_long_zoom([
          viewState.latitude,
          viewState.longitude,
          viewState.zoom,
        ]);
        console.log(
          viewState.latitude + " " + viewState.longitude + " " + viewState.zoom
        );
      }}
      onLoad={() => {
        //fetchAll();
      }}
      onDragEnd={() => {
        //console.log('drag');
        if (lat_long_zoom[2] > 11) {
          checkPrefetchH3Areas(6);
        }
        if (lat_long_zoom[2] > 14) {
          checkPrefetchH3Areas(7);
        }
        //checkPrefetchH3Areas();
      }}*/
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    </div>
  );
}

export default Map;
