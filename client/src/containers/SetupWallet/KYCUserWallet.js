import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { showServerError } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';
import { useSelector, useDispatch } from 'react-redux';
import KYCWalletStyleWrapper from './KYCUserWallet.style';
import Logo from '@iso/assets/images/benji-wallet.png';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import Button from '@iso/components/uielements/button';
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import { uploadKYCDocument } from '@iso/redux/user/actions';
import IconInfo from '@iso/components/icons/IconInfo';
import {
  KYCStatusFailed,
  WalletStatus,
  addressDocumentGuide,
  documentsAddressList,
  documentsDOBList,
  documentsSSNList,
  documentsNameList,
  documentsGeneralList,
  nameDocumentGuide,
  SSNDocumentGuide,
  generalDocumentGuide,
  documentsAddressRequire,
  documentsDOBRequire,
  documentsNameRequire,
  documentsSSNRequire,
  documentsGeneralRequire,
} from '@iso/enums/wallet_status';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Documents from './Documents/index';
import { getDocumentTypeUser } from '@iso/redux/user/actions';
const { rowStyle, gutter } = basicStyle;
const Option = SelectOption;

const KYCUserWallet = forwardRef(
  ({ onClose, statusWallet, usernameWallet }, ref) => {
    let history = useHistory();
    const dispatch = useDispatch();
    const { kycUpload, documentType } = useSelector((state) => state.User);
    const [categories, setCategories] = useState([]);
    const [documentsRequire, setDocumentsRequire] = useState([]);
    const [documentsGuide, setDocumentsGuide] = useState([]);
    const [category, setCategoryType] = useState({});
    const [documentCategories, setDocumentCategories] = useState([]);
    const [currentDocumentType, setCurrentDocumentType] = useState({});
    const [kycDocumentList, setKycDocumentList] = useState([]);
    const [pageDetail, setPageDetail] = useState({});
    const [action, setAction] = useState('');
    useEffect(() => {
      if (!documentType.data) {
        dispatch(getDocumentTypeUser());
      }
    }, []);

    useEffect(() => {
      if (documentType && documentType.data) {
        let data = documentType.data.data;
        setDocumentCategories(data);
        setCurrentDocumentType(data[0]);
      }
    }, [documentType]);

    useEffect(() => {
      switch (statusWallet) {
        case KYCStatusFailed.AddressFailed:
          setPageDetail({
            title: 'ID Verification - Individual Address Verification Failed',
            subTitle: 'Address Verification',
            instruction: `Please upload one document with the users complete current residential address from the following list.`,
            explainDoc: 'The front and back of a current photo ID, such as a:',
            warning:
              "Please note: we're not able to accept temporary IDs, and P.O. Boxes.",
          });
          setDocumentsGuide(addressDocumentGuide);
          setCategories(documentsAddressList);
          setCategoryType(documentsAddressList[0]);
          setDocumentsRequire(documentsAddressRequire);
          break;
        case KYCStatusFailed.DOBFailed:
          setPageDetail({
            title: 'ID Verification - Date of Birth',
            subTitle: 'Date of Birth Verification',
            instruction:
              'If you type in or select the wrong birth date while on-boarding you will fail our ID Verification check and thus need to provide verification of your date of birth. The following is a list of documents we can accept to verify your date of birth.',
            explainDoc: 'A clear photo of one of the following documents:',
            warning: null,
          });
          setDocumentsGuide([]);
          setCategories(documentsDOBList);
          setCategoryType(documentsDOBList[0]);
          setDocumentsRequire(documentsDOBRequire);
          break;
        case KYCStatusFailed.NameFailed:
          setPageDetail({
            title: 'ID Verification - Name Verification',
            subTitle: 'Name Verification or Update',
            instruction: `You can fail ID Verification because of your name. If you legally changed your name, we'll need to update the name in our databases as well. The following is a list of documents we can accept to verify or update your user's name.`,
            explainDoc: 'A clear photo of one of the following documents:',
            warning: "Please note: we're not able to accept temporary IDs",
          });
          setDocumentsGuide(nameDocumentGuide);
          setCategories(documentsNameList);
          setCategoryType({});
          setDocumentsRequire(documentsNameRequire);
          break;
        case KYCStatusFailed.SSNFailed:
          setPageDetail({
            title: 'ID Verification - SSN Verification Failed',
            subTitle: 'SSN Verification',
            instruction: `If you type in the wrong SSN while on-boarding you will fail our ID Verification check and thus 
          need to provide verification of your SSN. The following is a list of documents we can accept to 
          verify or update your SSN.`,
            explainDoc: 'A clear photo of one of the following documents:',
            warning: null,
          });
          setDocumentsGuide(SSNDocumentGuide);
          setCategories(documentsSSNList);
          setCategoryType(documentsSSNList[0]);
          setDocumentsRequire(documentsSSNRequire);
          break;
        case KYCStatusFailed.GeneralFailed:
          setPageDetail({
            title: 'ID Verification - General Identity Verification',
            subTitle: 'General Identity Verification',
            instruction: `You have to upload 2 documents. You must send in a photo selfie holding your ID document, as 
          well as a clear and readable photo of your ID document.`,
            explainDoc: `Request one document from the list below.\nThe front and back of a current photo ID, such as a:`,
            warning: `Please note: we're not able to accept temporary IDs`,
          });
          setDocumentsGuide(generalDocumentGuide);
          setCategories(documentsGeneralList);
          setCategoryType(documentsGeneralList[0]);
          setDocumentsRequire(documentsGeneralRequire);
          break;
        default:
          break;
      }
    }, []);

    useEffect(() => {
      if (
        !kycUpload.loading &&
        !kycUpload.error &&
        action === 'upload_kyc_document'
      ) {
        onClose();
        notify(
          'success',
          kycUpload.success || 'KYC document uploaded successfully!'
        );
      }
      if (kycUpload.error && action === 'upload_kyc_document') {
        notify(
          'error',
          showServerError('KYC document uploaded unsuccessfully!')
        );
      }

      if (!kycUpload.loading && action === 'upload_kyc_document') {
        setAction('');
      }
    }, [kycUpload]);

    const submitKYC = () => {
      if (
        kycDocumentList[0] &&
        kycDocumentList[0].file &&
        currentDocumentType.name
      ) {
        const formData = new FormData();
        formData.append('files', kycDocumentList[0].file);
        formData.append('identity_type', currentDocumentType.name);
        setAction('upload_kyc_document');
        dispatch(uploadKYCDocument(formData));
      }
    };

    const setDocumentValue = (value, index) => {
      let currentIndex = parseInt(index.key);
      let document = documentCategories[currentIndex];
      setCurrentDocumentType(document);
    };

    const handleDocumentUpdate = (documentList) => {
      setKycDocumentList(documentList);
    };

    return (
      <KYCWalletStyleWrapper>
        <div className='kyc-wallet-container'>
          <div className='setup-wallet-container__header'>
            <img src={Logo} height='56px' />
          </div>
          <div className='top-container'>
            <div className='kyc-wallet failed-container'>
              <div>
                <p className='verification-title'>{pageDetail.title}</p>
                <span className='description'>
                  We must verify that all users of the Buddi platform are who
                  they say they are, present a low fraud risk, and are not on
                  any watchlists. We do this by submitting end-user information
                  for review by our identity verification partner. The user will
                  not be able to transact until the user is verified.
                </span>
              </div>
              <div>
                <p className='verification-status'>ID Verification Status</p>
                <div className='failed-status border-failed'>
                  <p className='username'>{usernameWallet}</p>
                  <span className='failed'>Failed</span>
                </div>
              </div>
            </div>
            <div className='bottom-container'>
              <div className='verfiy-desc'>
                <p className='verification-title'>{pageDetail.subTitle}</p>
                <span className='description-address'>
                  {pageDetail.instruction}
                </span>
                <span className='description-address'>
                  {pageDetail.explainDoc}
                </span>
                <ul className=''>
                  {categories.map((item) => (
                    <li className='documents-guide' key={item.name}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
              {pageDetail.warning && (
                <div className='document-require failed-container'>
                  <div className='info-desc'>
                    <IconInfo width={18} height={18} fill='#e25656' />
                    <span>{pageDetail.warning}</span>
                  </div>
                </div>
              )}

              {documentsGuide && documentsGuide.length > 0 && (
                <div className='verfiy-desc'>
                  <span className='description-address'>
                    Or any of the following documents, as long as they're
                    current:
                  </span>
                  <ul className=''>
                    {documentsGuide.map((item) => (
                      <li key={item} className='documents-guide'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentDocumentType.label && (
                <div className='verfiy-desc'>
                  <span className='list-file-upload'>
                    Select what file you need to upload from the list
                  </span>
                  <Select
                    style={{ width: '100%' }}
                    name='categoryType'
                    value={currentDocumentType.label}
                    onChange={(value, index) => setDocumentValue(value, index)}
                  >
                    {documentCategories.map((item, index) => (
                      <Option value={item.label} key={index}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
              <div className='upload-document'>
                <Documents
                  acceptedTypes={'image/jpeg, image/png, application/pdf'}
                  loading={action === 'upload_kyc_document'}
                  documentUpdate={handleDocumentUpdate}
                />
              </div>
              <Row gutter={gutter} justify='center'>
                <Button
                  htmlType='submit'
                  type='primary'
                  shape='round'
                  className='buttonWrap'
                  onClick={submitKYC}
                  loading={action === 'upload_kyc_document'}
                >
                  Submit
                </Button>
              </Row>
              <div className='document-require failed-container'>
                <div className='info-desc'>
                  <IconInfo width={18} height={18} fill='#e25656' />
                  <span>Document Requirements:</span>
                </div>
                <ol className=''>
                  {documentsRequire.map((item) => (
                    <li key={item} className='documents-guide'>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </KYCWalletStyleWrapper>
    );
  }
);

export default KYCUserWallet;
