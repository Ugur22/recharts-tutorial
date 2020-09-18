import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush,
  BarChart, Bar
} from "recharts";
import moment from "moment";

function App() {
  let [data, setData] = useState([]);
  let [type, setType] = useState("Active");
  let [color, setColor] = useState("#e67e22");
  let [activeIndex, setActive] = useState(0);
  let country;


  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch(`https://api.covid19api.com/total/country/Italy`)
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

  const getCountries = data.map((a) => a.Country);
  country = getCountries.slice(0,1);

  const BUTTONS = [
    {
      name: "Active",
      color: "#e67e22",
      value: latest_Active,
      id: 1
    },
    {
      name: "Deaths",
      color: "#e74c3c",
      value: latest_deaths,
      id: 2
    },
    {
      name: "Recovered",
      color: "#27ae60",
      value: latest_recovered,
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
      <div className="dashboard">
      <h1 className="title is-1">{country}</h1>
        <div className="columns">
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
                margin={{ top: 5, right: 70, left: 10, bottom: 5 }} >
                <XAxis dataKey="Date" tickCount={10} tick={CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} animationDuration={0} />
                <Legend />
                <Line type="natural" dataKey={type} stroke={color} dot={false} strokeWidth={3} travellerWidth={4} 
                 activeDot={{ fill: "#000000", stroke: "#FFFFFF", strokeWidth: 1, r: 5 }} />
                <Brush dataKey="Date" tickFormatter={xAxisTickFormatter} startIndex={Math.round(data.length * 0.45)}>
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
                margin={{ top: 5, right: 70, left: 10, bottom: 5 }} >
                <XAxis dataKey="Date" tickCount={10} tick={CustomizedAxisTick} minTickGap={2} tickSize={7} dx={14} allowDataOverflow={true} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey={type} fill={color} />
                <Brush dataKey="Date" tickFormatter={xAxisTickFormatter} startIndex={Math.round(data.length * 0.45)}>
                  <BarChart >
                    <Bar fill={color} type="natural" dataKey={type} stroke={color} strokeWidth={1} name={type} dot={false} />
                  </BarChart>
                </Brush>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
