import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContractorJobList from '../Job/JobList/JobList';
import Title from '../Title/Title';
import PersonalAccountIntro from '@iso/containers/IntroToolTip';
import Popover from '@iso/components/uielements/popover';
import { TypeUser } from '@iso/containers/IntroToolTip/TooltipData';

import { Container, Header, MoreActionsWrapper } from './Column.style';

const Column = ({
  title,
  column,
  jobs,
  index,
  isScrollable,
  actions,
  currentStepIntro,
  typeUser,
}) => {
  return (
    <Draggable draggableId={title} index={index}>
      {(provided, snapshot) => (
        <Container
          color={column.color}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Header isDragging={snapshot.isDragging}>
            <Title
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
            >
              {title}
            </Title>
            {actions && <MoreActionsWrapper>{actions}</MoreActionsWrapper>}
          </Header>
          <Popover
            placement={'bottom'}
            content={<PersonalAccountIntro currentStep={currentStepIntro} />}
            visible={
              currentStepIntro >= 0 && index + 1 == currentStepIntro
                ? true
                : false
            }
          >
            <ContractorJobList
              listId={column.id}
              listType='JOB'
              column={column}
              jobs={jobs}
              internalScroll={isScrollable}
            />
          </Popover>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
