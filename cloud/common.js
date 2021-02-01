/**
 * parse后台脚手架
 * www.yourCompany.com
 */

 function defineCloudFunction(func) {
  Parse.Cloud.define(func.name, func);
}

//给定一个对象，将其每个属性的value设置为其key的名字
const assignObjValueWithKey = obj => {
  Object.keys(obj).forEach(key => {
    obj[key] = key;
  });
};

if (typeof Trigger == 'undefined') {
  var Trigger = {
    beforeSave: '',
    afterSave: '',

    beforeDelete: '',
    afterDelete: '',

    beforeSaveFile: '',
    afterSaveFile: '',

    beforeDeleteFile: '',
    afterDeleteFile: '',

    beforeFind: '',
    afterFind: '',

    beforeLogin: '',
    afterLogout: '',
  };
  assignObjValueWithKey(Trigger);
}

const triggerCallback = triggerConfig => {
  const {
    triggerClassName,
    triggerRelations
  } = triggerConfig;
  if (triggerRelations !== undefined) {
    return request => {
      const {
        triggerName,
        object,
        original
      } = request;
      triggerRelations.forEach(triggerRelation => {
        const {
          triggerClassFieldName,
          relatedClassName,
          relatedClassFieldName
        } = triggerRelation;

        const triggerField = object.get(triggerClassFieldName);
        const originalTriggerField = original.get(triggerClassFieldName);
        // 仅当触发条件字段为有效信息，且与该字段原来的id值不相同时才触发
        if (triggerField === undefined || triggerField === null) {
          return;
        } else if (originalTriggerField === undefined ||
          originalTriggerField === null ||
          triggerField.id !== originalTriggerField.id) {
          switch (triggerName) {
            case Trigger.afterSave:
              const query = new Parse.Query(relatedClassName);
              query
                .get(triggerField.id)
                .then(relatedObj => {
                  var relation = relatedObj.relation(relatedClassFieldName);

                  relation.add(object);
                  console.log(new Date().toLocaleString() +
                    `: ${triggerName} triggered: ${triggerClassName}[${object.id}]  =>  ${relatedClassName}[${relatedObj.id}].${relatedClassFieldName}[${object.id}]`);
                  return relatedObj.save();
                })
                .catch(error => {
                  console.error(`${error.code}: ${error.message}`);
                  return error;
                });
              break;
              //TODO:
            case Trigger.afterDelete:
              break;
            default:
              break;
          }
        };
      });
    };
  }
};

function defineTrigger(triggerName, triggerConfig) {
  let {
    triggerClassName
  } = triggerConfig;

  switch (triggerName) {
    case Trigger.beforeSave:
      Parse.Cloud.beforeSave(triggerClassName, triggerCallback(triggerConfig));
      break;
    case Trigger.afterSave:
      Parse.Cloud.afterSave(triggerClassName, triggerCallback(triggerConfig));
      break;

    case Trigger.beforeDelete:
      Parse.Cloud.beforeDelete(triggerClassName, triggerCallback(triggerConfig));
      break;
    case Trigger.afterDelete:
      Parse.Cloud.afterDelete(triggerClassName, triggerCallback(triggerConfig));
      break;

    case Trigger.beforeSaveFile:
      Parse.Cloud.beforeSaveFile(triggerClassName, triggerCallback(triggerConfig));
      break;
    case Trigger.afterSaveFile:
      Parse.Cloud.afterSaveFile(triggerClassName, triggerCallback(triggerConfig));
      break;

    case Trigger.beforeDeleteFile:
      Parse.Cloud.beforeDeleteFile(triggerClassName, triggerCallback(triggerConfig));
      break;
    case Trigger.afterDeleteFile:
      Parse.Cloud.afterDeleteFile(triggerClassName, triggerCallback(triggerConfig));
      break;

    case Trigger.beforeFind:
      Parse.Cloud.beforeFind(triggerClassName, triggerCallback(triggerConfig));
      break;
    case Trigger.afterFind:
      Parse.Cloud.afterFind(triggerClassName, triggerCallback(triggerConfig));
      break;

    case Trigger.beforeLogin:
      Parse.Cloud.beforeLogin(triggerCallback(triggerConfig));
      break;
    case Trigger.afterLogout:
      Parse.Cloud.afterLogout(triggerCallback(triggerConfig));
      break;
  }
}

module.exports = {
  assignObjValueWithKey,
  Trigger,
  defineCloudFunction,
  defineTrigger,
};