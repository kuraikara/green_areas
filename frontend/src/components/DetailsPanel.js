import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoMdClose, IoMdExpand } from "react-icons/io";
import {
  MdOutlineExpandLess,
  MdOutlineExpandMore,
  MdClose,
} from "react-icons/md";

export default function DetailsPanel(props) {
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef();
  const should = useRef(true);

  useEffect(() => {
    if (should.current) {
      should.current = false;
      console.log("details");
      document.addEventListener("mousedown", (event) => {
        if (
          panelRef.current != null &&
          !panelRef.current.contains(event.target)
        ) {
          setExpanded(false);
        }
      });
    }
    return () => {
      document.removeEventListener("mousedown", (event) => {});
    };
  }, []);

  return (
    <CollapsiblePanel ref={panelRef} expanded={expanded}>
      <CloseIcon onClick={() => props.clear(null)} />
      {!expanded ? (
        <ExpandIcon
          onClick={() => {
            setExpanded(true);
          }}
        />
      ) : (
        <CollapseIcon
          onClick={() => {
            setExpanded(false);
          }}
        />
      )}
      <div>{props.polygon.id}</div>
    </CollapsiblePanel>
  );
}

const CollapsiblePanel = styled.div`
  z-index: 100;
  background-color: #fff;
  position: absolute;
  right: 20px;
  bottom: 1.5rem;
  border-radius: 1rem;
  width: 35%;
  height: calc(100vh - 2.5rem);
  text-align: center;
  padding-top: 1rem;
  animation-duration: 1s;
  animation-name: slidein;
  animation-direction: horizontal;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  transition: height 1s;

  @keyframes slidein {
    from {
      width: 0%;
    }

    to {
      width: 35%;
    }
  }

  @media screen and (max-width: 1000px) {
    width: calc(100vw - 1rem);
    left: 0.5rem;
    height: ${({ expanded }) => (expanded ? "85%" : "40%")};
    animation-direction: vertical;

    @keyframes slidein {
      from {
        height: 0%;
      }

      to {
        height: 40%;
      }
    }
  }
`;

const CloseIcon = styled(MdClose)`
  position: absolute;
  top: 5px;
  left: 10px;
  font-size: 4rem;
  color: var(--primary-green);
  cursor: pointer;
`;

const ExpandIcon = styled(MdOutlineExpandLess)`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 4rem;
  color: var(--primary-green);
  cursor: pointer;
  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const CollapseIcon = styled(MdOutlineExpandMore)`
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 4rem;
  color: var(--primary-green);
  cursor: pointer;
  @media screen and (min-width: 1000px) {
    display: none;
  }
`;
