import React from "react";
import MultiplyIcon from '@iso/components/icons/Multiply';
import WrapAndPayMethodModalWrapper from "./WrapAndPayMethod.style";
import {Button, Form, Radio} from "antd";

const WrapAndPayMethod = ({ handleWrapAndPayMethodModal }) => {
    const wrapAndPayMethods = [
        {
            id: 'pay_crew',
            title: 'Use Buddi to Pay your Talent',
            description: 'Pay independent businesses through W-9 and pay all contractors through the Buddi Wallet. You can take advantage of free invoicing and reports with this feature.',
        },
        {
            id: 'request_invoices',
            title: 'Request Invoices and Download Reports',
            description: 'If you don\'t want to pay your talent through the wallet but want them to invoice, send a request for invoice and then download all tax documents, invoices and reports in the documents section.',
        },
        {
            id: 'complete_job',
            title: 'Download Reports and Complete Gig',
            description: 'Skip the payments and invoicing features and simply download a report that you can hand off to your accounting team to make wrapping your gig faster and easier!'
        },
    ];

    const onCancel = () => {
        handleWrapAndPayMethodModal('close');
    };
    
    const submitForm = () => {
        handleWrapAndPayMethodModal('success');
    }

    return (
        <WrapAndPayMethodModalWrapper
            visible={true}
            width={562}
            title={null}
            closeIcon={<MultiplyIcon width={14} height={14} />}
            onCancel={onCancel}
            footer={null}
        >
            <div className="inner-content">
                <div className="title-block">
                    <p className={'title'}>Move to Wrap/Pay</p>
                    <p className={'sub-title'}>Choose how you want to Wrap/Pay this Gig</p>
                </div>
                <div className="wrap-and-pay-methods">
                    <Form name={'wrapAndPayMethodSelect'} layout={'vertical'} onFinish={submitForm}>
                        <Form.Item name={'wrapAndPayMethod'} initialValue={wrapAndPayMethods[0].id}>
                            <Radio.Group>
                                {
                                    wrapAndPayMethods.map((method) => {
                                        return (
                                            <Radio value={method.id} key={method.id} className='wrap-method-view'>
                                                <div className="wrap-method-inner-content">
                                                    <div className="wrap-method-title">{method.title}</div>
                                                    <div className="wrap-method-description">{method.description}</div>
                                                </div>
                                            </Radio>
                                        )
                                    })
                                }
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className={'footer-button-container'}>
                            <Button type={'default'} shape={'round'} size={'large'} onClick={onCancel} className={'cancel-btn'}>
                                Cancel
                            </Button>
                            <Button type={'primary'} shape={'round'} size={'large'} htmlType={'submit'} className={'continue-btn'}>
                                Continue
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </WrapAndPayMethodModalWrapper>
    )
}

export default WrapAndPayMethod