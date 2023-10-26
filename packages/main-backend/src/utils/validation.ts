import Joi,
{ Schema } from "joi";

export const joiStringToArrayValidation = (arrayValid ?: string[]) : Schema => {
  const custom = Joi.extend({
    type : "array",
    base : Joi.array(),
    coerce : {
      from : "string",
      method(values) {

        if (typeof values !== "string" || values[0] !== "[" && !/^\s*\[/.test(values)) {
          return;
        }

        try {
          return { value : JSON.parse(values) };
          // eslint-disable-next-line no-empty
        } catch (ignoreErr) {
        }
      }
    }
  });

  let schema = custom.array();
  if (!!arrayValid && arrayValid.length > 0) {
    schema = schema.items(Joi.string().valid(...arrayValid));
  }
  return schema.when("infected", {
    is : true,
    then : custom.array()
  });
};
