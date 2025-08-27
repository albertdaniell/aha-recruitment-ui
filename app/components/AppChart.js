import HighchartsReact from "highcharts-react-official";
import React from "react";
import Highcharts from "highcharts/highstock";

let option2 = {
  chart: {
    type: "line",
  },
  title: {
    text: "Monthly Average Temperature",
  },
  // subtitle: {
  //   text:
  //     "Source: " +
  //     '<a href="https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature" ' +
  //     'target="_blank">Wikipedia.com</a>',
  // },
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yAxis: {
    title: {
      text: "Temperature (°C)",
    },
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      enableMouseTracking: false,
    },
  },
  series: [
    {
      name: "Reggane",
      data: [
        16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22.0, 17.8,
      ],
    },
    {
      name: "Tallinn",
      data: [
        -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5, 2.0, -0.9,
      ],
    },
  ],
};

function AppChart({ options = option2 }) {
  console.log({options})
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        //   constructorType={'stockChart'}
        options={options}
      />
    </div>
  );
}

export default AppChart;
