import React from "react";
import Button from "@iso/components/uielements/button";
import Switch from "@iso/assets/images/switch.png";
import LogoWhite from "@iso/assets/images/logo.webp";
import { useHistory } from "react-router";

import { AccountClosedContainer } from "./AccountClosed.styles";
import { PUBLIC_ROUTE } from "../../../route.constants";

const AccountClosed = () => {
  const history = useHistory();
  return (
    <AccountClosedContainer>
      <div className="account-close-outer">
        <img src={LogoWhite} alt="logo" className="logo-white" />
        <div className="account-close-inner">
          <div>
            <img src={Switch} alt="logo" />
            <h5>Your account has been closed.</h5>
            <p>Thanks and hope to see you again some day!</p>
          </div>
          <hr />
          <div>
            <p>Did you change your mind?</p>
            <Button
              shape="round"
              type="primary"
              htmlType="submit"
              className="next-btn"
              onClick={() => history.push(PUBLIC_ROUTE.SIGN_UP)}
            >
              Create a new account
            </Button>
          </div>
        </div>
      </div>
    </AccountClosedContainer>
  );
};

export default AccountClosed;
