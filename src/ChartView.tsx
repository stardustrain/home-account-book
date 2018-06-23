import * as React from 'react'
import Chart from 'chart.js'

interface IProps {
  chartId: string,
  type: string,
  labels: string[] | number[],
  datasets: Array<{
    label: string,
    data: string[] | number[],
    [option: string]: any,
  }>,
}

// const temp = {
//   type: 'bar',
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(153, 102, 255, 0.2)',
//             'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//             'rgba(255,99,132,1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//     }]
//   }
// }

class ChartView extends React.Component<IProps, any> {
  public chartCanvas: HTMLCanvasElement

  public componentDidMount() {
    const { chartId, type, labels, datasets } = this.props
    const ctx = document.getElementById(chartId)

    this.chartCanvas = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets,
      }
    })
  }

  public render() {
    return (
      <canvas id={this.props.chartId} className="ChartView" />
    )
  }
}

export default ChartView
