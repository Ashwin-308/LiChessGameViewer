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

export default function Mychart({evaluation: propsEval, movesarray: propsMovesArray}) {

  const location = useLocation();
  console.log("propsEval",propsEval);
  const evaluation = propsEval  || location.state?.evaluation;
  const movesarray =  propsMovesArray || location.state?.movesarray;
  console.log("MovesArray:", movesarray);
 console.log("evaluation", evaluation);
 
 
  const data = {
    labels: Array.from({ length: movesarray.length}, (_, i) => i + 1),
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
      y: { min :-10,max:10, title: { display: true, text: "Evaluation" } },
      x: { title: { display: true, text: "Move Number" } },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
