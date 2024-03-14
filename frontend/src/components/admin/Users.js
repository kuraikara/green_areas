import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";

export default function Users() {
	const [users, setUsers] = useState([]);
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const fetchUsers = async () => {
			try {
				const response = await axiosPrivate.get("/admin/users", {
					signal: controller.signal,
					withCredentials: true,
				});
				console.log(response.data);
				isMounted && setUsers(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchUsers();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);
	return (
		<>
			<Title>Users</Title>
			{users?.length ? (
				<Table>
					<thead>
						<TableRow>
							<TableHeader> Username </TableHeader>
							<TableHeader> Email </TableHeader>
							<TableHeader> Role </TableHeader>
							<TableHeader> Silenced </TableHeader>
						</TableRow>
					</thead>
					<tbody>
						{users.map(
							(user, i) => (
								console.log(i),
								(
									<TableRow key={i} colored={i % 2 === 0}>
										<TableData> {user.username} </TableData>
										<TableData> {user.email} </TableData>
										<TableData> {user.role} </TableData>
										<TableData> No </TableData>
									</TableRow>
								)
							)
						)}
					</tbody>
				</Table>
			) : (
				<p>No users</p>
			)}
		</>
	);
}

const Title = styled.h2`
	margin-bottom: 1rem;
`;

const Table = styled.table`
	padding: 0;
	margin: 0;
	background: white;
	border-collapse: collapse;
	//border: 1px solid #ccc;
	//border-radius: 1rem;
`;

const TableHeader = styled.th`
	padding: 1rem 2rem;
	margin: 0;
	background: var(--primary-green);
	color: #fff;
`;

const TableRow = styled.tr`
	padding: 0;
	margin: 0;
	background: ${({ colored }) => (colored ? "lightgrey" : "white")};
`;

const TableData = styled.td`
	text-align: center;
	padding: 1rem;
`;
