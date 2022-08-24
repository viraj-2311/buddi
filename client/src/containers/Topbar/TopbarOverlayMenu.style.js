import styled from "styled-components";

export const ToolbarOverlayMenuStyle = styled.div`
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  position: fixed;
  z-index: 9000;
  overflow: hidden;
  height: 100vh;
  margin: 0;
  padding: 20px 0 6px;
  top: 0;
  left: 0;
  width: 260px;
  margin-left: ${props => (props.isOpen ? 0 : "-260px")};
  transition: all 0.6s ease-in-out;
  ul {
    padding: 0 20px 50px;
    margin: 0;
    li {
      font-family: open sans extrabold;
      font-size: 18px;
      color: #fff;
      padding: 12px 0;
    }
  }
`;
export const ToolbarOverlayMenuHeaderStyle = styled.div`
  padding-bottom: 20px;
`;
export const ToolbarOverlayHeaderLogo = styled.img`
  background-image: url(../assets/images/pixerf-white-logo-0e9fed014d.png);
  width: 91px;
  height: 36px;
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
`;
