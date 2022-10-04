import React, { useEffect, useState, useRef, useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import styled from "styled-components";
import { MapContext } from "../MapPage";
import useAxios from "../hooks/useAxios";
import axios from "../apis/greenServer";
import useMap from "../hooks/useMap";

export default function SearchField() {
	const [isOpen, setIsOpen] = useState(false);
	const searchRef = useRef();

	const { setGoTo } = useMap();
	const should = useRef(true);

	const [cities, error, loading] = useAxios({
		axiosInstance: axios,
		method: "GET",
		url: "/city",
	});

	useEffect(() => {
		if (should.current) {
			should.current = false;
			console.log("search");
			document.addEventListener("mousedown", (event) => {
				if (
					searchRef.current != null &&
					!searchRef.current.contains(event.target)
				) {
					setIsOpen(false);
				}
			});
		}
		return () => {
			document.removeEventListener("mousedown", (event) => {});
		};
	}, []);

	const inputSearch = () => {
		//richiesta api e go to
	};

	const updateMap = (coords) => {
		setGoTo(coords);
		setIsOpen(false);
	};

	return (
		<Bar ref={searchRef}>
			<Field onClick={() => setIsOpen(true)}>
				<Input type="text" placeholder="Search" />
				<Icon />
			</Field>
			{isOpen && (
				<List>
					<Separator />
					{cities.map((city, key) => (
						<ListItem
							onClick={() => {
								updateMap(city.center);
							}}
							key={key}
						>
							{city.name}
						</ListItem>
					))}
				</List>
			)}
		</Bar>
	);
}

export const Icon = styled(IoIosSearch)`
	&:hover {
		border-radius: 20%;
		background: var(--primary-green);
		color: #fff;
	}
`;

export const Bar = styled.div`
	position: absolute;
	/* top: 1rem;
	left: 8rem; */
	z-index: 100;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

export const List = styled.div``;

export const Separator = styled.div`
	height: 0.1rem;
	background: var(--primary-green);
	opacity: 0.2;
`;

export const ListItem = styled.div`
	padding: 0.5rem 1rem 0.5rem 1.5rem;
	font-size: 1rem;
	cursor: pointer;

	&:hover {
		background: var(--hover-green);
		border-radius: 1rem;
		color: #fff;
	}
`;

export const Field = styled.div`
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem 0.5rem 1rem;

	border: 0;
	color: var(--primary-green);
	font-size: 1.5rem;
	text-decoration: none;

	&:hover {
		border-radius: 1rem;
		background: #fff;
		color: var(--primary-green);
	}
`;

export const Input = styled.input`
	border: 0;
	font-size: 1rem;
	padding: 0.5rem;

	&:focus {
		outline: none;
	}
`;
