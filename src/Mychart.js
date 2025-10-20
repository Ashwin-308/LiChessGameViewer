import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Mychart() {
  const location = useLocation();
  
  const {evaluation} = location.state || {evaluation: []}; 
  console.log("All evaluations so far:", evaluation);
  const data = {
    labels: Array.from({ length: evaluation.length }, (_, i) => i + 1), // move numbers 1, 2, 3, ...
    datasets: [
      {
        label: "Evaluation",
        data: evaluation,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Evaluation Graph" },
    },
    scales: {
      y: { min :-20,max:20, title: { display: true, text: "Evaluation" } },
      x: { title: { display: true, text: "Move Number" } },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
