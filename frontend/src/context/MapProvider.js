import { createContext, useState } from "react";
import axios from "../apis/greenServer";
import { useNavigate } from "react-router-dom";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
	const nav = useNavigate();
	const [polygonDetails, setPolygonDetails] = useState(null);
	const [goTo, setGoTo] = useState(null);
	const redirectTo = async (polygon_id) => {
		const res = await axios.get("/polygon/" + polygon_id);
		setPolygonDetails(res.data);
		nav("/map");
	};

	return (
		<MapContext.Provider
			value={{
				polygonDetails,
				setPolygonDetails,
				goTo,
				setGoTo,
				redirectTo,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};

export default MapContext;
