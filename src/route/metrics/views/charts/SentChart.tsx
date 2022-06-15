import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getTimeMinHrs } from '../../util'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Total Transmitted Data on Node',
    },
  },
};

const labels = ['Sent'];

export const getData = (totalSent: number, duration: number) => { 
  const { hours, min } = getTimeMinHrs(duration)
  console.log(hours, min)
  const totalTimeHours = hours + (min/60)
  console.log("Total hours: ", totalTimeHours)
  const sentPerHour = !!!duration ? 0 : totalSent / totalTimeHours
  return ({
    labels,
    datasets: [
      {
        label: 'Sent',
        data: [totalSent],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Sent per Hour',
        data: [sentPerHour],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
})}

type SentProps = {
  totalSent: number
  duration: number
}

export function SentChart({totalSent, duration}: SentProps) {
  return <Bar options={options} data={getData(totalSent, duration)} />;
}
