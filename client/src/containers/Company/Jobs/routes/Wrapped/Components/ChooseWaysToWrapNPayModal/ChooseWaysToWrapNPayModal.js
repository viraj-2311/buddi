import React, { useState } from "react";
import ChooseWaysToWrapNPayModalContainer from "./ChooseWaysToWrapNPayModal.style";
import MultiplyIcon from "@iso/components/icons/Multiply";
import Button from "@iso/components/uielements/button";
import { Radio, Input, Space } from "antd";

const ChooseWaysToWrapNPayModal = ({
  visible,
  width,
  bodyStyle,
  onCancel,
  setCallback,
  wrapClassName = "waysToWrapModal",
}) => {
  const [option, setOption] = useState(1);

  const methods = [
    {
      id: 'pay-your-crew-without-invoice',
      title: 'Pay Musicians without Invoicing',
      desc: `If you are paying each musician less than $600 per year on a gig, take advantage of paying them immediately without invoicing. This feature allows you to pay musicians quickly through the wallet and still offers detailed reports on what you paid out.`,
      // value: 'DOWNLOAD_REPORT_AND_COMPLETE_JOB',
      value: 1,
    },
    {
      id: 'pay-your-crew-with-invoice',
      title: 'Use Buddi to pay your Talent through Invoicing',
      desc: 'Pay your musicians using the Buddi Wallet. You can request W-9 tax forms, take advantage of automated invoicing and reports with this feature.',
      // value: 'USE_BUDDY_TO_PAY_YOUR_CREW',
      value: 2,
    },
    
  ];

  return (
    <ChooseWaysToWrapNPayModalContainer
      visible={visible}
      closable={false}
      // width={width || 400}
      bodyStyle={bodyStyle}
      onCancel={onCancel}
      wrapClassName={wrapClassName}
      footer={null}
    >
      <div className="modal-header">
        <Button type="link" className="closeBtn" onClick={onCancel}>
          <MultiplyIcon width={14} height={14} />
        </Button>
      </div>
      <div className="modal-content">
        <div className="heading">
          <h2 className="title">Move to Wrap/Pay</h2>
          <p className="desc">Choose how you want to Wrap/Pay this Gig</p>
        </div>
        <div className="radio-wrap">
          {methods.map((method, keyIdx) => (
            <label key={`${method.id}-${keyIdx}`}>
              <input type="radio" name="radio" id={method.id} value={method.value} checked={option === method.value} onClick={() => setOption(method.value)}/>
              <span>
                <div className="radio-content">
                    <h3 className="title">{method.title}</h3>
                    <p className="desc">{method.desc}</p>
                  </div>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="modal-footer">
        <div className="actions-btn">
          <Button className="cancelBtn" shape="round" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="continueBtn" shape="round" onClick={() => setCallback(option)}>
            Continue
          </Button>
        </div>
      </div>
    </ChooseWaysToWrapNPayModalContainer>
  );
};

export default ChooseWaysToWrapNPayModal;
