/**
 * parse后台脚手架
 * www.yourCompany.com
 */

'use strict';
const parse = require('../common');


/********************* BEGIN YOUR CONFIG  *********************/
if (typeof ClassName == 'undefined') {
  /**
 * ClassName 为 db_name数据库的所有的Collection Class名称清单
 * TODO: 请替换为实际Collection名称
 * 
 */
  var ClassName = {
    db_collection1: '',
    db_collection2: '',
    db_collection3: '',
  };

  // 设置每个Class名称为其key值
  parse.assignObjValueWithKey(ClassName);
}

/**
 * TODO:  trigger配置部分，此部分可根据所需要触发的关系进行配置即可，也可单独提取为json配置文件
 * 以下以afterSave为例：
 * afterSave: [
    {
      triggerClassName: ClassName.db_collection1【触发源Collection】,
      triggerRelations: [
        {
          triggerClassFieldName: 'field1'【触发源Collection的触发字段】,
          relatedClassName: ClassName.db_collection2【关联操作的目的Collection】,
          relatedClassFieldName: 'field2'【关联操作的目的Collection的关联字段】,
        },
      ],
    },
  ],
  以上配置表示：在db_collection1.field1保存操作时，同步关联保存到db_collection2.field2字段中（此时，field2一般为list类型）
 */
const triggerConfigs = {
  afterSave: [
    {
      triggerClassName: ClassName.db_collection1,
      triggerRelations: [
        {
          triggerClassFieldName: 'field1',
          relatedClassName: ClassName.db_collection2,
          relatedClassFieldName: 'field2',
        },
      ],
    },
    {
      triggerClassName: ClassName.db_collection2,
      triggerRelations: [
        {
          triggerClassFieldName: 'field3',
          relatedClassName: ClassName.db_collection3,
          relatedClassFieldName: 'field4',
        },
      ],
    },
  ],
  //afterDelete:[],
};
/********************* END YOUR CONFIG  *********************/

//afterSave triggers
triggerConfigs.afterSave.forEach(triggerConfigItem => {
  parse.defineTrigger(parse.Trigger.afterSave, triggerConfigItem);
});

/**
 * afterDelete triggers
 *
 */
/*
triggerConfigs.afterDelete.forEach(triggerConfigItem => {
  parse.defineTrigger(parse.Trigger.afterDelete, triggerConfigItem);
});
*/
