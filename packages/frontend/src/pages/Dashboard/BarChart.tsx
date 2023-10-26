import React from "react";
import ReactApexChart from "react-apexcharts";
import { getLastDayOfMonth } from "utils/date-time";
import { distributeDatesBetweenXYDates } from "utils/time-format";

const RED_THRESHOLD = 10;

const BarChart = (props : { data : number[], type : "WEEK" | "MONTH", selectedMonthYear : number[], weeklyDateRange : { fromDate : string, toDate : string } }) : JSX.Element => {
  const {
    data, type, selectedMonthYear, weeklyDateRange
  } = props; // selectedMonthYear => [6, 2023] => July, 2023
  const lastDayOfMonth = getLastDayOfMonth(selectedMonthYear[0], selectedMonthYear[1]);

  const getXColumnNames = () : [string, string][] => {
    if (type === "MONTH") {
      return [["Week 1",
        "(1st - 7th)"],
      ["Week 2",
        "(8th - 14th)"],
      ["Week 3",
        "(15th - 21st)"],
      ["Week 4",
        `(22nd - ${lastDayOfMonth})`]];
    } else if (type === "WEEK") {
      const daysOfWeek = ["Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"];
      const datesInWeek = distributeDatesBetweenXYDates(weeklyDateRange.fromDate, weeklyDateRange.toDate);
      return datesInWeek.map((dateStr : string) => {
        const [day,
          month] = dateStr.split("-");
        const date = new Date(`2023-${month}-${day}`);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return [dayOfWeek,
          dateStr];
      });
    }
  };

  const chartOptions = {
    chart : { toolbar : { show : false } },
    plotOptions : {
      bar : {
        borderRadius : 7,
        dataLabels : { position : "top" },
        horizontal : false,
        distributed : false,
        columnWidth : "25%",
        colors : {
          ranges : [
            {
              from : 0,
              to : RED_THRESHOLD,
              color : "#D9D9D9"
            },
            {
              from : RED_THRESHOLD,
              to : 1000,
              color : "#D14751"
            }
          ]
        },
        barWidth : "40%"
      }
    },
    xaxis : {
      position : "bottom",
      categories : getXColumnNames(),
      axisBorder : { show : false },
      axisTicks : { show : false },
      labels : {
        style : {
          fontFamily : "inherit",
          cssClass : "apexcharts-bar-xaxis-label",
          whiteSpace : "pre-line"
        },
        offsetX : 0, // position of x-asix labels
        offsetY : 0
      }
    },
    yaxis : { labels : { show : false } },
    axisBorder : { show : false },
    grid : { 
      show : false, 
      borderColor : "#4B4B50" 
    },
    tooltip : { enabled : false }
  };

  const chartSeries = [ { data } ];

  return (
    <div id="bar-chart">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        width="400"
      />
    </div>
  );
};

export default BarChart;
