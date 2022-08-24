import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PersonalAccountIntroWrapper from './PersonalAccountIntro.styles';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { setUserIntroStep, updateUserIntro } from '@iso/redux/intro/actions';
import {
  TooltipDataCompanyProducer,
  TooltipDataPersonal,
  TypeUser,
  MAX_STEP,
} from '@iso/containers/IntroToolTip/TooltipData';

const PersonalAccountIntro = ({ visible, currentStep }) => {
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([]);
  const { user } = useSelector((state) => state.User);
  const { userStepIntro } = useSelector((state) => state.UserIntro);

  useEffect(() => {
    if (user) {
      if (user.type == TypeUser.PRODUCER) {
        setSteps(TooltipDataPersonal);
      } else {
        setSteps(TooltipDataCompanyProducer);
      }
    }
  }, [user]);

  const goToNextStep = () => {
    let newStep = currentStep + 1;
    let latestStep =
      newStep > userStepIntro.latestStep ? newStep : userStepIntro.latestStep;
    dispatch(
      setUserIntroStep({
        currentStepIntro: newStep,
        latestStep: latestStep,
      })
    );
  };

  const selectPreviousStep = (preStep) => {
    if (preStep <= userStepIntro.latestStep) {
      dispatch(
        setUserIntroStep({
          currentStepIntro: preStep,
          latestStep: userStepIntro.latestStep,
        })
      );
    }
  };

  const handleCancel = () => {
    let latestStep =
      currentStep > userStepIntro.latestStep
        ? currentStep
        : userStepIntro.latestStep;
    let payload = {
      userId: user.id,
      data: {
        tool_tip_step: latestStep,
        tool_tip_finished: latestStep == steps.length - 1 ? true : false,
      },
    };
    dispatch(
      setUserIntroStep({
        currentStepIntro: MAX_STEP,
        latestStep: MAX_STEP,
      })
    );
    dispatch(updateUserIntro(payload));
  };

  const finishIntro = () => {
    let payload = {
      userId: user.id,
      data: {
        tool_tip_step: currentStep,
        tool_tip_finished: true,
      },
    };
    //set max number = 1000 as out of step
    dispatch(
      setUserIntroStep({
        currentStepIntro: MAX_STEP,
        latestStep: MAX_STEP,
      })
    );
    dispatch(updateUserIntro(payload));
  };

  if (currentStep > steps.length - 1 || currentStep < 0) {
    return null;
  }
  let description = steps[currentStep].desc;
  let title = steps[currentStep].title;
  return (
    <PersonalAccountIntroWrapper>
      <div className='intro-view'>
        <div className='titleIntro'>
          <span>{title}</span>
          <Button type='link' className='closeBtn' onClick={handleCancel}>
            <MultiplyIcon width={14} height={14} />
          </Button>
        </div>
        <div className='description'>
          <span>{description}</span>
        </div>
        <Button type='link' className='skipBtn' onClick={finishIntro}>
          <span>Skip All</span>
        </Button>
      </div>
      <div className='intro-step'>
        <div className='steps-view'>
          <span className='current-step'>Step {currentStep + 1}</span>
          {steps.map((item, index) => (
            <div
              key={index}
              onClick={() => selectPreviousStep(index)}
              className={index <= userStepIntro.latestStep && 'enable-click'}
            >
              <div
                className={
                  currentStep == index ? `indicator` : `indicator unselected`
                }
              />
            </div>
          ))}
        </div>
        <div
          className='button-next theme-gradient'
          onClick={currentStep == steps.length - 1 ? finishIntro : goToNextStep}
        >
          <span>{currentStep == steps.length - 1 ? 'Finish' : 'Next'}</span>
        </div>
      </div>
    </PersonalAccountIntroWrapper>
  );
};

export default PersonalAccountIntro;
