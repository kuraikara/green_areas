import { useState } from "react";
import styled from "styled-components";

export const Tabs = (state) => {
	const children = state.children;
	const [selected, setSelected] = useState(0);
	return (
		<>
			<TabsContainer>
				{children.map((child, index) => {
					return (
						<Tab
							key={index}
							onClick={() => setSelected(index)}
							selected={selected == index ? 1 : 0}
						>
							{child.props.tabname}
						</Tab>
					);
				})}
			</TabsContainer>
			{children[selected]}
		</>
	);
};

export default Tabs;

const TabsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	margin-bottom: 1rem;
	font-size: 1.2rem;
	font-weight: bold;
`;

const Tab = styled.div`
	background-color: ${({ selected }) =>
		selected == 1 ? "var(--primary-green)" : "#fff"};
	color: ${({ selected }) => (selected == 1 ? "#fff" : "#000")};
	flex-grow: 1;
	text-align: center;
	padding: 1rem;
	border-radius: 1rem;
	margin: 0 1rem;
	cursor: pointer;
	transition: all 0.5s ease-in-out;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

	&:hover {
		${({ selected }) =>
			selected == 1 ? "" : "background-color: var(--hover-green)"}
	}
`;
