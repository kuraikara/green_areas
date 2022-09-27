import { useContext } from "react";
import MapContext from "../context/MapProvider";

const useMap = () => {
	return useContext(MapContext);
};

export default useMap;
