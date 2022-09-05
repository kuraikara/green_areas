import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

export default function DetailsPanel(props) {
  return (
    <CollapsiblePanel>
      <CloseIcon onClick={() => props.clear(null)} />
      <div>{props.polygon.id}</div>
    </CollapsiblePanel>
  );
}

const CollapsiblePanel = styled.div`
  z-index: 1000;
  background-color: #fff;
  position: absolute;
  right: 20px;
  top: 20px;
  border-radius: 1rem;
  width: 25%;
  height: calc(100vh - 50px);
  text-align: center;
  padding-top: 1rem;
  animation-duration: 1s;
  animation-name: slidein;
  animation-direction: horizontal;
  overflow: hidden;

  @keyframes slidein {
    from {
      width: 0%;
    }

    to {
      width: 25%;
    }
  }
`;

const CloseIcon = styled(IoMdClose)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 3rem;
  color: var(--primary-green);
  cursor: pointer;
`;
