import React from "react";
import { DataTable } from "./components";
import { headerRenderer, dataRenderer } from "./components/DataTableRenderUtils";
import "./styles.css";

const { useState, useEffect } = React;
import JsonData from "./resources/data.json";

/*
  column: name, owner, dateCreate, dateChange, rights
  dataType: string, number, date
  direction: direct, reverse
  active: true, false
*/
const sorters = [
  { column: "name", dataType: "string", direction: "direct", active: false },
  { column: "owner", dataType: "string", direction: "direct", active: false },
  { column: "dateCreate", dataType: "date", direction: "direct", active: false },
  { column: "dateChange", dataType: "date", direction: "direct", active: false },
  { column: "rights", dataType: "string", direction: "direct", active: false },
];

const App = () => {
  const [tableData] = useState(JsonData);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const columnsArray = Object.keys(tableData[0]).filter((column) => column !== "moreData");
    if (columnsArray.length > 0) {
      setColumns(columnsArray);
    }
  }, [tableData]);

  return (
    <DataTable
      data={tableData}
      columns={columns}
      headerRenderer={headerRenderer}
      dataRenderer={dataRenderer}
      sorters={sorters}
    />
  );
};

export default App;
