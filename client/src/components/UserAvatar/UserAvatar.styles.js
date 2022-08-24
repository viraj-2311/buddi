import styled from 'styled-components';

const ACTIVE_BORDER_COLOR = '#f48d3a';
const getBorderColor = (active) =>
  active ? ACTIVE_BORDER_COLOR : 'transparent';
const getBorder = (active) => `2px solid ${getBorderColor(active)}`;
export const NameAvatar = styled.div`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #ffff;
  font-weight: bold;
  background-color: ${(props) => props.color};
  border: ${(props) => getBorder(props.active)};
  border-radius: ${(props) => (props.circle ? '50%' : '2px')};
`;
export const PictureAvatar = styled.div`
  img {
    border-radius: ${(props) => (props.circle ? '50%' : '2px')};
    border: ${(props) => getBorder(props.active)};
  }
`;
