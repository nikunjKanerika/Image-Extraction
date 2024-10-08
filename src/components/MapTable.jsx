import React, { useEffect, useState } from "react";
import Spinner from "../svg/Spinner";

const MapTable = () => {
  const [tableData, setTableData] = useState([]);
  const [junctionMapping, setJunctionMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/map_table", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        // Parse the JSON response
        const data = await response.json();
  
        // Now access the data properly
        const parsedTableData = JSON.parse(data.table);
        const parsedJunctionMapping = data.junction_mapping;
        
        setTableData(parsedTableData);
        setJunctionMapping(parsedJunctionMapping);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };
  
    fetchTableData();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
       <Spinner/> <span>Fetching table...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="bg-red-100 text-red-800 p-4 rounded-md shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl text-center mt-4 mb-5 font-semibold ">Engineering Table</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Junction</th>
              <th className="px-4 py-2">Connections</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(junctionMapping).map(([key, values], index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{key}</td>
                <td className="px-4 py-2">{values.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Junction</th>
              <th className="px-4 py-2">Connector</th>
              <th className="px-4 py-2">Terminal</th>
              <th className="px-4 py-2">Wire Gage</th>
              <th className="px-4 py-2">Pinout</th>
              <th className="px-4 py-2">Wire Color</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Circuit</th>
              <th className="px-4 py-2">Termination</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{row.JUNCTION}</td>
                <td className="px-4 py-2">{row.CONNECTOR}</td>
                <td className="px-4 py-2">{row.TERMINAL}</td>
                <td className="px-4 py-2">{row["WIRE GAGE"]}</td>
                <td className="px-4 py-2">{row.PINOUT}</td>
                <td className="px-4 py-2">{row["WIRE COLOR"]}</td>
                <td className="px-4 py-2">{row.DESCRIPTION}</td>
                <td className="px-4 py-2">{row.CIRCUIT}</td>
                <td className="px-4 py-2">{row.TERMINATION}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MapTable;