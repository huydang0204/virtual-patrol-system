import _ from "lodash";

export const search = <T>(data: T[], value: string, fields: string[]): T[] => {
  if (value) {
    const searchValues = value.split(",").map((val) => val.trim());
    const regexes = searchValues.map((val) => new RegExp(escapeRegExp(val), "i"));

    return data.filter((data) =>
      fields.some((field) => {
        if (typeof data[field] === "string" || typeof _.get(data, field) === "string") {
          if (field.includes("."))
            return searchValues.some((val) =>
              _.get(data, field)?.toLowerCase()
                .includes(val.toLocaleLowerCase()));
          return searchValues.some((val) => data[field]?.toLowerCase().includes(val.toLowerCase()));
        } else if (Array.isArray(data[field])) {
          return searchValues.every((val) =>
            data[field].some((tag) => regexes.some((regex) => regex.test(tag))));
        }
      }));
  }

  return data;
};

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
  