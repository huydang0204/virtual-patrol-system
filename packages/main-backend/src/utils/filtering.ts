export function getArraySearch(field: string, rawArray?: string): string {

  if (!!rawArray) {
    const quotedElements = rawArray.split(",")
      .map(item => `'${item}'`)
      .join(","); // this is adding quote. Eg. orange,red to 'orange','red'
    return `${field} @> ARRAY[${quotedElements}]`;
  } else return "";

}
