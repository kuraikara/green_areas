import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "axios";

function useLazyLoader({ query, page }) {
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [error, setError] = useState("");
	const [hasMore, setHasMore] = useState(true);
	const axiosPrivate = useAxiosPrivate();

	const reload = () => {
		setItems([]);
	};

	useEffect(() => {
		setLoading(true);
		console.log("useLazyLoader: useEffect: page: ", page);
		let cancel;
		axiosPrivate
			.get(query, {
				params: { page: page },
				cancelToken: new axios.CancelToken((c) => (cancel = c)),
			})
			.then((res) => {
				console.log(res.data);
				setItems((prev) => [...prev, ...res.data.items]);
				setLoading(false);
				setHasMore(res.data.has_more);
			})
			.catch((err) => {
				if (axios.isCancel(err)) return;
				console.log(err);
				setError(err);
			});
		return () => cancel();
	}, [query, page]);

	return { loading, setLoading, items, setItems, error, hasMore, reload };
}

export default useLazyLoader;
