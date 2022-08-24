import React, { useState } from 'react';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import Button from '@iso/components/uielements/button';
import AutoComplete from '@iso/components/Autocomplete';
import { CrewSearchAutocompleteWrapper, VerticalLine } from './CrewSearchAutocomplete.style';
import { sections } from './data';
import { SearchOutlined, PlusCircleFilled } from '@ant-design/icons';

const grid = 8;
export default function () {
  const getListStyle = (isDraggingOver) => ({
    backgroundColor: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
  });

  const getItemStyle = (isHover, isDragging, draggableStyle) => ({
    userSelect: 'none',
    paddingTop: 8,
    paddingBottom: 8,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : '',
    ...draggableStyle,
  });

  const renderItem = (user, section, isHighlighted) => {
    return (
      <Draggable
        draggableId={`${section.id}_${user.id.toString()}`}
        index={user.id}
        key={`${section.id}_${user.id}`}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isHover,
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            className="sectionItem"
          >
            <div
              key={`user_${user.id}`}
              className={`ant-select-item ant-select-item-option userDropdownItemWithAvatar ${
                isHighlighted ? 'ant-select-item-option-active' : ''
              }`}
            >
              <VerticalLine color={section.color} />
              <div className="userAvatar">
                <img src={user.avatar} alt="User" />
              </div>
              <div className="userInfo">
                <div className="basicDetail">
                  <h4>{user.name}</h4>
                  <h6>{user.role}</h6>
                </div>
                <div className="addResult">
                  <Button type="link"><PlusCircleFilled style={{fontSize: 20, color: '#3b86ff'}}/></Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const filterUser = (section, value) => {
    return section.userItems.filter(
      (user) => user.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(source, destination);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <CrewSearchAutocompleteWrapper>

              <AutoComplete
                inputProps={{
                  className: 'ant-input',
                  placeholder: 'Producer',
                }}
                items={[]}
                wrapperStyle={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%',
                  zIndex: 3,
                }}
                renderItem={() => {}}
                renderInput={(props) => {
                  return (
                    <div className="inputSection">
                      <SearchOutlined />
                      <input {...props} />
                    </div>
                  );
                }}
                getItemValue={(user) => user.label}
                renderMenu={(items, value, style) => {
                  return (
                    <div className="searchSection">
                      {sections
                        .filter((s) => filterUser(s, value).length)
                        .map((section, i) => (
                          <div key={`search-crew-${i}`}>
                            <div
                              className="section"
                              key={`${section.id}_${section.title}`}
                            >
                              <div className="sectionTitle">
                                {section.title}
                              </div>
                              <div>
                                {filterUser(section, value).map((user) =>
                                  renderItem(user, section)
                                )}
                              </div>
                            </div>
                            {i <
                            sections.filter(
                              (s) => filterUser(s, value).length
                            ).length -
                            1 && <div className="sectionEnd" />}
                          </div>
                        ))}
                      {sections.filter((s) => filterUser(s, value).length)
                        .length === 0 && <div>No Records</div>}
                    </div>
                  );
                }}
                onChange={(value) => {

                }}
                onSelect={(user) => {

                }}
              />
            </CrewSearchAutocompleteWrapper>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
