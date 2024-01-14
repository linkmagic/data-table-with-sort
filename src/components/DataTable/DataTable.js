import React from "react";
import { v4 as uuidv4 } from "uuid";

import "./styles.css";

const { useState, useEffect } = React;

const resetAllActiveSorters = (sorters) => {
  return sorters.map((sorter) => {
    return {
      ...sorter,
      active: false,
    };
  });
};

const getSorterState = (sorters, columnName) => {
  const sorter = sorters.filter((sorter) => sorter.column === columnName)[0];
  return {
    active: sorter.active,
    direction: sorter.direction === "direct" ? "A-Z" : "Z-A",
  };
};

const DataTable = ({ data, columns, headerRenderer, dataRenderer, sorters }) => {
  const [tableData, setTableData] = useState([]);
  const [tableSorters, setTableSorters] = useState([]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setTableData(data);
    }
  }, [data]);

  useEffect(() => {
    setTableSorters(resetAllActiveSorters(sorters));
  }, [sorters]);

  useEffect(() => {
    const activeSorter = tableSorters.filter((sorter) => sorter.active === true)[0];
    // TODO: implement sorting according to 'sorter.dataType'
    if (activeSorter) {
      const unsortedData = [...data];
      let sortedTableData = null;
      if (activeSorter.direction === "direct") {
        sortedTableData = unsortedData.sort((a, b) =>
          a[`${activeSorter.column}`] > b[`${activeSorter.column}`]
            ? 1
            : a[`${activeSorter.column}`] < b[`${activeSorter.column}`]
            ? -1
            : 0
        );
      } else if (activeSorter.direction === "reverse") {
        sortedTableData = unsortedData.sort((a, b) =>
          a[`${activeSorter.column}`] < b[`${activeSorter.column}`]
            ? 1
            : a[`${activeSorter.column}`] > b[`${activeSorter.column}`]
            ? -1
            : 0
        );
      }
      setTableData(sortedTableData);
    } else {
      setTableData(data);
    }
  }, [tableSorters]);

  const sortForColumnExists = (columnName) => {
    let result = false;
    if (Array.isArray(sorters) && sorters.length > 0) {
      sorters.forEach((sorter) => {
        if (sorter.column === columnName) {
          result = true;
        }
      });
    }
    return result;
  };

  const sorterBtnOnClick = (columnName) => {
    const getSorterNextState = (sorter) => {
      // unactive -> AZ -> ZA -> unactive
      if (!sorter.active) {
        return {
          ...sorter,
          active: true,
        };
      }
      if (sorter.active && sorter.direction === "direct") {
        return {
          ...sorter,
          direction: "reverse",
        };
      }
      if (sorter.active && sorter.direction === "reverse") {
        return {
          ...sorter,
          active: false,
          direction: "direct",
        };
      }
    };

    let sorterToChange = tableSorters.filter((sorter) => sorter.column === columnName)[0];
    sorterToChange = getSorterNextState(sorterToChange);
    const newSorters = sorters.map((sorter) => {
      if (sorter.column === columnName) {
        return sorterToChange;
      }
      return {
        ...sorter,
        active: false,
        direction: "direct",
      };
    });
    setTableSorters(newSorters);
  };

  const selfRenderHeader = () => {
    return Array.isArray(columns) && columns.length > 0 ? (
      <tr>
        {columns.map((columnName) => {
          return (
            <td key={uuidv4()} className="headerCell">
              <span className="nowrapContent">
                {headerRenderer ? headerRenderer(columnName) : columnName}
                {sortForColumnExists(columnName) && (
                  <button
                    className={`sorterButton ${getSorterState(tableSorters, columnName).active ? "active" : ""}`}
                    onClick={() => sorterBtnOnClick(columnName)}
                  >
                    {getSorterState(tableSorters, columnName).direction}
                  </button>
                )}
              </span>
            </td>
          );
        })}
      </tr>
    ) : (
      <></>
    );
  };

  const selfRenderMoreData = (data) => {
    const fields = Object.keys(data);
    return (
      <>
        {fields.map((field) => (
          <div>
            {field}: {data[`${field}`]}
          </div>
        ))}
      </>
    );
  };

  const selfRenderData = () => {
    return Array.isArray(tableData) && tableData.length > 0 ? (
      tableData.map((dataRow, index) => {
        let fields = Object.keys(dataRow);
        const isMoreData = fields.includes("moreData");
        fields = fields.filter((field) => field !== "moreData");
        return (
          <>
            <tr>
              {fields.map((field) => {
                return (
                  <td key={uuidv4()} className={`dataCell ${index % 2 !== 0 ? "zebraCell" : ""}`}>
                    {dataRenderer ? dataRenderer(dataRow, field) : dataRow[`${field}`]}
                  </td>
                );
              })}
            </tr>
            {isMoreData && (
              <tr>
                <td className={`dataCell ${index % 2 !== 0 ? "zebraCell" : ""}`} colspan="5">
                  {selfRenderMoreData(dataRow.moreData)}
                </td>
              </tr>
            )}
            <tr>
              <td colspan="5" style={{ height: "2px" }}></td>
            </tr>
          </>
        );
      })
    ) : (
      <></>
    );
  };

  return (
    <div className="dataTableContainer">
      <table className="dataTable">
        <thead>{selfRenderHeader()}</thead>
        <tbody>{selfRenderData()}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
