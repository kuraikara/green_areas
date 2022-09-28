import React, { useState, useEffect, useRef } from "react";

import axios from "../apis/greenServer";
import styled from "styled-components";
import { Loader } from "../components/Miscellaneus";
import useMap from "../hooks/useMap";
import { useNavigate, useSearchParams } from "react-router-dom";

function RedirectMap() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { setPolygonDetails } = useMap();
	const nav = useNavigate();
	const [searchParams] = useSearchParams();

	const fetchPolygon = async (id) => {
		try {
			const response = await axios.get("/polygon/" + id);
			console.log(response.data);
			setPolygonDetails(response.data);
			nav("/map", { replace: true });
		} catch (error) {
			console.error(error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPolygon(searchParams.get("id"));
	}, []);

	return <Loader />;
}

export default RedirectMap;
