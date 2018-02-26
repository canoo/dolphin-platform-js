
const commandDef = {
    CreatePresentationModel: {
        "id": "CreatePresentationModel",
        "pmId": "05ee43b7-a884-4d42-9fc5-00b083664eed",
        "attributes": [
            {
                "propertyName": "@@@ SOURCE_SYSTEM @@@",
                "id": "3204S",
                "value": "server"
            },
            {
                "propertyName": "caseDetailsLabel",
                "id": "3205S",
                "value": null
            },
            {
                "propertyName": "caseIdLabel",
                "id": "3206S",
                "value": null
            },
            {
                "propertyName": "statusLabel",
                "id": "3207S",
                "value": null
            },
            {
                "propertyName": "status",
                "id": "3208S",
                "value": null
            }
        ],
        "pmType": "com.canoo.icos.casemanager.model.casedetails.CaseInfoBean"
    },
    CreateContext: {
        "id":"CreateContext"
    },
    CreateController: {
          "id": "CreateController",
          "controllerName": "ToDoController",
          "parentControllerId": "myId"
    },
    LongPoll: {
        "id":"StartLongPoll"
    },
    InterruptLongPoll: {
        "id":"InterruptLongPoll"
    },
    ValueChanged: (oldValue, newValue) => {
        if (oldValue != null) {
            return {
                "id": "ValueChanged",
                "attributeId": "3357S",
                "oldValue": oldValue,
                "newValue": newValue
            };
        } else {
            return {
                "id": "ValueChanged",
                "attributeId": "3357S",
                "newValue": newValue
            };
        }
    }
}

const resultDef = {
    CreatePresentationModel:  '{"id":"CreatePresentationModel","p_id":"05ee43b7-a884-4d42-9fc5-00b083664eed","t":"com.canoo.icos.casemanager.model.casedetails.CaseInfoBean","a":[{"n":"@@@ SOURCE_SYSTEM @@@","a_id":"3204S","v":"server"},{"n":"caseDetailsLabel","a_id":"3205S"},{"n":"caseIdLabel","a_id":"3206S"},{"n":"statusLabel","a_id":"3207S"},{"n":"status","a_id":"3208S"}]}',
    CreateContext: '{"id":"CreateContext"}',
    CreateController: '{"id":"CreateController","n":"ToDoController","c_id":"myId"}',
    LongPoll: '{"id":"StartLongPoll"}',
    InterruptLongPoll: '{"id":"InterruptLongPoll"}',
    ValueChanged: (oldValue, newValue) => {
        if (newValue == null) {
            return '[{"id":"ValueChanged","a_id":"3357S"}]';
        } else {
            const value = JSON.stringify(newValue);
            return '[{"id":"ValueChanged","a_id":"3357S","v":' + value + '}]';
            
        }
    }
}

export { commandDef, resultDef }