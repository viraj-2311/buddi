import React from 'react';
import cn from 'classnames';
import _ from 'lodash';
import BookCrewItem from './CrewItem';
import Checkbox from '@iso/components/uielements/checkbox';
import { CrewByPositionWrapper, BookCrewItemWrapper } from './CrewListStyle';
import { getIsShouldBookCrewConsidered } from '@iso/lib/helpers/utility';

const BookCrewList = ({ crewsByPositions, selectedCrews, onSingleSelect }) => {
  const getIsCheckBoxVisible = (crew, crewIndex, crewList) => {
    return getIsShouldBookCrewConsidered(crew, crewIndex, crewList);
  };

  return (
    <div className='ant-list ant-list-split'>
      <ul className='ant-list-items'>
        {Object.keys(crewsByPositions).map((cbp, i) => {
          const crews = _.sortBy(crewsByPositions[cbp], 'choiceLevel');
          return (
            <CrewByPositionWrapper
              key={cbp}
              isMultipleCrew={crews.length > 1}
              className={cn({
                'bg-crewList': crews.length > 1 && !crews[0].shouldItemExpand,
              })}
            >
              {crews.map((crew, crewIndex) => {
                return (
                  <>
                    {(!crew.shouldItemExpand || crewIndex === 0) && (
                      <BookCrewItemWrapper key={crew.id}>
                        {
                          <Checkbox
                            className={
                              !getIsCheckBoxVisible(crew, crewIndex, crews) &&
                              'hide-checkbox'
                            }
                            checked={
                              selectedCrews.includes(crew.id) &&
                              getIsCheckBoxVisible(crew, crewIndex, crews)
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                getIsCheckBoxVisible(crew, crewIndex, crews)
                              ) {
                                onSingleSelect(crew, e.target.checked);
                              }
                            }}
                          ></Checkbox>
                        }
                        <BookCrewItem
                          key={`crew_item_${i}`}
                          crew={crew}
                          index={crewIndex}
                        />
                      </BookCrewItemWrapper>
                    )}
                  </>
                );
              })}
            </CrewByPositionWrapper>
          );
        })}
      </ul>
    </div>
  );
};

export default BookCrewList;
