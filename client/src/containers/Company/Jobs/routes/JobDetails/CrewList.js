import React, {
  useEffect,
  useMemo,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { deleteJobMemoRequest } from '@iso/redux/producerJob/actions';
import CrewItem from './CrewItem';
import ConfirmModal from '@iso/components/Modals/Confirm';
import _ from 'lodash';

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '12px 24px',
  margin: '0',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const CrewList = (
  { crews, jobRoles, choiceLevel, choiceNumber, onReadOnly,readOnly,...rest },
  ref
) => {
  const dispatch = useDispatch();
  // const { crewUsers } = useSelector((state) => state.ProducerJob);
  const { loading: deleteMemoLoading, error: deleteMemoError } = useSelector(
    (state) => state.ProducerJob.memoDelete
  );
  const { users: corporateNetworkUsers } = useSelector(
    (state) => state.CompanyNetwork
  );
  const { users: personalNetworkUsers } = useSelector(
    (state) => state.PersonalNetwork
  );
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = useState(false);

  const crewUsers = useMemo(() => {
    const userList = _.cloneDeep([
      ...corporateNetworkUsers,
      ...personalNetworkUsers,
    ]);
    return userList.map((user) => {
      user.fullName = user.name;
      return user;
    });
  }, [corporateNetworkUsers, personalNetworkUsers]);

  useEffect(() => {
    if (!deleteMemoLoading && visibleDeleteConfirm) {
      setVisibleDeleteConfirm(false);
    }
  }, [deleteMemoError, deleteMemoLoading]);

  const onCrewDelete = (crew) => {
    setSelectedCrew(crew);
    setVisibleDeleteConfirm(true);
  };

  const handleCrewDelete = () => {
    dispatch(deleteJobMemoRequest(selectedCrew.id));
  };

  return (
    <div ref={ref} {...rest} className='ant-list ant-list-split crewListItems'>
      <ConfirmModal
        key='delete-crew-confirm'
        visible={visibleDeleteConfirm}
        description='Do you really want to delete the crew? This action cannot be undone.'
        confirmLoading={deleteMemoLoading}
        onYes={handleCrewDelete}
        onNo={() => setVisibleDeleteConfirm(false)}
      />
      <div className='ant-list-items'>
        {/* {console.log(crews, crewUsers)} */}

        {crews.map((crew, index) => {
          return (
            <Draggable
              key={`${jobRoles[index].id}-${choiceNumber}`}
              draggableId={`${jobRoles[index].id}-${choiceNumber}`}
              index={index}
            >
              {(provided, snapshot) => (
                <CrewItem
                  key={`crew_item_${index}`}
                  crew={crew}
                  jobRole={jobRoles[index]}
                  choiceLevel={choiceLevel}
                  isEditable={!readOnly}
                  readOnly={readOnly}
                  onReadOnly={onReadOnly}
                  noRoleUsers={crew === null || !crew.isMemo ? crewUsers : null}
                  onDelete={onCrewDelete}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                />
              )}
            </Draggable>
          );
        })}
      </div>
    </div>
  );
};

export default forwardRef(CrewList);
