import styled from "styled-components";
import { palette } from 'styled-theme';
import { grid } from "@iso/assets/styles/constants";

export const Wrapper = styled.div`
  background-color: ${({ isDraggingOver }) =>
    isDraggingOver ? "#e6eaf8" : "inherit"};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : "inherit")};
  padding: 0 20px 20px;
  transition: background-color 0.1s ease, opacity 0.1s ease;
  user-select: none;
`;

export const DropZone = styled.div`
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  margin-bottom: ${grid}px;
`;

export const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
`;

export const NoJobsHelper = styled.div`
  font-size: 15px;
  color: ${palette('text', 5)};
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background-color: #ffffff;
  line-height: 1.33;
}
`;
