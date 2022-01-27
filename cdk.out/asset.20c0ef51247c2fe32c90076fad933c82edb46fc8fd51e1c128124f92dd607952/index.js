var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// services/SpacesTable/Create.ts
var Create_exports = {};
__export(Create_exports, {
  handler: () => handler
});
var import_aws_sdk = require("aws-sdk");

// services/shared/Utils.ts
function randomizer() {
  return Math.random().toString(36).slice(2);
}
function getEventBody(event) {
  return typeof event.body == "object" ? event.body : JSON.parse(event.body);
}

// services/SpacesTable/Create.ts
var TABLE_NAME = process.env.TABLE_NAME;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const item = getEventBody(event);
  item.spaceId = randomizer();
  console.log(item.spaceId);
  const result = {
    statusCode: 200,
    body: `Table ${TABLE_NAME} - SpaceId: ${item.spaceId} - Event body: ${getEventBody(event)}`
  };
  try {
    console.log(`Adding SpaceId ${item.spaceId}`);
    await dbClient.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
    console.log(`Added SpaceId ${item.spaceId}`);
    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`);
  } catch (error) {
    result.body = error.message;
    console.log(error);
  }
  return result;
}
module.exports = __toCommonJS(Create_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
