import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../JobDetails/CrewCheckbox";
import { Row, Col, Menu } from "antd";
import Input from "@iso/components/uielements/input";
import EditableText from "./EditableText";
import ClickAwayListener from "@iso/components/ClickAwayListener";
import CrewList from "./CrewList";
import Tooltip from "@iso/components/uielements/tooltip";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { JobDepartmentCrewWrapper } from "./JobCrew.style";
import { LoadingOutlined } from "@ant-design/icons";
import notification from "@iso/components/Notification";
import { showServerError } from "@iso/lib/helpers/utility";
import {
  updateJobRoleGroupTypeRequest,
  createJobRoleRequest,
  updateJobRoleTypeRequest,
  deleteJobRoleRequest,
  setCrewOpenDepartments,
  setCrewActivePosition,
} from "@iso/redux/producerJob/actions";
import _ from "lodash";

const { SubMenu } = Menu;
const JobCheckboxColor = {
  ACTIVE: "#51369a",
  PENDING: "#ffc06a",
};

const DepartmentList = ({
  jobGroup,
  departmentIndex,
  firstChoice,
  secondChoice,
  thirdChoice,
  onDepartmentHide,
  readOnly=false,
  onReadOnly=()=>{}
}) => {
  const dispatch = useDispatch();
  const { companyId, job, crewOpenDepartments, crewActivePosition } =
    useSelector((state) => state.ProducerJob);
  const { loading: roleCreateLoading, error: roleCreateError } = useSelector(
    (state) => state.ProducerJob.jobRoleCreate
  );
  const { loading: roleTypeUpdateLoading, error: roleTypeUpdateError } =
    useSelector((state) => state.ProducerJob.jobRoleTypeUpdate);
  const {
    loading: roleGroupTypeUpdateLoading,
    error: roleGroupTypeUpdateError,
  } = useSelector((state) => state.ProducerJob.jobRoleGroupTypeUpdate);
  const [editable, setEditable] = useState(false);
  const [input, setInput] = useState("");
  const [addRoleRequest, setAddRoleRequest] = useState(false);

  // console.log("jobGroup", jobGroup);
  const departmentKey = useMemo(() => {
    return `job-${job.id}-department-${jobGroup.id}`;
  }, [job, jobGroup]);

  const handleStartEditable = () => setEditable(true);
  const handleStopEditable = () => setEditable(false);

  const onDepartmentOpenChange = (openKeys) => {
    dispatch(setCrewOpenDepartments(openKeys));
  };

  const onPositionSelect = ({ key }) => {
    dispatch(setCrewActivePosition(key));
  };

  const isOpened = (department) => {
    return crewOpenDepartments.includes(department);
  };

  useEffect(() => {
    if (addRoleRequest && !roleCreateLoading && !roleCreateError) {
      setInput("");
      setAddRoleRequest(false);
      setEditable(false);
    }

    if (addRoleRequest && roleCreateError) {
      notification("error", showServerError(roleCreateError));
    }
  }, [roleCreateLoading, roleCreateError]);

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      setAddRoleRequest(true);
      dispatch(
        createJobRoleRequest({
          title: input,
          description: input,
          companyId,
          job: job.id,
          jobRoleGroup: jobGroup.id,
        })
      );
    } else if (event.keyCode === 27) {
      setInput("");
      setEditable(false);
    }
  };

  const handleChangeInput = (event) => {
    setInput(event.target.value);
  };

  const handleRemoveJobRole = (jobRoleGroupId, jobRole) => () => {
    dispatch(deleteJobRoleRequest({ jobRoleGroupId, id: jobRole.id }));
  };

  const handleJobRoleTitleUpdate = (jobRole, title) => {
    const payload = { title };
    dispatch(updateJobRoleTypeRequest(jobRole, payload));
  };

  const handleJobRoleGroupTitleUpdate = (jobRoleGroup, title) => {
    const payload = { title };
    dispatch(updateJobRoleGroupTypeRequest(jobRoleGroup, payload));
  };

  const getListStyle = (isDraggingOver) => {
    return {
      padding: "2px",
      background: isDraggingOver ? "lightblue" : "white",
    };
  };

  return (
    <Draggable
      draggableId={`${jobGroup.id}`}
      index={departmentIndex}
      key={departmentIndex}
      isDragDisabled={readOnly}
    >
      {(provided, snapshot) => (
        <JobDepartmentCrewWrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Row gutter={25}>
            <Col className="flex-size">
              <Menu
                mode="inline"
                inlineIndent={0}
                className="departmentList"
                openKeys={crewOpenDepartments}
                selectedKeys={[crewActivePosition]}
                onOpenChange={onDepartmentOpenChange}
                onSelect={onPositionSelect}
              >
                <SubMenu
                  key={departmentKey}
                  title={
                    <div
                      className="roleGroupTitleWrapper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        color={JobCheckboxColor[job.status]}
                        defaultChecked={true}
                        checked={jobGroup.selected}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDepartmentHide(jobGroup);
                        }}
                      />
                      <div className="roleGroupTitle">
                        <Tooltip title={jobGroup.jobRoleGroupType.title}>
                          {!readOnly?
                          <EditableText
                            text={jobGroup.jobRoleGroupType.title}
                            onComplete={(title) =>
                              handleJobRoleGroupTitleUpdate(jobGroup, title)
                            }
                          />
                          : <span>{jobGroup.jobRoleGroupType.title}</span>}
                        </Tooltip>
                      </div>
                    </div>
                  }
                  className="departmentRoleList"
                >
                  {jobGroup.jobRolesList &&
                    jobGroup.jobRolesList.map((jobRole) => {
                      const isStatic = [].includes(
                        jobRole.id
                      );
                      return (
                        <Menu.Item
                          id={`department-${jobGroup.id}-role-${jobRole.id}`}
                          key={`department-${jobGroup.id}-role-${jobRole.id}`}
                          className={isStatic ? "staticRole" : "dynamicRole"}
                        >
                          {(!isStatic && !readOnly) && (
                            <MinusCircleOutlined
                              className="roleAction"
                              onClick={handleRemoveJobRole(
                                jobGroup.id,
                                jobRole
                              )}
                            />
                          )}
                          <div className="roleTitle">
                            <Tooltip title={jobRole.jobRoleType.title}>
                              {!readOnly ? <EditableText
                                text={jobRole.jobRoleType.title}
                                onComplete={(title) =>
                                  handleJobRoleTitleUpdate(jobRole, title)
                                }
                              />:<span>{jobRole.jobRoleType.title}</span>
                              }
                            </Tooltip>
                          </div>
                        </Menu.Item>
                      );
                    })}
                    {
                      !readOnly && <Menu.Item
                    key={`add-${jobGroup.id}-position`}
                    onClick={handleStartEditable}
                    className="roleAction"
                  >
                    {editable && (
                      <ClickAwayListener
                        style={{ paddingLeft: "30px" }}
                        onClickAway={handleStopEditable}
                      >
                        <Input
                          value={input}
                          onKeyUp={handleKeyUp}
                          onChange={handleChangeInput}
                          autoFocus
                          suffix={addRoleRequest ? <LoadingOutlined /> : null}
                        />
                      </ClickAwayListener>
                    )}
                    <PlusCircleOutlined /> Add Position
                  </Menu.Item>
                  }
                </SubMenu>
              </Menu>
            </Col>
            <Col flex="auto">
              <Row gutter={25} justify="start" className="roleChoiceRow">
              <Col xs={{span: 24}} md={{span: 8}} xl={{ span: 8}} className="roleChoice">
                  {isOpened(departmentKey) && (
                    <div className="crewList">
                      <div className="choiceTitle">First Choice</div>
                      {jobGroup.jobRolesList &&
                        jobGroup.jobRolesList.length > 0 && (
                          <Droppable
                            droppableId={`droppable_${departmentIndex}_1`}
                            type="CREW"
                          >
                            {(provided, snapshot) => (
                              <CrewList
                                crews={firstChoice}
                                jobRoles={jobGroup.jobRolesList}
                                choiceLevel="MemoChoiceLevelInJob.FIRST"
                                choiceNumber={1}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                readOnly={readOnly}
                                onReadOnly={onReadOnly}
                              />
                            )}
                          </Droppable>
                        )}
                    </div>
                  )}
                </Col>
                <Col xs={{span: 24}} md={{span: 8}} xl={{ span: 8}} className="roleChoice">
                  {isOpened(departmentKey) && (
                    <div className="crewList">
                      <div className="choiceTitle">Second Choice</div>
                      {jobGroup.jobRolesList &&
                        jobGroup.jobRolesList.length > 0 && (
                          <Droppable
                            droppableId={`droppable_${departmentIndex}_2`}
                            type="CREW"
                          >
                            {(provided, snapshot) => (
                              <CrewList
                                crews={secondChoice}
                                jobRoles={jobGroup.jobRolesList}
                                choiceLevel="MemoChoiceLevelInJob.SECOND"
                                choiceNumber={2}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                readOnly={readOnly}
                                onReadOnly={onReadOnly}
                              />
                            )}
                          </Droppable>
                        )}
                    </div>
                  )}
                </Col>
                <Col xs={{span: 24}} md={{span: 8}} xl={{ span: 8}} className="roleChoice">
                  {isOpened(departmentKey) && (
                    <div className="crewList">
                      <div className="choiceTitle">Third Choice</div>
                      {jobGroup.jobRolesList &&
                        jobGroup.jobRolesList.length > 0 && (
                          <Droppable
                            droppableId={`droppable_${departmentIndex}_3`}
                            type="CREW"
                          >
                            {(provided, snapshot) => (
                              <CrewList
                                crews={thirdChoice}
                                jobRoles={jobGroup.jobRolesList}
                                choiceLevel="MemoChoiceLevelInJob.THIRD"
                                choiceNumber={3}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                readOnly={readOnly}
                                onReadOnly={onReadOnly}
                              />
                            )}
                          </Droppable>
                        )}
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </JobDepartmentCrewWrapper>
      )}
    </Draggable>
  );
};

DepartmentList.defaultProps = {};

export default DepartmentList;
