import React from 'react';
import ManageSyncContactModal from './ManageSyncContact.style';
import Button from '@iso/components/uielements/button';
import MobileIcon from '@iso/components/icons/Mobile';
import GoogleIcon from '@iso/components/icons/Google';
import AppleIcon from '@iso/components/icons/Apple';
import { Col, Row } from 'antd';

export default ({ visible, handleCancel }) => {
  return (
    <ManageSyncContactModal
      title="Managed synced sources"
      visible={visible}
      width={758}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="content">
        <div className="title">
          <h3>Contacts</h3>
        </div>
        <div className="description">
          <p>
            Syncing your contact information helps you keep in touch with your
            most <br />
            important connections.
          </p>
        </div>
        <div className="sourceList">
          <Row className="sourceItem">
            <Col>
              <MobileIcon fill="#2f2e50" />
              <h4>Phone Contacts</h4>
            </Col>
            <Col>
              <Button shape="round" onClick={() => {}}>
                Sync
              </Button>
            </Col>
          </Row>
          <Row className="sourceItem">
            <Col>
              <GoogleIcon fill="#2f2e50" />
              <h4>Google</h4>
            </Col>
            <Col>
              <Button shape="round" onClick={() => {}}>
                Sync
              </Button>
            </Col>
          </Row>
          <Row className="sourceItem">
            <Col>
              <AppleIcon fill="#2f2e50" />
              <h4>Apple</h4>
            </Col>
            <Col>
              <Button shape="round" onClick={() => {}}>
                Sync
              </Button>
            </Col>
          </Row>
        </div>
        <div className="actions">
          <Button className="removeAllBtn" shape="round">
            Remove All
          </Button>
          <Button
            className="default cancelBtn"
            shape="round"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ManageSyncContactModal>
  );
};
