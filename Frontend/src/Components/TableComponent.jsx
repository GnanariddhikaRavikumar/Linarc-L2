import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
// require('dotenv').config();

function TheftDetailsTable() {
  const [theftDetails, setTheftDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [filter,setfilterdata] = useState([]);
  const [query, setQuery] = useState();
  const [querydata,setquerydata]=useState("");
  const [message, setMessage] = useState(""); 
  const [columnValues, setColumnValues] = useState([]); 
  const [selectedColumn, setSelectedColumn] = useState(''); 
  const [selectedValue, setSelectedValue] = useState(''); 
  
  useEffect(() => {
    if (querydata) {
      setfilterdata(querydata); 
    }
  }, [querydata]); 

  useEffect(() => {
    if (selectedColumn) {
      const fetchColumnValues = async () => {
        const response = await fetch(`http://localhost:3002/api/fieldvalue?column=${selectedColumn}`); 
        const data = await response.json();
        setColumnValues(data);
      };
      fetchColumnValues();
    }
  }, [selectedColumn]);

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleSecondApiCall = async () => {
    try{
    if (selectedColumn && selectedValue) {
      const val=`${selectedColumn}=${selectedValue}`;
      const link= `http://localhost:3002/api/filterdata?${val}`
      console.log(link);
      const response=await axios.get(link);
      setTheftDetails(response.data.length ? response.data : []); 
    }}
    catch(err)
    {
      console.log(err);
    }
  }
  
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  const url = `${API_URL}?key=${API_KEY}`;
  
  
  const tsvData = [
    "Case_ID",
    "Theft_Date",
    "Report_Date",
    "Car_Brand",
    "Car_Model",
    "Year_of_Manufacture",
    "Car_Type",
    "Fuel_Type",
    "Color",
    "Registered_State",
    "Registered_City",
    "Location_of_Theft",
    "Time_of_Theft",
    "Police_Station",
    "Is_Recovered",
    "Recovery_Date",
    "Suspect_Identified",
    "Number_of_Prev_Thefts",
    "GPS_Installed",
    "CCTV_Availability",
    "Insurance_Status",
    "Owner_Age_Group"
  ]

  // Column names
  const columns = [
    "Theft_Date",
    "Report_Date",
    "Car_Brand",
    "Car_Model",
    "Year_of_Manufacture",
    "Location_of_Theft",
    "Is_Recovered",
  ];

  const fetchData = async (groupedColumns = []) => {
    try {
      setLoading(true);
  
      let queryParams = groupedColumns.length
        ? `orderBy=${encodeURIComponent(groupedColumns[0])}` 
        : "";
  
      if (groupedColumns.length > 1) {
        queryParams += groupedColumns.slice(1).map((col) => `&${encodeURIComponent(col)}`).join(""); 
      }
      console.log(queryParams);
      const url = `http://localhost:3002/api/grouporderdata${queryParams ? `?${queryParams}&order=ASC` : ""}`;
  
      const response = await axios.get(url);
      setTheftDetails(response.data.length ? response.data : []); // Handle empty results
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (event) => {
    setfilterdata(event.target.value);
  };

  const handleCheckboxChange = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleGroupBy = () => {
    let selected = Object.keys(selectedColumns).filter((col) => selectedColumns[col]);
  
    if (selected.length === 0) {
      selected = ["case_ID"]; 
    }
  
    fetchData(selected);
  };
  
  const handleFilterApply = async () => {
    if (!filter.trim()) {
      fetchData();
      return;
    }
  
    setError(null);
  
    const queryParams = filter
      .split(",")
      .map((param) => param.trim().replace(/\s/g, ""))
      .join("&");
  
    const url = `http://localhost:3002/api/filterdata?${queryParams}`;
  
    try {
      const response = await axios.get(url);
      console.log("Filtered Data:", response.data); 
      setTheftDetails(response.data.length ? response.data : []); 
    } catch (err) {
      setError("Failed to fetch filtered data.");
    }
  };



  //LLM
  async function getResponse(){
    if(query==null){
      setMessage("Enter the query first");
      return;
      
    }
      var response = await axios.post(url,{
          "contents": [{
            "parts":[{"text": `generate me a key value object for the request :${query} use this as referance for key  ${tsvData} and extract the given key value pair only and remove all null fields`}]
            }]
      }
        )
        console.log(response);
        var value = response.data.candidates[0].content.parts[0].text;
        value = value.replace(/```json|```/g, "").trim();
        var obj = JSON.parse(value);
        console.log(obj);

        var queryVal = Object.entries(obj)
          .map(([key, value]) => `${key}=${value}`)
          .join(",");
          
        if (queryVal.length === 0) {
          setMessage("No valid Output"); 
      } else {
        setMessage("Click filter button to proceed further");
      }
        setquerydata(queryVal);
        console.log(queryVal);
        
    }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
    <h2 className="heading">Theft Details Table</h2>

    <div className="container">
      <div className="physical_filter">
        <h>Physical Filter</h>
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        <option value="">Select Column</option>
        {columns.map((column) => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>

      {selectedColumn && (
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">Select Value</option>
          {columnValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      )}

      {selectedColumn && selectedValue && (
        <button onClick={handleSecondApiCall}>FILTER</button>
      )}
      </div>
      <div className="filter-group-section">
        <div className="llm-section">
            <input
              placeholder="Enter Query"
              className="query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={getResponse}>GENERATE</button>
        </div>
        <div className="filter-section">
          <input
            type="text"
            placeholder="Filter Data (col1=val, col2=val...)"
            value={filter}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <button variant="contained" color="primary" onClick={handleFilterApply}>
            FILTER
          </button>
        </div>
      </div>
    </div>

    <div className="checkbox-container">
        {columns.map((column) => (
          <label key={column} style={{ display: "block", margin: "5px 0" }}>
            <input
              type="checkbox"
              checked={!!selectedColumns[column]}
              onChange={() => handleCheckboxChange(column)}
            />
            {column}
          </label>
        ))}
    <button variant="contained" onClick={handleGroupBy}>
        GROUP DATA
    </button>
    </div>

      <div>
        {message && <p>{message}</p>}    
      </div>
      <TableContainer component={Paper} style={{ marginTop: "10px" }}>
        <Table sx={{ minWidth: 800 }} aria-label="theft details table">
          <TableHead>
            <TableRow>
              <TableCell>Case ID</TableCell>
              {columns.map((column) => (
                <TableCell key={column} align="right">
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {theftDetails.map((row) => (
              <TableRow key={row.case_ID}>
                <TableCell>{row.case_ID}</TableCell>
                <TableCell align="right">{row.Theft_Date}</TableCell>
                <TableCell align="right">{row.Report_Date}</TableCell>
                <TableCell align="right">{row.Car_Brand}</TableCell>
                <TableCell align="right">{row.Car_Model}</TableCell>
                <TableCell align="right">{row.Year_of_Manufacture}</TableCell>
                <TableCell align="right">{row.Location_of_Theft}</TableCell>
                <TableCell align="right">{row.Is_Recovered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
    
  );
}

export default TheftDetailsTable;