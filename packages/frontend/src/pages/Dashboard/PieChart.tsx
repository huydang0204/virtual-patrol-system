import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChart = (props : { labels : string[], percentages : number[] }) : JSX.Element => {
  let {
    labels, percentages
  } = props;

  if (labels.length === 0) labels = ["no-data",
    "no-data"];
  if (percentages.length === 0) percentages = [50,
    50];

  const chartOptions = {
    labels,
    series : percentages,
    colors : ["#D14751",
      "#343439",
      "#ff8800",
      "#371316",
      "#4A67A6",
      "#9272CF",
      "#AECF72",
      "#CF9272",
      "#72AECF",
      "#894C2C",
      "#8A2C59",
      "#2C8A5C",
      "#8A7C2C",
      "#2C3A8A",
      "#3A8A2C",
      "#2C798A",
      "#00004E",
      "#4F0000",
      "#4F4F00",
      "#f0f"],
    dataLabels : {
      enabled : true,
      position : "middle",
      distributed : false,
      formatter : function (val) : string {
        return val.toFixed(0) + "%";
      },
      style : {
        fontFamily : "inherit",
        fontSize : "14px",
        textShadow : "none",
        textAnchor : "end",
        colors : ["white"]
      },
      dropShadow : { enabled : false }
    },
    plotOptions : { pie : { customScale : 1 } },
    legend : {
      show : true,
      labels : { colors : "white" }
    },
    tooltip : { enabled : false }
  };

  return (
    <div id="pie-chart">
      <div className="pie-chart-container">
        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="pie"
          width="360"
        />
      </div>
    </div>
  );
};

export default PieChart;
