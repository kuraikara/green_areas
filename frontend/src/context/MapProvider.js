import { createContext, useState } from "react";

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
	const [polygonDetails, setPolygonDetails] = useState(null);
	const [goTo, setGoTo] = useState(null);

	return (
		<MapContext.Provider
			value={{
				polygonDetails,
				setPolygonDetails,
				goTo,
				setGoTo,
			}}
		>
			{children}
		</MapContext.Provider>
	);
};

export default MapContext;
