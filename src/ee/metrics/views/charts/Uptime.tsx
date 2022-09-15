import { Typography } from "@mui/material";
import { Chart, registerables } from "chart.js";
import React from "react";
import { Doughnut } from 'react-chartjs-2'
import { getTimeMinHrs } from "../../util";

Chart.register(...registerables);

interface Props {
  chartData: number[];
  actualUptime?: number
}

const styles = {
  doughContainer: {
    width: "40%",
    height: "40%",
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -25%)"
  },
  relative: {
    position: "relative"
  }
} as any

const options = {
    plugins: {
      legend: {
        display: false
      },
    },
    cutout: 55,
    elements: {
        arc: {
          borderWidth: 0,
        }
    }
};

export const UptimeChart = (props: Props) => {
  // helper function to format chart data since you do this twice
  const formatData = (data: number[]) => ({
    responsive: true,
    labels: ["Up", "Down"],
    datasets: [{
        label: 'Uptime',
        data: data,
        backgroundColor: [
          'rgb(54, 255, 120)',
          'rgb(255, 99, 132)',
        ],
        hoverOffset: 4
      }]
  });

  let timeString = ""
  if (!!props.actualUptime) {
    const {hours, min} = getTimeMinHrs(props.actualUptime)
    timeString = `${hours}h${min}m`
  } else {
    timeString= '0h0m'
  }

  return (
    <div className="self-center w-1/2">
      <div style={styles.relative}>
        <Doughnut data={formatData(props.chartData)} options={options} />
        {!!timeString && <div style={styles.doughContainer}>
          <Typography variant='subtitle1'>
            {timeString}
          </Typography>
        </div>}
      </div>
    </div>
  );
};
