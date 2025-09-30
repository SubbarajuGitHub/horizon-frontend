import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Suppose this is the data returned from your API
const metricsData = {
  file: "WA_Fn-UseC_-Telco-Customer-Churn",
  results: {
    rf: {
      metrics: {
        roc_auc: 0.9227,
        precision: 0.654,
        recall: 0.872
      }
    },
    logistic: {
      metrics: {
        roc_auc: 0.848,
        precision: 0.519,
        recall: 0.801
      }
    }
  }
};

// For ROC curve visualization, we'll generate simple linear approximation
// Usually, ROC curves need TPR/FPR arrays, but we can simulate a curve using AUC
const generateRocPoints = (auc) => {
  // simple linear curve for demonstration: y = x^auc
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const fpr = i / 10;
    const tpr = Math.pow(fpr, 1 - auc); // simulate curve
    points.push({ fpr, tpr });
  }
  return points;
};

const rfRoc = generateRocPoints(metricsData.results.rf.metrics.roc_auc);
const logRoc = generateRocPoints(metricsData.results.logistic.metrics.roc_auc);

const RocCurveComparison = () => {
  return (
    <div>
      <h3>ROC Curve Comparison</h3>
      <LineChart
        width={600}
        height={400}
        data={rfRoc} // X-axis: fpr, Y-axis: tpr
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fpr" label={{ value: "False Positive Rate", position: "insideBottomRight", offset: 0 }} />
        <YAxis label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          data={rfRoc}
          dataKey="tpr"
          stroke="#8884d8"
          name={`Random Forest (AUC: ${metricsData.results.rf.metrics.roc_auc.toFixed(3)})`}
        />
        <Line
          type="monotone"
          data={logRoc}
          dataKey="tpr"
          stroke="#82ca9d"
          name={`Logistic Regression (AUC: ${metricsData.results.logistic.metrics.roc_auc.toFixed(3)})`}
        />
      </LineChart>
    </div>
  );
};

export default RocCurveComparison;
