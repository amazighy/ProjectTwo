import React, { useState, useEffect } from "react";
import { csv } from "d3";
import RacingBarChart from "./RacingBarChart";
import StackedAreaChart from "./StackedAreaChart";
import StackedBarChart from "./StackedBarChart";
import useInterval from "./useInterval";

import stackDat from "./stackData.csv";
import baData from "./baData.csv";

import "./App.css";

const colors = {
  "North America": "#131F2C",
  "Latin America": "#086D8C",
  "M-East & N-Africa": "#34A195",
  "S-Saha Africa": "#F2EA0F",
  "South Asia": "#FC1F71",
  "European Union": "#ED4E3B",
  "OECD members": "#C6AC7D",
  "United States": "#85BB7E",
  Brazil: "#D04168",
  "United Kingdom": "#660E10",
  China: "#B5BBED",
  India: "#0CCDED",
};

const allKeys = [];
for (var k in colors) {
  allKeys.push(k);
}

function App() {
  const [iteration, setIteration] = useState(2017);
  const [start, setStart] = useState(false);
  const [keys, setKeys] = useState(allKeys);
  const [stackData, setStackData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [Data, setData] = useState([]);

  useEffect(() => {
    Promise.all([csv(stackDat), csv(baData)])
      .then(([stackData, barData]) => {
        barData.forEach((d) => {
          d.year = +d.year;
        });

        setStackData(stackData);
        setData(barData);
        barData.sort((a, b) => b.value - a.value);
        console.log(barData);
        const intialData = [...barData].filter((d) => d.year === 2017);
        setBarData(intialData);
      })
      .catch(function (err) {
        throw err;
      });
  }, []);

  useInterval(() => {
    if (start) {
      console.log(iteration);
      if (iteration === 2017) {
        setIteration(2000);
      } else {
        const filteredData = [...Data].filter((d) => d.year === iteration);
        // debugger

        setBarData(filteredData);

        setIteration(iteration + 1);
      }
    }
  }, 1000);

  return (
    <React.Fragment>
      <h3>Annual total CO₂ emissions, by country, 2000 to 2017</h3>
      <RacingBarChart data={barData} />

      <p className="iteration"> {iteration}</p>

      <button className="butRace" onClick={() => setStart(!start)}>
        {start ? "Stop Animation" : "Start Animation!"}
      </button>

      <h3>Annual total CO₂ emissions, reagion, 2000 to 2017 </h3>
      

      <div className="fields">
        {allKeys.map((key) => (
          <label key={key} className="container">
            <input
              id={key}
              type="checkbox"
              checked="checked"
              checked={keys.includes(key)}
              onChange={(e) => {
                if (e.target.checked) {
                  setKeys(Array.from(new Set([...keys, key])));
                } else {
                  setKeys(keys.filter((_key) => _key !== key));
                }
              }}
            />

            <span
              className="checkmark"
              htmlFor={key}
              style={{ background: colors[key] }}
            ></span>
            <div className="text-names">{key}</div>
          </label>
        ))}
      </div>
      <StackedAreaChart data={stackData} keys={keys} colors={colors} />
      <StackedBarChart data={stackData} keys={keys} colors={colors} />
      <h5>Data Sources: World Bank Development Indicators</h5>
    </React.Fragment>
  );
}

export default App;
