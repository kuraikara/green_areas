import React, { Suspense, lazy, useState } from "react";
import GreenMap from "./components/GreenMap";
import DetailsPanel from "./components/DetailsPanel";
import BackButton from "./components/BackButton";
import SearchField from "./components/SearchField";

//const Map = lazy(() => import("./components/Map"));

export default function MapPage() {
  const [polygonDetails, setPolygonDetails] = useState(null);
  const [goTo, setGoTo] = useState(null);

  return (
    <>
      <BackButton to="/" />
      <SearchField setGoTo={setGoTo} />
      <Suspense fallback={<div>LOADING</div>}>
        <GreenMap
          setPolygonDetails={setPolygonDetails}
          selectedPolygon={polygonDetails}
          setGoTo={setGoTo}
          goTo={goTo}
        />
        {polygonDetails != null && (
          <DetailsPanel polygon={polygonDetails} clear={setPolygonDetails} />
        )}
      </Suspense>
    </>
  );
}
