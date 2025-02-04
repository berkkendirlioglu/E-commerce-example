import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CommentsStatistics } from "../../services/collection/auth";
import { CommentsStatisticsType } from "../../types/CommentsType";

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  ChartDataLabels
);

export const CommentsGraphs = ({ slug }: { slug: string }) => {
  const CanvasEl = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [commentStatistics, setcommentStatistics] =
    useState<CommentsStatisticsType>();

  useEffect(() => {
    const getCommentStatistics = async () => {
      const response = await CommentsStatistics(slug);
      setcommentStatistics(response);
    };
    getCommentStatistics();
  }, []);

  useEffect(() => {
    if (CanvasEl.current) {
      const ctx = CanvasEl.current.getContext("2d");
      if (ctx) {
        if (commentStatistics) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
              datasets: [
                {
                  data: [
                    commentStatistics.data.five_star_count,
                    commentStatistics.data.four_star_count,
                    commentStatistics.data.three_star_count,
                    commentStatistics.data.two_star_count,
                    commentStatistics.data.one_star_count,
                  ],
                  backgroundColor: "rgba(33, 38, 171, 1)",
                  datalabels: {
                    color: "white",
                    anchor: "center",
                    align: "center",
                    offset: 0,
                  },
                },
              ],
            },
            options: {
              indexAxis: "y",
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    maxTicksLimit: 80,
                  },
                },
              },
            },
          });
        }
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [commentStatistics]);

  return (
    <div>
      <canvas ref={CanvasEl}></canvas>
    </div>
  );
};
