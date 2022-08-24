import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Menu } from 'antd';
import cn from 'classnames';
import Checkbox from '@iso/components/uielements/checkbox';
import BookCrewList from './CrewList';
import _ from 'lodash';
import { BookCrewHeader, BookCrewJobDepartmentWrapper } from './BookCrew.style';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;

const BookCrewDepartmentList = ({
  department,
  crews,
  selectedCrews,
  onSelect,
  opened,
}) => {
  const [isOpened, setIsOpened] = useState(opened);
  const [crewList, setCrewList] = useState([]);
  const departmentKey = `book-crew-department-${department.replace(/\s/g, '')}`;

  useEffect(() => {
    setCrewList(crews);
  }, [crews]);

  const departmentCrews = useMemo(() => {
    return crewList.map((c) => c.id);
  }, [crewList]);

  const crewsByPositions = useMemo(() => {
    return crewList ? _.groupBy(crewList, (crew) => `${crew.position}_${crew.jobRole}`) : {};
  }, [crewList]);

  const handleMenuItemClick = (cbp, crewIndex) => {
    if (crewIndex === 0) {
      let copiedCrews = _.cloneDeep(crewList);
      copiedCrews = copiedCrews.map((c) => {
        const crew = _.cloneDeep(c);
        crew.shouldItemExpand =
          crew.position === cbp
            ? !crew.shouldItemExpand
            : crew.shouldItemExpand;
        return crew;
      });
      setCrewList(copiedCrews);
    }
  };

  const onAllSelect = (selected) => {
    let newCrews = [];
    if (selected) {
      newCrews = [...selectedCrews, ...departmentCrews];
    } else {
      newCrews = selectedCrews.filter((p) => !departmentCrews.includes(p));
    }
    onSelect(newCrews);
  };

  const onSingleSelect = (crew, selected) => {
    const newSelected = selected
      ? [...selectedCrews, crew.id]
      : _.cloneDeep(selectedCrews).filter((c) => c !== crew.id);
    onSelect(newSelected);
  };

  return (
    <BookCrewJobDepartmentWrapper>
      <Row className='bookInfoItem'>
        <span></span>
        <Col span={5} className='departmentList'>
          <Menu
            mode='inline'
            inlineIndent={0}
            selectable={false}
            defaultOpenKeys={opened ? [departmentKey] : []}
            onOpenChange={(openKeys) => {
              if (openKeys.length) {
                setIsOpened(true);
              } else {
                setIsOpened(false);
              }
            }}
          >
            <SubMenu
              key={departmentKey}
              title={
                <Checkbox
                  checked={departmentCrews.every((dc) =>
                    selectedCrews.includes(dc)
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAllSelect(e.target.checked);
                  }}
                >
                  {department}
                </Checkbox>
              }
              className='departmentRoleList'
            >
              {crewsByPositions &&
                Object.keys(crewsByPositions).map((cbp) => {
                  const crewList = crewsByPositions[cbp];
                  return crewList.map((_, crewIndex) => {
                    const shouldItemExpand =
                      crewList[crewIndex].shouldItemExpand;
                    return (
                      <Menu.Item
                        id={`book-crew-memo-${crewList[crewIndex].id}`}
                        key={`book-crew-memo-${crewList[crewIndex].id}`}
                        onClick={() => handleMenuItemClick(cbp, crewIndex)}
                        className={cn({
                          'hidden-item': crewIndex !== 0 && shouldItemExpand,
                          'hide-cursor': crewIndex !== 0,
                          bg: crewList.length > 1 && !shouldItemExpand,
                        })}
                      >
                        {crewIndex === 0 && (
                          <span
                            className={cn('roleTitle', {
                              'hide-caret': crewList.length === 1,
                            })}
                          >
                            {crewList[crewIndex].position}
                            {!shouldItemExpand ? (
                              <CaretUpOutlined />
                            ) : (
                              <CaretDownOutlined />
                            )}
                          </span>
                        )}
                      </Menu.Item>
                    );
                  });
                })}
            </SubMenu>
          </Menu>
        </Col>
        <Col span={19} className='roleChoice'>
          {isOpened && (
            <BookCrewHeader>
              <Row>
                <Col span={8}>Talent</Col>
                <Col span={6}>Date</Col>
                <Col span={4}>Set Length</Col>
                <Col span={3}>Total Rate</Col>
                <Col span={3} className='text-center status-col'>
                  Status
                </Col>
              </Row>
              <div className='crewList'>
                {crewList && crewList.length > 0 && (
                  <BookCrewList
                    selectedCrews={selectedCrews}
                    crewsByPositions={crewsByPositions}
                    onSingleSelect={onSingleSelect}
                  />
                )}
              </div>
            </BookCrewHeader>
          )}
        </Col>
      </Row>
    </BookCrewJobDepartmentWrapper>
  );
};

export default BookCrewDepartmentList;
