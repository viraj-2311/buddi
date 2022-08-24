import { updateUserExpertiseRequest } from '@iso/redux/user/actions';
import _ from 'lodash';

export const mutateChangedUserDetail = (
  changedFields,
  otherUserInformation,
  dispatch,
  values,
  setLoader
) => {
  const changedfieldsObj = changedFields;
  console.log('changedfieldsObj: ', changedfieldsObj);
  const {
    skills: {
      primarySkills: { primarySkill },
      secondarySkills: { secondarySkill },
      toolsAndTechnologies: { toolAndTechnology },
    },
    directors: { directors, directorsPhotography },
    productionCompanies,
    advertisingAgencies,
    headline,
    activeSince: { year, month },
    educations,
    awards,
    presses,
    pastClients,
    producers: {
      producers: { producer },
    },
  } = values;
  for (const field in changedfieldsObj) {
    if (changedfieldsObj[field]) {
      setLoader(true);
      switch (field) {
        case 'headline':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              headline,
            })
          );
          break;
        case 'activeSince':
          if (
            !_.isEqual(otherUserInformation.activeSince, values.activeSince)
          ) {
            dispatch(
              updateUserExpertiseRequest(otherUserInformation.id, {
                active_since: {
                  year,
                  month,
                },
              })
            );
          }
          break;
        case 'educations':
            dispatch(
              updateUserExpertiseRequest(otherUserInformation.id, {
                educations,
              })
            );
          break;
        case 'skills':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              skills: {
                primary_skill: primarySkill?.join() || "",
                secondary_skill: secondarySkill?.join() || "",
                tool_and_technology: toolAndTechnology?.join() || "",
              },
            })
          );
          break;
        case 'directors':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              directors: {
                directors,
                directors_photography: directorsPhotography,
              },
            })
          );
          break;
        case 'producers':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              producers: producer,
            })
          );
          break;
        case 'productionCompanies':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              production_companies: productionCompanies,
            })
          );
          break;
        case 'advertisingAgencies':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              advertising_agencies: advertisingAgencies,
            })
          );
          break;
        case 'pastClients':
          dispatch(
            updateUserExpertiseRequest(otherUserInformation.id, {
              past_clients: pastClients,
            })
          );
          break;
        case 'awards':
            dispatch(
              updateUserExpertiseRequest(otherUserInformation.id, {
                awards,
              })
            );
          break;
        case 'presses':
            dispatch(
              updateUserExpertiseRequest(otherUserInformation.id, {
                presses,
              })
            );
          break;
        default:
          console.log('Failed');
      }
    }
  }
};
