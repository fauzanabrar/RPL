import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
  responsive          : true,
  maintainAspectRatio : false,
  plugins             : { legend: { position: 'top' } },
  scales              : {
                          y: {
                            min: 20,
                            max: 45,
                          }
                        }
};


export default function LineGraph({chartData}) {
  return (
    <div className="bg-white ">
      <Line width={300} height={300} options={options} data={chartData} />
    </div>
    );
}