import React from "react";
import { Container } from "./Job.style";
import ContractorJobCard from "./JobCard/JobCard";

class ContractorJobItem extends React.PureComponent {
  render() {
    const { job, column, isDragging, isGroupedOver, provided } = this.props;

    return (
      <Container
        isDragging={isDragging}
        isGroupedOver={isGroupedOver}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <ContractorJobCard column={column} job={job} onDelete={() => {}} />
      </Container>
    );
  }
}

export default ContractorJobItem;
