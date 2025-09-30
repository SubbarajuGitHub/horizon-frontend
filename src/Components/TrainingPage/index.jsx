import { useState } from "react";
import AtRiskUsers from "../AtRisks";
import { Activity, CheckCircle, Loader, TrendingUp, XCircle } from "lucide-react";

export const TrainingPage = ({ allUploadedFiles }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [trainingStatus, setTrainingStatus] = useState("idle");
  const [predictions, setPredictions] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const handleTraining = async () => {
    if (!selectedFile) return;
    setTrainingStatus("in_progress");
    const file_location = allUploadedFiles?.filter((each) => each.original_name === selectedFile)?.[0]?.filename;
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file_location }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setPredictions(data.predictions || []);
      setMetrics(data.metrics);
      setTrainingStatus("completed");
    } catch (error) {
      console.error(error);
      setTrainingStatus("failed");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.value);
    setTrainingStatus("ready");
  };

  let buttonText = "";
  let buttonDisabled = false;
  let buttonIcon = null;

  switch (trainingStatus) {
    case "idle":
      buttonText = "Select a CSV file first";
      buttonDisabled = true;
      buttonIcon = <Activity className="w-5 h-5" />;
      break;
    case "ready":
      buttonText = "Start Training Models";
      buttonIcon = <TrendingUp className="w-5 h-5" />;
      break;
    case "in_progress":
      buttonText = "Training in progress...";
      buttonDisabled = true;
      buttonIcon = <Loader className="w-5 h-5 animate-spin" />;
      break;
    case "completed":
      buttonText = "Training Completed Successfully";
      buttonDisabled = true;
      buttonIcon = <CheckCircle className="w-5 h-5" />;
      break;
    case "failed":
      buttonText = "Training Failed - Retry?";
      buttonIcon = <XCircle className="w-5 h-5" />;
      break;
    default:
      buttonText = "Start Training Models";
      buttonIcon = <TrendingUp className="w-5 h-5" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            Train ML Models
          </h3>
          <p className="text-slate-400 text-lg ml-[4.5rem]">
            Train Logistic Regression and Random Forest models on your data
          </p>
        </div>

        {/* File Selection Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 mb-6">
          <label className="text-white font-semibold mb-3 block flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Select Dataset
          </label>
          <select
            value={selectedFile}
            onChange={handleFileChange}
            className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
          >
            <option value="" disabled>Choose a CSV file...</option>
            {allUploadedFiles.map((file) => (
              <option key={file.filename} value={file.full_path}>
                {file?.original_name}
              </option>
            ))}
          </select>
        </div>

        {/* Training Button */}
        <button
          onClick={handleTraining}
          disabled={buttonDisabled}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${
            trainingStatus === "completed"
              ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
              : trainingStatus === "in_progress"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              : trainingStatus === "failed"
              ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
              : buttonDisabled
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/50"
          }`}
        >
          {buttonIcon}
          {buttonText}
        </button>

        {/* Model Performance Metrics */}
        {trainingStatus === "completed" && metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Logistic Regression Metrics */}
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-xl p-6 border border-blue-500/20 shadow-xl">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                Logistic Regression
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics.LogisticRegression).map(([key, value]) => (
                  <div key={key} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">{key.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-white">{(value * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Random Forest Metrics */}
            <div className="bg-gradient-to-br from-green-900/30 to-slate-800 rounded-xl p-6 border border-green-500/20 shadow-xl">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                Random Forest
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics.RandomForest).map(([key, value]) => (
                  <div key={key} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">{key.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-white">{(value * 100).toFixed(1)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Predictions Table */}
        {trainingStatus === "completed" && predictions.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Prediction Results
              </h4>
              <span className="text-slate-400 text-sm">
                Showing {Math.min(10, predictions.length)} of {predictions.length} predictions
              </span>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-700 max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-700/70 backdrop-blur-sm border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Logistic Regression
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Random Forest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Average Risk
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {predictions.slice(0, 10).map((row, idx) => {
                    const avgRisk = (row.LogisticRegressionProb + row.RandomForestProb) / 2;
                    return (
                      <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          {row.customerID}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden max-w-[100px]">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-400 h-full"
                                style={{ width: `${row.LogisticRegressionProb * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-300 text-xs font-mono">
                              {(row.LogisticRegressionProb * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden max-w-[100px]">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-400 h-full"
                                style={{ width: `${row.RandomForestProb * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-300 text-xs font-mono">
                              {(row.RandomForestProb * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            avgRisk > 0.7 ? 'bg-red-500/20 text-red-400' : 
                            avgRisk > 0.5 ? 'bg-yellow-500/20 text-yellow-400' : 
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {(avgRisk * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* At Risk Users Section */}
        {trainingStatus === "completed" && predictions.length > 0 && (
          <div className="mt-6">
            <AtRiskUsers selectedFile={selectedFile} allUploadedFiles={allUploadedFiles} />
          </div>
        )}
      </div>
    </div>
  );
};