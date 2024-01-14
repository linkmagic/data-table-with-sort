export const headerRenderer = (columnName) => {
  let result = "";
  switch (columnName) {
    case "name":
      result = "Name";
      break;
    case "owner":
      result = "Owner";
      break;
    case "dateCreate":
      result = "Date of Creation";
      break;
    case "dateChange":
      result = "Date of Change";
      break;
    case "rights":
      result = "Rights";
      break;
  }
  return <span>{result}</span>;
};

export const dataRenderer = (dataRow, field) => {
  // TODO: transform data in several fields (name, date, rights)
  let result = "";
  switch (field) {
    case "name":
      result = dataRow.name;
      break;
    case "owner":
      result = dataRow.owner;
      break;
    case "dateCreate":
      result = dataRow.dateCreate;
      break;
    case "dateChange":
      result = dataRow.dateChange;
      break;
    case "rights":
      result = dataRow.rights;
      break;
  }
  return <span>{result}</span>;
};
