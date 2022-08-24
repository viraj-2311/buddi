import React from "react";
import { Container } from "./Job.style";
import JobCard from "./JobCard/JobCard";

class JobItem extends React.PureComponent {
  render() {
    const { job, column, isDragging, isGroupedOver, provided, onEdit, onDelete } = this.props;

    return (
      <Container
        isDragging={isDragging}
        isGroupedOver={isGroupedOver}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <JobCard column={column} job={job} onEdit={onEdit} onDelete={onDelete} />
      </Container>
    );
  }
}

export default JobItem;
