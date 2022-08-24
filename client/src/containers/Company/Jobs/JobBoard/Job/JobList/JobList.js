import React, {Component, useContext, useState} from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import JobItem from '../Job';
import Scrollbar from '@iso/components/utility/customScrollBar';
import { DropZone, Wrapper, CreateButton } from './JobList.style';
import PlusIcon from '@iso/components/icons/Plus';
import JobBoardContext from '../../JobBoardContext';

class InnerJobList extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.jobs !== this.props.jobs) {
      return true;
    }
    return false;
  }

  render() {
    return this.props.jobs.map((job, index) => (
      <Draggable key={job.id} draggableId={`job-${job.id}`} index={index}>
        {(dragProvided, dragSnapshot) => (
          <JobItem
            key={job.id}
            job={job}
            columnId={this.props.columnId}
            column={this.props.column}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
        )}
      </Draggable>
    ));
  }
}

const InnerList = ({ dropProvided, jobs, columnId, column }) => {
  const { onCreate } = useContext(JobBoardContext);

  return (
    <DropZone ref={dropProvided.innerRef}>
      <InnerJobList jobs={jobs} columnId={columnId} column={column} />
      {dropProvided.placeholder}
      <CreateButton color={column.color} onClick={() => onCreate(column.type)}>
        <PlusIcon width={16} height={14} fill={column.color} />
        <span>{column.addButtonText}</span>
      </CreateButton>
    </DropZone>
  );
};

const JobList = ({
  listId,
  listType,
  style,
  column,
  jobs,
  internalScroll,
  title,
  ...props
}) => {
  return (
    <Droppable
      droppableId={listId}
      type={listType}
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <Scrollbar autoHeight autoHeightMax="calc(100vh - 300px)">
              <InnerList
                title={title}
                jobs={jobs}
                columnId={column.id}
                column={column}
                dropProvided={dropProvided}
              />
            </Scrollbar>
          ) : (
            <InnerList
              title={title}
              jobs={jobs}
              columnId={column.id}
              column={column}
              dropProvided={dropProvided}
            />
          )}

        </Wrapper>
      )}
    </Droppable>
  );
};

JobList.defaultProps = {

};
export default JobList;
