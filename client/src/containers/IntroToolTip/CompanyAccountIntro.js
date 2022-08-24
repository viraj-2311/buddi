import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CompanyAccountIntroWrapper from './CompanyAccountIntro.styles';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { setCompanyIntroStep, updateUserIntro } from '@iso/redux/intro/actions';
import {
  TooltipDataCompanyProducer,
  MAX_STEP,
} from '@iso/containers/IntroToolTip/TooltipData';

const CompanyAccountIntro = ({ visible, currentStep }) => {
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([]);
  const { user } = useSelector((state) => state.User);
  const { companyStepIntro } = useSelector((state) => state.UserIntro);

  useEffect(() => {
    setSteps(TooltipDataCompanyProducer);
  }, [user]);

  const goToNextStep = () => {
    let newStep = currentStep + 1;
    let latestStep =
      newStep > companyStepIntro.latestStep
        ? newStep
        : companyStepIntro.latestStep;
    dispatch(
      setCompanyIntroStep({
        currentCompanyStepIntro: newStep,
        latestStep: latestStep,
      })
    );
  };

  const selectPreviousStep = (preStep) => {
    if (preStep <= companyStepIntro.latestStep) {
      dispatch(
        setCompanyIntroStep({
          currentCompanyStepIntro: preStep,
          latestStep: companyStepIntro.latestStep,
        })
      );
    }
  };

  const handleCancel = () => {
    let latestStep =
      currentStep > companyStepIntro.latestStep
        ? currentStep
        : companyStepIntro.latestStep;
    let payload = {
      userId: user.id,
      data: {
        producer_tool_tip_step: latestStep,
        producer_tool_tip_finished:
          latestStep == steps.length - 1 ? true : false,
      },
    };

    dispatch(
      setCompanyIntroStep({
        currentCompanyStepIntro: MAX_STEP,
        latestStep: MAX_STEP,
      })
    );
    dispatch(updateUserIntro(payload));
  };

  const finishIntro = () => {
    let payload = {
      userId: user.id,
      data: {
        producer_tool_tip_step: currentStep,
        producer_tool_tip_finished: true,
      },
    };
    //set max number = 1000 as out of step
    dispatch(
      setCompanyIntroStep({
        currentCompanyStepIntro: MAX_STEP,
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
    <CompanyAccountIntroWrapper>
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
              className={index <= companyStepIntro.latestStep ? 'enable-click' : ''}
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
    </CompanyAccountIntroWrapper>
  );
};

export default CompanyAccountIntro;
