import React, { useState, useMemo, forwardRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CrewItemWrapper, { AcceptanceLevelDiv } from './CrewItem.style';
import Button from '@iso/components/uielements/button';
import { CloseOutlined, PlusCircleFilled } from '@ant-design/icons';
import Popover from '@iso/components/uielements/popover';
import useOnClickOutside from '@iso/lib/hooks/useOnClickOutside';
import AutoComplete from '@iso/components/shared/Autocomplete';
import MemoTypes from '@iso/enums/memo_types';
import { formatAmount } from '@iso/lib/helpers/numberUtil';
import JobStatus from '@iso/enums/job_status';
import CurrencyText from '@iso/components/utility/currencyText';
import Icon from '@iso/components/icons/Icon';
import ChatIcon from '@iso/assets/images/chat.svg';
import EmptyAvatar from '@iso/assets/images/empty_avatar.jpg';
import AcceptedIcon from '@iso/assets/images/benji-glass.png';
import DraggableIcon from '@iso/assets/images/draggable.svg';
import MemoCrewTypes from '@iso/enums/memo_crew_types';
import HoldLevel from '@iso/enums/hold_level';
import { truncateWithEllipses } from '@iso/lib/helpers/utility';

import {
  setContractor,
  showDealMemo,
  showHoldMemo,
  createVirtualMemoRequest,
  updateVirtualMemoRequest,
  deleteVirtualMemoRequest,
  deleteBookMemoRequest,
  setCrewActivePosition,
} from '@iso/redux/producerJob/actions';
import ConfirmModal from '@iso/components/Modals/Confirm';
import _ from 'lodash';
import { showArchivedMemo } from '../../../../../redux/producerJob/actions';

const CrewItem = (
  {
    crew,
    jobRole,
    choiceLevel,
    className,
    isEditable,
    noRoleUsers,
    onDelete,
    onReadOnly,
    readOnly,
    ...rest
  },
  ref
) => {
  const dispatch = useDispatch();
  const crewItemRef = useRef();

  const { job } = useSelector((state) => state.ProducerJob);

  const [showUserSelect, setShowUserSelect] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [currentACUser, setCurrentACUser] = useState('');
  const [confirmCancel, setConfirmCancel] = useState({ visible: false });
  const [action, setAction] = useState('');

  useEffect(() => {
    if (crew && !crew.isMemo) {
      if (crew.benjiAccount) {
        setSelectedPerson({
          ...crew.benjiAccount,
          companyRelationship: crew.companyRelationship,
        });
      } else {
        setSelectedPerson({
          fullName: crew.fullName,
          companyRelationship: crew.companyRelationship,
        });
      }
    } else {
      setSelectedPerson(null);
    }
  }, [crew]);

  const isUnAnswered = useMemo(() => {
    if (!crew) return false;
    return job.status === JobStatus.ACTIVE && crew.memoType === MemoTypes.HOLD;
  }, [job, crew]);

  const crewPositionKey = useMemo(() => {
    const { id, jobRoleGroup } = jobRole;
    return `department-${jobRoleGroup}-role-${id}`;
  }, [jobRole]);

  const onCancelClick = (bookMemoId, jobId) => {
    setConfirmCancel({
      visible: true,
      title: 'Are you sure?',
      description:
        'Do you really want to Cancel the job? This action cannot be undone.',
      onYes: () => {
        handleCancel(bookMemoId, jobId);
      },
      onNo: onCancelAction,
    });
  };

  const onCancelAction = () => {
    setConfirmCancel({ visible: false });
  };

  const handleCancel = (bookMemoId, jobId) => {
    setAction('cancel');
    dispatch(deleteBookMemoRequest({ bookMemoId, id: jobId }));
    setConfirmCancel({ visible: false });
  };

  const handleVirtualMemo = (user) => {
    if (!crew) {
      if (!user) return;
      const payload = {
        fullName: user.fullName,
        benjiAccount: user.friendId,
        jobRole: jobRole.id,
        choiceLevel: choiceLevel,
      };
      dispatch(createVirtualMemoRequest(job.id, payload));
    } else if (crew && !crew.isMemo) {
      if (user) {
        const payload = {
          fullName: user.fullName || '',
          benjiAccount: user.friendId || null,
        };
        dispatch(updateVirtualMemoRequest(crew.id, payload));
      } else {
        dispatch(deleteVirtualMemoRequest(crew.id));
      }
    }
  };

  const handleUserSelect = (person) => {
    setSelectedPerson(person);
    setShowUserSelect(false);
    handleVirtualMemo(person);
  };

  const handleStopEdit = () => {
    if (selectedPerson) {
      handleVirtualMemo({
        fullName: selectedPerson.fullName,
      });
    } else {
      handleVirtualMemo(null);
    }

    setShowUserSelect(false);
  };

  const handleStartEdit = () => {
    if (showUserSelect) return;

    if (selectedPerson) {
      setCurrentACUser(selectedPerson.fullName);
    } else {
      setCurrentACUser('');
    }
    setShowUserSelect(true);
    dispatch(setCrewActivePosition(crewPositionKey));
  };

  const editMemo = () => {
    dispatch(
      setContractor({
        ...crew,
        memoId: crew.id,
        jobRole,
        choiceLevel,
        booked: false
      })
    );

    if(job.isArchived){
      dispatch(showArchivedMemo());
    } else if (job.status === JobStatus.ACTIVE) {
      dispatch(showDealMemo());
    } else {
      dispatch(showHoldMemo());
    }
  };

  const viewMemo = () => {
    dispatch(
      setContractor({
        ...crew,
        memoId: crew.id,
        jobRole,
        choiceLevel,
      })
    );

    if(job.isArchived){
      dispatch(showArchivedMemo());
    }else if (job.status === JobStatus.ACTIVE) {
      dispatch(showDealMemo());
    } else {
      dispatch(showHoldMemo());
    }
  };

  const onRemoveCrew = () => {
    if (onDelete) onDelete(crew);
  };

  const handleNewUser = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      handleStopEdit();
    }

    const inputUser = e.target.value.trim();
    if (!inputUser) {
      setSelectedPerson(null);
      return;
    }

    const matchUsers = _.filter(noRoleUsers, (user) => {
      const userFullName = user.fullName && user.fullName.trim();
      return (
        userFullName &&
        userFullName.toLowerCase().indexOf(inputUser.toLowerCase()) >= 0
      );
    });

    if (matchUsers.length > 0) return;
    setSelectedPerson({
      fullName: inputUser,
      companyRelationship: 'NO RELATION',
    });
  };

  useOnClickOutside(crewItemRef, handleStopEdit);

  const createMemo = (e) => {
    e.stopPropagation();

    dispatch(
      setContractor({
        ...selectedPerson,
        memoId: 'new',
        jobRole,
        choiceLevel,
      })
    );

    if (job.status === JobStatus.ACTIVE) {
      dispatch(showDealMemo());
    } else {
      dispatch(showHoldMemo());
    }
  };

  const shouldItemRender = (item, value) => {
    return (
      item.fullName &&
      item.fullName.toLowerCase().indexOf(value && value.toLowerCase()) > -1
    );
  };

  const renderItemInAutocomplete = (item, isHighlighted) => (
    <div
      key={`user_select_${item.id}`}
      className={`ant-select-item ant-select-item-option userDropdownItemWithAvatar ${
        isHighlighted ? 'ant-select-item-option-active' : ''
      }`}
    >
      <div className='userAvatar'>
        <img src={item.profilePhoto || EmptyAvatar} alt='User' />
      </div>
      <div className='userInfo'>
        <h4>{item.fullName}</h4>
        {/* <div className='userStatus'>
          {item.isActive ? null : (
            <span className='ant-typography ant-typography-danger'>
              (Not Activated)
            </span>
          )}
        </div> */}
      </div>
    </div>
  );

  const renderCrewName = (crew) => {
    if (isUnAnswered) {
      return (
        <div className='crewNameWrapper unanswered'>
          {
            !readOnly && <CloseOutlined
            onClick={onRemoveCrew}
            style={{ marginRight: '5px' }}
          />
          }
          <span>{truncateWithEllipses(crew.contractorName)}</span>
        </div>
      );
    }

    if (crew.decline) {
      return (
        <div className='crewNameWrapper declined'>
          {!readOnly && <CloseOutlined
            onClick={onRemoveCrew}
            style={{ marginRight: '5px' }}
          />}
          <span>{truncateWithEllipses(crew.contractorName)}</span>
          {crew.optionalMessage && (
            <Popover title='Notes' content={crew.optionalMessage}>
              <span className='acceptMessage'>
                <Icon image={ChatIcon} height={15} />
              </span>
            </Popover>
          )}
        </div>
      );
    }
    if (crew.canceled) {
      return (
        <div className='crewNameWrapper declined'>
           {!readOnly && <CloseOutlined
            onClick={() => {
              onCancelClick(crew.id, job.id);
            }}
            style={{ marginRight: '5px' }}
          />}
          <span>{truncateWithEllipses(crew.contractorName)}</span>
        </div>
      );
    }

    if (crew.acceptanceLevel) {
      return (
        <div className='crewNameWrapper'>
          {crew?.memoType && crew?.memoType !== MemoTypes.DEAL && (
          <AcceptanceLevelDiv
            className={`acceptLevel`}
            color={HoldLevel[crew.acceptanceLevel]}
          >
            {crew.acceptanceLevel}H
          </AcceptanceLevelDiv>
          )}

<span>{truncateWithEllipses(crew.contractorName)}</span>
          {crew.optionalMessage && (
            <Popover title='Notes' content={crew.optionalMessage}>
              <span className='acceptMessage'>
                <Icon image={ChatIcon} height={15} />
              </span>
            </Popover>
          )}
        </div>
      );
    }

    return <span>{truncateWithEllipses(crew.contractorName)}</span>;
  };

  const calcCrewPrice = (crew) => {
    return formatAmount(crew.totalPrice);
  };

  const renderCrewStatus = (crew) => {
    if (crew.canceled) {
      return <span className='memoActionLink declinedDeal'>Canceled</span>;
    }
    if (job.status === JobStatus.ACTIVE) {
      if (crew.memoType === MemoTypes.HOLD) {
        return (
          <span className='memoActionLink unanswered' onClick={viewMemo}>
            Unanswered Hold Memo
          </span>
        );
      } else {
        if (crew.accepted) {
          if (crew.memoStaff === MemoCrewTypes.EMPLOYEE) {
            return (
              <span className='memoActionLink' onClick={viewMemo}>
                Band Staff
              </span>
            );
          } else {
            return (
              <span className='memoActionLink' onClick={viewMemo}>
                {/* <Icon src={AcceptedIcon} width={15} height={29} /> */}
                <CurrencyText
                  value={calcCrewPrice(crew)}
                  className='crewPrice'
                />
              </span>
            );
          }
        } else if (crew.decline) {
          return <span className='memoActionLink declinedDeal' onClick={editMemo}>Declined</span>;
        } else if (crew.booked) {
          return (
            <span className='memoActionLink sentDeal' onClick={editMemo}>
              Memo Sent
            </span>
          );
        } else {
          return (
            <span className='memoActionLink savedDeal' onClick={editMemo}>
              Memo Saved
            </span>
          );
        }
      }
    } else {
      if (crew.memoType === MemoTypes.HOLD) {
        if (crew.accepted) {
          if (crew.memoStaff === MemoCrewTypes.EMPLOYEE) {
            return (
              <span className='memoActionLink' onClick={viewMemo}>
                Band Staff
              </span>
            );
          } else {
            return (
              <span className='memoActionLink' onClick={viewMemo}>
                <CurrencyText
                  value={calcCrewPrice(crew)}
                  className='crewPrice'
                />
              </span>
            );
          }
        } else if (crew.decline) {
          return <span className='memoActionLink declinedHold' onClick={editMemo}>Declined</span>;
        } else {
          return (
            <span className='memoActionLink sentHold' onClick={editMemo}>
              Memo Sent
            </span>
          );
        }
      }
      return (
        <span className='memoActionLink createHold' onClick={viewMemo}>
          View
        </span>);
      }
  };

  return (
    <CrewItemWrapper ref={ref} {...rest} className='ant-list-item crewItem'>
      {crew && (
        <Icon
          image={DraggableIcon}
          width={10}
          height={16}
          className='draggableIndicator'
        />
      )}
      {crew && crew.isMemo && (
          <div
            className={`memoZone ${
              crew.decline || crew.canceled ? 'declined' : ''
            }`}
          >
          <div className='crewInfo'>{renderCrewName(crew)}</div>
          <div className='crewStatus'>{renderCrewStatus(crew)}</div>
        </div>
      )}

        {readOnly && (crew === null || !crew.isMemo)?
        <div className='memoZone' onClick={onReadOnly}>
          {
            crew ?
            <>
              <span>{crew.fullName}</span>
                <a
                    className={`memoActionLink ${
                      job.status === JobStatus.ACTIVE ? 'createDeal' : 'createHold'
                    }`}
                    onClick={onReadOnly}
                  >
                    Create Memo
                </a>
            </>:
          <span className='placeholder'></span>
            }
        </div>
      :(crew === null || !crew.isMemo) && (
        <div
          onClick={handleStartEdit}
          className={`clickAwayArea ${!isEditable ? 'no-pointer-events' : ''}`}
        >
          {showUserSelect ? (
            <div
              className='editorWrapper'
              style={{ flex: 'auto' }}
              ref={crewItemRef}
            >
              <AutoComplete
                inputProps={{
                  className: 'ant-input',
                  onKeyUp: handleNewUser,
                  onFocus: (e) => e.preventDefault(),
                  autoFocus: true,
                }}
                shouldItemRender={shouldItemRender}
                items={noRoleUsers}
                wrapperStyle={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%',
                  zIndex: 2,
                }}
                renderItem={renderItemInAutocomplete}
                getItemValue={(item) => item.fullName}
                renderMenu={(children) => (
                  <div className='isoAutocompleteDropdown'>{children}</div>
                )}
                value={currentACUser}
                onSelect={handleUserSelect}
              />
              <Button
                type='link'
                className='addCrewBtn'
                onClick={handleStopEdit}
              >
                <PlusCircleFilled
                  style={{
                    fontSize: 20,
                    color:
                      job.status === JobStatus.ACTIVE ? '#51369a' : '#ffc06a',
                  }}
                />
              </Button>
            </div>
          ) : selectedPerson ? (
            <div className='memoZone'>
              <span className='memoZone__contractor-name'>{selectedPerson.fullName}</span>
              <a
                className={`memoActionLink ${
                  job.status === JobStatus.ACTIVE ? 'createDeal' : 'createHold'
                }`}
                onClick={createMemo}
              >
                Create Memo
              </a>
            </div>
          ) : isEditable ? (
            <div className='memoZone' onClick={handleStartEdit}>
              <span className='placeholder'>Add</span>
            </div>
          ) : (
            <div className='memoZone'>
              <span className='placeholder'>...</span>
            </div>
          )}
        </div>
      )}
      <ConfirmModal
        visible={confirmCancel.visible}
        width={390}
        title={confirmCancel.title}
        description={confirmCancel.description}
        onYes={confirmCancel.onYes}
        onNo={confirmCancel.onNo}
        confirmLoading={action === 'cancel'}
      />
    </CrewItemWrapper>
  );
};

CrewItem.defaultProps = {
  isEditable: true,
};

export default forwardRef(CrewItem);
