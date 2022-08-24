import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import ContractorJobItem from "../Job";
import Scrollbar from '@iso/components/utility/customScrollBar';
import { DropZone, Wrapper, NoJobsHelper } from "./JobList.style";

class InnerContractorJobList extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.jobs !== this.props.jobs) {
      return true;
    }

    return false;
  }

  render() {
    if (!this.props.jobs.length) {
      return <NoJobsHelper>No Gigs yet</NoJobsHelper>
    }

    return this.props.jobs.map((job, index) => (
      <Draggable key={job.id} draggableId={`${job.id}`} index={index}>
        {(dragProvided, dragSnapshot) => (
          <ContractorJobItem
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

const InnerList = ({ dropProvided, jobs, columnId, column }) => (
  <DropZone ref={dropProvided.innerRef}>
    <InnerContractorJobList jobs={jobs} columnId={columnId} column={column} />
    {dropProvided.placeholder}
  </DropZone>
);

const ContractorJobList = ({
  listId,
  listType,
  style,
  column,
  jobs,
  title,
  internalScroll,
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
                jobs={jobs}
                title={title}
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

ContractorJobList.defaultProps = {
};

export default ContractorJobList;
