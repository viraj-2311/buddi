import { AbilityBuilder, Ability } from "@casl/ability";
import { store } from "@iso/redux/store";
import { isContractor, isProducer } from './auth';

function subjectName(item) {
  if (!item || typeof item === "string") {
    return item;
  }
  return item.__type;
}

const ability = new Ability([], { subjectName });

let currentAuth;
store.subscribe(() => {
  const prevAuth = currentAuth;
  currentAuth = store.getState().Auth.user;

  if (prevAuth !== currentAuth) {
    ability.update(defineRulesFor(currentAuth));
  }
});

function defineRulesFor(user) {
  const { can, rules } = new AbilityBuilder();

  if (isProducer(user)) {
    can('create', 'Job')
  }

  if (isContractor(user)) {

  }

  return rules;
}

export default ability;
