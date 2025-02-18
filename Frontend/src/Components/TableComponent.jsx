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
import { TextField } from "@mui/material";



function TheftDetailsTable() {
  const [theftDetails, setTheftDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [filter,setfilterdata] = useState([]);
  const [query, setQuery] = useState();
  const [querydata,setquerydata]=useState("");
  const [message, setMessage] = useState(""); 


  // physcial filter
  const [columnValues, setColumnValues] = useState([]);  // To hold values of selected column
  const [selectedColumn, setSelectedColumn] = useState('');  // To hold the selected column name
  const [selectedValue, setSelectedValue] = useState(''); 
  useEffect(() => {
    if (querydata) {
      setfilterdata(querydata); // Automatically set filter input
    }
  }, [querydata]); // Runs whenever queryVal updates

  useEffect(() => {
    if (selectedColumn) {
      const fetchColumnValues = async () => {
        const response = await fetch(`http://localhost:3002/api/fieldvalue?column=${selectedColumn}`); // Example API to get column values
        const data = await response.json();
        setColumnValues(data);
      };
      fetchColumnValues();
    }
  }, [selectedColumn]);

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
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC1BLXHnbZuXzVxnB1SjXXCehW7RjEjVhs";
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

  useEffect(() => {
    fetchData(); // Load default data on mount
  }, []);

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

  // Handle checkbox selection
  const handleCheckboxChange = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Handle Group By button click - send selected columns to backend
  const handleGroupBy = () => {
    let selected = Object.keys(selectedColumns).filter((col) => selectedColumns[col]);
  
    if (selected.length === 0) {
      selected = ["case_ID"]; // Default grouping column
    }
  
    fetchData(selected);
  };
  
  const handleFilterApply = async () => {
    if (!filter.trim()) {
      fetchData();
      return;
    }
  
    setError(null);
  
    // Convert filter string (e.g., "Car_Model=Kwid,Color=Blue") to query params
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

        var queryVal ;

        for(var key in obj){
          queryVal = key + "=" + obj[key]+",";
        }
        queryVal = queryVal.slice(0,-1);
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
       <div>
        <h>Physical Filter</h>
      {/* First Select Dropdown for Column Names */}
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

      {/* Second Select Dropdown for Column Values */}
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

      {/* Trigger the second API call when both column and value are selected */}
      {selectedColumn && selectedValue && (
        <button onClick={handleSecondApiCall}>Fetch Data</button>
      )}
    </div>

    <div className="container">
    
      <h2>Theft Details Table</h2>
      <div className="filter-group-section">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter Data (col1=val, col2=val...)"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
        />

        
        <button variant="contained" color="primary" onClick={handleFilterApply}>
          Apply Filter
        </button>
      </div>


      <div className="group-by-section">
      <button variant="outlined" onClick={() => setShowCheckboxes(!showCheckboxes)}>
        {showCheckboxes ? "Hide Group By" : "Show Group By"}
      </button>
      </div>

      <div className="llm-section">
  <h4>LLM Filter</h4>
  <input
    placeholder="Enter Query"
    className="query-input"
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button onClick={getResponse}>Click</button>
      </div>
      </div>
    </div>


      
      {showCheckboxes && (
        <>
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
          </div>
          <button variant="contained" onClick={handleGroupBy}>
              Apply Grouping
            </button>

        </>
      )}
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