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
  z-index: 100;
  background-color: #fff;
  position: absolute;
  right: 20px;
  top: 20px;
  border-radius: 1rem;
  width: 35%;
  height: calc(100vh - 50px);
  text-align: center;
  padding-top: 1rem;
  animation-duration: 1s;
  animation-name: slidein;
  animation-direction: horizontal;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

  @keyframes slidein {
    from {
      width: 0%;
    }

    to {
      width: 35%;
    }
  }

  @media screen and (max-width: 1000px) {
    width: calc(100vw - 40px);
    left: 20px;
    height: 40%;
    bottom: 20px;
    top: auto;
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

const CloseIcon = styled(IoMdClose)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 3rem;
  color: var(--primary-green);
  cursor: pointer;
`;
