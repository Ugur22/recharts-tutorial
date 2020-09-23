import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, AreaChart, Area, Tooltip, Legend, ResponsiveContainer, Brush,
  BarChart, Bar
} from "recharts";
import moment from "moment";

function App() {

  const orange = '#e67e22';
  const red = '#e74c3c';
  const green = '#27ae60';
  const darkgrey = "#363636";
  
  let [data, setData] = useState([]);
  let [type, setType] = useState("Active");
  let [color, setColor] = useState(orange);
  let [activeIndex, setActive] = useState(0);
  let [padding, setPadding] = useState(10);
  let country;

  // 100 x cases /   total of type cases(recovered, active or deaths) / total cases

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch(`https://api.covid19api.com/total/country/France`)
      .then(response => response.json())
      .then(json => setData(json))
  }

  data = data.filter(a => (a.Active !== 0));

  const amount_Active = data.map((a) => a.Active);
  let latest_Active = Math.max(...amount_Active);

  const amount_deaths = data.map((a) => a.Deaths);
  let latest_deaths = Math.max(...amount_deaths);

  const amount_recovered = data.map((a) => a.Recovered);
  let latest_recovered = Math.max(...amount_recovered);

  const amount_confirmed = data.map((a) => a.Confirmed);
  let latest_confirmed = Math.max(...amount_confirmed);

  const getCountries = data.map((a) => a.Country);
  country = getCountries.slice(0, 1);

  const BUTTONS = [
    {
      name: "Active",
      color: orange,
      value: latest_Active,
      percentage: 100 * latest_Active / latest_confirmed,
      id: 1
    },
    {
      name: "Deaths",
      color: red,
      value: latest_deaths,
      percentage: 100 * latest_deaths / latest_confirmed,
      id: 2
    },
    {
      name: "Recovered",
      color: green,
      value: latest_recovered,
      percentage: 100 * latest_recovered / latest_confirmed,
      id: 3
    },
  ]

  const CustomTooltip = ({ active, payload, label, textTooltip }) => {
    const dateTip = moment(label)
      .format("llll")
      .slice(0, 12);
    const formattedDate = dateTip
    if (payload === null) return
    if (active)
      return (
        <div className="custom-tooltip">
          <p className="label-tooltip">{`${formattedDate}`}</p>
          <p className="desc-tooltip">
            <span className="value-tooltip">Total Cases: {payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    return null;
  };

  const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment(payload.value)
      .format("ll")
      .slice(0, 6);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#363636">
          {dateTip}</text>
      </g>
    );
  }

  const xAxisTickFormatter = (timestamp_measured) => {
    return moment(timestamp_measured)
      .format("ll")
      .slice(0, 6);
  }

  return (
    <div>
      {data.length > 0 && (
        <div className="dashboard">
          <h1 className="title is-3">{country} Covid-19 cases</h1>
          <div className="columns dashboard__numbers">
            {BUTTONS.map((item, index) =>
              <div className="column" key={index} >
                <h2>
                  <button style={{ color: item.color === color ? color : "#000" }} onClick={() => [setType(item.name), setActive(index),
                  setColor(item.color)]} className={activeIndex === index ? 'column__button title is-3 selected' : 'column__button title is-3'}>
                    {item.name}
                  </button>
                </h2>
                <p className="subtitle is-4" >{item.value.toLocaleString()}</p>
              </div>
            )}
          </div>
          <div className="columns graphs">
            <div className="column is-half line-graph">
              <h3 className="title is-5">{type} cases</h3>
              <ResponsiveContainer width={'100%'} height={'90%'}>
                <LineChart data={data}
                  margin={{ top: 5, right: padding, left: 10, bottom: 5 }} >
                  <XAxis dataKey="Date" tickCount={10} tick={CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} animationDuration={0} />
                  <Legend />
                  <Line type="natural" dataKey={type} stroke={color} dot={false} strokeWidth={3} travellerWidth={4}
                    activeDot={{ fill: "#000000", stroke: "#FFFFFF", strokeWidth: 1, r: 5 }} />
                  <Brush dataKey="Date" tickFormatter={xAxisTickFormatter} startIndex={Math.round(data.length * 0.45)} stroke={darkgrey}>
                    <LineChart >
                      <Line fill={color} type="natural" dataKey={type} stroke={color} strokeWidth={1} name={type} dot={false} />
                    </LineChart>
                  </Brush>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="column is-half bar-chart">
              <h3 className="title is-5">{type} cases</h3>
              <ResponsiveContainer width={'100%'} height={'90%'}>
                <BarChart
                  data={data}
                  stackOffset="sign"
                  margin={{ top: 5, right: padding, left: 10, bottom: 5 }} >
                  <XAxis dataKey="Date" tickCount={10} tick={CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip animationDuration={0} />} />
                  <Legend />
                  <Bar dataKey={type} fill={color} />
                  <Brush dataKey="Date" tickFormatter={xAxisTickFormatter} startIndex={Math.round(data.length * 0.45)} stroke={darkgrey}>
                    <BarChart >
                      <Bar fill={color} type="natural" dataKey={type} stroke={color} strokeWidth={1} name={type} dot={false} />
                    </BarChart>
                  </Brush>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="columns graphs">
            <div className="column is-half area-chart">
              <h3 className="title is-5">distribution of all cases</h3>
              <ResponsiveContainer width={'100%'} height={'90%'}>
                <AreaChart data={data}
                  margin={{ top: 5, right: padding, left: 10, bottom: 5 }} >
                  <XAxis dataKey="Date" tickCount={10} tick={CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                  <YAxis />
                  <Tooltip animationDuration={0} />
                  <Area type='natural' dataKey='Active' stackId="1" stroke={orange} fill={orange} />
                  <Area type='natural' dataKey='Deaths' stackId="1" stroke={red} fill={red} />
                  <Area type='natural' dataKey='Recovered' stackId="1" stroke={green} fill={green} />
                  <Brush dataKey="Date" tickFormatter={xAxisTickFormatter} startIndex={Math.round(data.length * 0.45)} stroke={darkgrey} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      {data.length === 0 && (
        <div className="loading">
          <img src="asset/img/loader.gif" alt="Cases are Loading" />
                         Loading...
        </div>
      )}
    </div>
  );
}

export default App;
