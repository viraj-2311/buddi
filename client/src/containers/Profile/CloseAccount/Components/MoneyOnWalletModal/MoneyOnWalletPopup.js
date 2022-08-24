import React, { useState, useRef, useEffect } from "react";
import Button from "@iso/components/uielements/button";
import MultiplyIcon from "@iso/components/icons/Multiply";

import { MoneyOnWalletPopupContainer } from "./MoneyOnWalletPopup.styles";

const MoneyOnWalletPopup = ({
  visible,
  onCancel,
  onSuccess
}) => {

  return (
    <MoneyOnWalletPopupContainer
      visible={visible}
      closable={false}
      onCancel={onCancel}
      wrapClassName="if you want to add custom class then here add pls"
      footer={null}
    >
      <div className="modal-header d-flex">
        <h5>Before you close your account… </h5>
        <Button type="link" className="closeBtn" onClick={onCancel}>
          <MultiplyIcon width={14} height={14} />
        </Button>
      </div>
      <div className="modal-body">
        <p>
          You still have money in your balance to spend before your account can
          be closed. To transfer it, go to your Wallet.
        </p>

        <Button
          shape="round"
          type="primary"
          htmlType="submit"
          className="b-wallet-btn"
          onClick={onSuccess}
        >
          Buddi Wallet
        </Button>
      </div>
    </MoneyOnWalletPopupContainer>
  );
};

export default MoneyOnWalletPopup;
