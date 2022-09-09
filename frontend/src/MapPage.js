import React, { Suspense, lazy, useState, useEffect } from "react";
import GreenMap from "./components/GreenMap";
import DetailsPanel from "./components/DetailsPanel";
import BackButton from "./components/BackButton";
import SearchField from "./components/SearchField";
import useAxios from "./hooks/useAxios";
import axios from "./apis/greenServer";

//const Map = lazy(() => import("./components/Map"));
export const MapContext = React.createContext();

export default function MapPage() {
  const [polygonDetails, setPolygonDetails] = useState(null);
  const [goTo, setGoTo] = useState(null);
  const [indexes, error, loading, refetch] = useAxios({
    axiosInstance: axios,
    method: "GET",
    url: "/h3",
  });
  /* const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  } */
  /* const { data: indexes, isLoading } = useQuery("indexes", () =>
    fetch("http://localhost:5000/indexes", { method: "GET" }).then((res) =>
      res
        .json()
        .then((data) => {
          let map = new Map();
          data.forEach((index) => {
            map.set(index, { loaded: false });
          });
          return map;
        })
        .catch((err) => console.log("SUUUUUUUUUUUUUUUUUUUUUUUUUUUU"))
    )
  ); */

  /* useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Available");
    } else {
      console.log("Not Available");
    }
    let map = new Map();
    let ind = [];
    const prom = new Promise((setup) => {
      fetch("http://localhost:5000/h3", { method: "GET" })
        .then((res) => res.json())
        .then((data) => setup(data));
    }).catch((err) => console.log("WEEEEEEEEE"));

    let tmp = [];
    prom.then((data) => {
      data.forEach((index) => {
        map.set(index, { loaded: false });
        tmp.push(index);
      });
      setIndexes(map);
    });
  }, []); */

  return (
    <>
      <Suspense fallback={<h1>LOADING</h1>}>
        <BackButton to="/" />
        <MapContext.Provider
          value={{ polygonDetails, setPolygonDetails, goTo, setGoTo }}
        >
          <SearchField />
          {!loading && indexes.length > 0 && (
            <GreenMap
              indexes={
                new Map(indexes.map((index) => [index, { loaded: false }]))
              }
            />
          )}
          {polygonDetails != null && (
            <DetailsPanel polygon={polygonDetails} clear={setPolygonDetails} />
          )}
        </MapContext.Provider>
      </Suspense>
    </>
  );
}
