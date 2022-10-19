import React, { Suspense, lazy, useState, useEffect } from "react";
import GreenMap from "../components/map/GreenMap";
import DetailsPanel from "../components/map/DetailsPanel";
import BackButton from "../components/map/BackButton";
import SearchField from "../components/SearchField";
import useAxios from "../hooks/useAxios";
import axios from "../apis/greenServer";
import useMap from "../hooks/useMap";
import MapBar from "../components/map/MapBar";
import { Loader } from "../components/Miscellaneus";

//const Map = lazy(() => import("./components/Map"));

export default function MapPage() {
	const [indexes, error, loading, refetch] = useAxios({
		axiosInstance: axios,
		method: "GET",
		url: "/h3",
	});

	/* const [loading, setLoading] = useState(true);
	const [indexes, setIndexes] = useState([]);
	const [error, setError] = useState("");

	const fetchIndexes = async () => {
		try {
			const res = await axios.get("/h3");
			setIndexes(res.data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchIndexes();
	}, []); */

	const { polygonDetails } = useMap();

	return (
		<>
			{loading && <Loader />}
			<MapBar />
			{!loading && indexes.length > 0 && (
				<GreenMap
					indexes={new Map(indexes.map((index) => [index, { loaded: false }]))}
				/>
			)}
			{polygonDetails != null && <DetailsPanel />}
		</>
	);
}
