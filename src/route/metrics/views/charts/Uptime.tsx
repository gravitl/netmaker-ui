import { Chart, registerables } from "chart.js";
import React from "react";
import { Doughnut } from 'react-chartjs-2'

Chart.register(...registerables);

interface Props {
  chartData: number[];
}

const options = {
    legend: {
        display: false,
        position: "right"
    },
    elements: {
        arc: {
        borderWidth: 0
        }
    }
};

export const UptimeChart = ({ chartData }: Props) => {
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

  return (
    <div className="self-center w-1/2">
      <div className="overflow-hidden">
        <Doughnut data={formatData(chartData)} options={options} />
      </div>
    </div>
  );
};
