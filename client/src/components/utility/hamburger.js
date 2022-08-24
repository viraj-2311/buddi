import React from "react";
import styled from "styled-components";

const HamburgerStyle = styled.button`
  background: none;
  border: none;
  span.icon-bar {
    display: block;
    height: 2px;
    width: 18px;
    margin: 3px auto;
    background-color: #727272;
    border-radius: 1px;
  }
`;
const Hamburger = props => {
  return (
    <HamburgerStyle onClick={props.onClick}>
      <span className="icon-bar one"></span>
      <span className="icon-bar two"></span>
      <span className="icon-bar three"></span>
    </HamburgerStyle>
  );
};
export default Hamburger;
