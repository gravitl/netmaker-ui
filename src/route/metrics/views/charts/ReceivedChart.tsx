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
import { getTimeMinHrs } from '../../util';

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

const labels = ['Received'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Received',
      data: [100],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Received per Hour',
      data: [Math.floor(Math.random() * 1000)],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export const getData = (totalReceived: number, duration: number) => { 
  const { hours, min } = getTimeMinHrs(duration)
  const totalTimeHours = hours + (min/60)
  const receivedPerHour = !!!duration ? 0 : totalReceived / totalTimeHours
  return ({
    labels,
    datasets: [
      {
        label: 'Received',
        data: [totalReceived],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Received per Hour',
        data: [receivedPerHour],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
})}

type ReceivedProps = {
  totalReceived: number
  duration: number
}

export function ReceivedChart({ totalReceived, duration }: ReceivedProps) {
  return <Bar options={options} data={getData(totalReceived, duration)} />;
}
