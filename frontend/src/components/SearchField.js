import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import styled from "styled-components";

export default function SearchField({ setGoTo }) {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState([]);

  useEffect(() => {
    const prom = new Promise((setup) => {
      fetch("http://localhost:5000/city", { method: "GET" })
        .then((res) => res.json())
        .then((data) => setup(data));
    });

    prom.then((data) => setCities(data));
  }, []);

  return (
    <Bar>
      <Field>
        <Input
          type="text"
          placeholder="Search"
          onFocus={() => setSearch(cities)}
          onBlur={() => setSearch([])}
        />
        <IoIosSearch />
      </Field>
      {search.length > 0 && (
        <List>
          <Separator />
          {search.map((city, key) => (
            <ListItem onClick={() => console.log("asdasdasd")} key={key}>
              {city.name}
            </ListItem>
          ))}
        </List>
      )}
    </Bar>
  );
}
const Bar = styled.div`
  position: absolute;
  top: 1rem;
  left: 8rem;
  z-index: 100;
  background: #fff;
  border-radius: 1rem;
`;

const List = styled.div``;

const Separator = styled.div`
  height: 0.1rem;
  background: var(--primary-green);
  opacity: 0.2;
`;

const ListItem = styled.div`
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  font-size: 1rem;

  &:hover {
    background: var(--hover-green);
    border-radius: 1rem;
    color: #fff;
  }
`;

const Field = styled.div`
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

const Input = styled.input`
  border: 0;
  font-size: 1rem;
  padding: 0.5rem;

  &:focus {
    outline: none;
  }
`;
