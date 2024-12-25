import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { useEffect, useRef } from "react"
import ChartDataLabels from 'chartjs-plugin-datalabels';


Chart.register(CategoryScale,LinearScale,BarController,BarElement,ChartDataLabels);

export const CommentsGraphs = () => {
  const CanvasEl = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if(CanvasEl.current){
      const ctx = CanvasEl.current.getContext('2d'); 
      if(ctx){

        if(chartInstance.current){
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx,{
          type:'bar',
          data:{
            labels:['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐'],
            datasets: [{
              data:[70,60,30,20,10],
              backgroundColor:'rgba(33, 38, 171, 1)',
              datalabels:{
                color:'black',
                anchor:'end',
                align:'end',
                offset:0,
              }
          }]
          },
          options:{
            indexAxis:'y',
            scales:{
              x:{
                beginAtZero:true,
                ticks:{
                  maxTicksLimit:80,
                }
              },
            },
          },
          
        })
      }
    }

    return () => {
      if(chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, []);

  
  return (
    <div>
      <canvas ref={CanvasEl}></canvas>
    </div>
  )
}
