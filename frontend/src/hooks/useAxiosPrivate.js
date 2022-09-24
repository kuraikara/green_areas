import { axiosPrivate } from "../apis/greenServer";
import { useEffect, useRef } from "react";
import useRefleshToken from "./useRefleshToken";
import useAuth from "./useAuth";

export default function useAxiosPrivate() {
	const reflesh = useRefleshToken();
	const { auth } = useAuth();
	const should = useRef(true);

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest.sent) {
					prevRequest.sent = true;
					const newAccessToken = await reflesh();
					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [auth, reflesh]);

	return axiosPrivate;
}
