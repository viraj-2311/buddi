import React, { useState, useRef, useEffect } from "react";
import Button from "@iso/components/uielements/button";
import { CloseAccountContainer } from "./CloseAccount.style";
import { Card } from "antd";
import { useHistory } from "react-router";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserWalletBalRequest, fetchUserWalletBalReset } from "@iso/redux/user/actions";
import { signout } from '@iso/redux/auth/actions';

import Input, { Textarea } from "@iso/components/uielements/input";

import LastStepConfirmationModal from "./Components/LastStepConfirmationModal";
import MoneyOnWalletModal from "./Components/MoneyOnWalletModal";

const CloseAccount = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    requestingUserWalletBal,
  } = useSelector((state) => state.User);

  const { user: authUser } = useSelector((state) => state.Auth);
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { company: companyDetail } = useSelector((state) => state.Company);

  const [isOpenMOWModal, setMOWModal] = useState(false);
  const [isOpenLSCModal, setLSCModal] = useState(false);
  const formikRef = useRef();
  const [data, setData] = useState({
    option: 1,
    otherReason: "",
  });

  const methods = [
    {
      id: "have-duplicate-account",
      title: "I have a duplicate account",
      value: 1,
    },
    {
      id: "getting-too-emails",
      title: "I’m getting too many emails",
      value: 2,
    },
    {
      id: "not-getting-any-value",
      title: "I’m not getting any value from my membership",
      value: 3,
    },
    {
      id: "privacy-concern",
      title: "I have a privacy concern",
      value: 4,
    },
    {
      id: "unwanted-contact",
      title: "I’m receiving unwanted contact",
      value: 5,
    },
    {
      id: "other-concern",
      title: "Other",
      value: 6,
    },
  ];

  const handleSubmit = async (data) => {
    if(data && Object.keys(data).length > 0){
      setData(data);
      dispatch(fetchUserWalletBalRequest());
    }
  };

  useEffect(() => {
    // reset initial or destroy
    return () => {
      dispatch(fetchUserWalletBalReset());
    };
  },[])

  useEffect(() => {
    if(requestingUserWalletBal?.status && requestingUserWalletBal?.status !== "ok"){
      setMOWModal(true);
    } else if(requestingUserWalletBal?.status && requestingUserWalletBal?.status === "ok") {
      setLSCModal(true)
    }
  }, [requestingUserWalletBal]);

  let loggedUser = `${authUser?.fullName || `${authUser?.firstName && authUser?.lastName && `${authUser?.firstName} ${authUser?.lastName}`}`}`;
  
  return (
    <CloseAccountContainer>
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={data}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, setFieldValue }) => (
          <Form>
            <Card className="document-card">
              <h2 className="sectionHead">
                {loggedUser}, we're sorry to see you go
              </h2>
              <p className="inner-title-text">
                Are you sure you want to close your account? You’ll lose your
                networks, profile, gigs, and wallet.
              </p>
              <div className="radio-list-outer">
                <h5>Tell us why you’re closing your account:</h5>
                {methods.map((method, keyIdx) => (
                  <label key={`${method.id}-${keyIdx}`}>
                    <Input
                      value={method.value}
                      type="radio"
                      onClick={() => setFieldValue("option", method.value)}
                      name="closeYourAccount"
                      checked={values?.option === method.value}
                      id={method.id}
                    />
                    <span>
                      <div className="radio-content">
                        <h3 className="title">{method.title}</h3>
                      </div>
                    </span>
                  </label>
                ))}
                <Textarea
                  className="note-input-box"
                  rows={5}
                  value={values?.otherReason}
                  onChange={(e) => setFieldValue("otherReason", e.target.value)}
                  name={"otherReason"}
                  disabled={values?.option === 6 ? false : true}
                />
                {values?.option === 6 && values?.otherReason === "" && (
                  <div className="helper-text lowercase">* Required</div>
                )}
                <Button
                  shape="round"
                  type="primary"
                  loading={requestingUserWalletBal?.loading}
                  htmlType="submit"
                  className="next-btn"
                  disabled={values?.option === 6 && values?.otherReason === ""}
                >
                  Next
                </Button>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
      {!!isOpenMOWModal && (
        <MoneyOnWalletModal
          visible={isOpenMOWModal}
          onCancel={() => setMOWModal(false)}
          onSuccess={() => {
            setMOWModal(false);
            history.push(`/wallet`);
          }}
        />
      )}
      {!!isOpenLSCModal && (
        <LastStepConfirmationModal
          visible={isOpenLSCModal}
          isFor="personal"
          header="Last step before closing your account..."
          subHeader="Closing your account means you lose your profile and all your Buddi data."
          params={data}
          data={{
            usename: loggedUser,
            nickname: authUser?.nickname,
            position: authUser?.jobTitle,
            profile: authUser?.originProfilePhotoS3Url || authUser?.profilePhotoS3Url
          }}
          onCancel={() => {
            setLSCModal(false);
            setMOWModal(false);
            history.push("/settings");
            dispatch(fetchUserWalletBalReset());
          }}
          onCancelBtnText="Back to Settings"
          onSuccess={() => {
            setLSCModal(false);
            if (!companyId || (companyId &&
              companyDetail)) {
              dispatch(signout());
              history.push("/close-account");
            }
          }}
          onSuccessBtnText="Close Account"
        />
      )}
    </CloseAccountContainer>
  );
};

export default CloseAccount;
