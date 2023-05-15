// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Habit-Tracker JS imported successfully!");

//Habit chart overview (profile)
// const config = {
//   type: 'pie',
//   data: data,
//   options: {
//     responsive: true,
//     plugins: {
//       legend: {
//         labels: {
//           generateLabels: function(chart) {
//             // Get the default label list
//             const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
//             const labelsOriginal = original.call(this, chart);

//             // Build an array of colors used in the datasets of the chart
//             let datasetColors = chart.data.datasets.map(function(e) {
//               return e.backgroundColor;
//             });
//             datasetColors = datasetColors.flat();

//             // Modify the color and hide state of each label
//             labelsOriginal.forEach(label => {
//               // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
//               label.datasetIndex = (label.index - label.index % 2) / 2;

//               // The hidden state must match the dataset's hidden state
//               label.hidden = !chart.isDatasetVisible(label.datasetIndex);

//               // Change the color to match the dataset
//               label.fillStyle = datasetColors[label.index];
//             });

//             return labelsOriginal;
//           }
//         },
//         onClick: function(mouseEvent, legendItem, legend) {
//           // toggle the visibility of the dataset from what it currently is
//           legend.chart.getDatasetMeta(
//             legendItem.datasetIndex
//           ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
//           legend.chart.update();
//         }
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
//             return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
//           }
//         }
//       }
//     }
//   },
// };

});
