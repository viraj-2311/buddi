import styled from "styled-components";
import { colors, grid } from "@iso/assets/styles/constants";

export const getBackgroundColor = (isDragging, isGroupedOver) => {
  if (isDragging) {
    return "colors.green";
  }

  if (isGroupedOver) {
    return colors.grey.N30;
  }

  return colors.white;
};

// background-color: ${({ isDraggingOver }) =>
//     isDraggingOver ? colors.grey.dark : 'inherit'};
export const Container = styled.span`
  border-radius: 10px;
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.shadow}` : "none"};
  min-height: 40px;
  margin-bottom: 20px;
  user-select: none;
  /* overflow: hidden; */
  /* anchor overrides */
  color: ${colors.black};

  &:hover,
  &:active {
    color: ${colors.black};
    text-decoration: none;
  }

  /* flexbox */
  display: flex;
  align-items: center;
`;

export const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

export const HrBar = styled.div`
  height: 1px;
  background-color: #f3f5fd;
`;

export const CardBody = styled.div`
  color: #2f2e50;
  cursor: pointer;
  position: relative;
`;

export const CardFooter = styled.div`
  padding: 20px 0 0 0;
`;