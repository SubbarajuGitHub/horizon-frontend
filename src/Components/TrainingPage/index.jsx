import { useState } from "react";
import AtRiskUsers from "../AtRisks";
import { Activity, CheckCircle, Loader, TrendingUp, XCircle } from "lucide-react";


export const TrainingPage = ({ allUploadedFiles }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [trainingStatus, setTrainingStatus] = useState("idle");
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  const [pageSize, setPageSize] = useState(10);

  const handleTraining = async () => {
    if (!selectedFile) return;
    setTrainingStatus("in_progress");
    const file_location = allUploadedFiles?.filter((each) => each.original_name === selectedFile)?.[0]?.filename;
    try {
      const response = await fetch("https://horizon-backend-lcax.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file_location }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setPredictions(data.predictions || []);
      setPagination({
        offset: 0,
        limit: pageSize,
      });

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

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(predictions.length / pageSize);
    const currentPage = pagination.offset / pageSize;
    let newPage = currentPage;

    if (direction === "next" && currentPage < totalPages - 1) {
      newPage++;
    } else if (direction === "prev" && currentPage > 0) {
      newPage--;
    }

    setPagination({
      ...pagination,
      offset: newPage * pageSize,
    });
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPagination({ offset: 0, limit: newSize });
  };

  const paginatedData = predictions.slice(pagination.offset, pagination.offset + pageSize);

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
              <option key={file.filename} value={file.original_name}>
                {file?.original_name}
              </option>
            ))}
          </select>
        </div>

        {/* Training Button */}
        <button
          onClick={handleTraining}
          disabled={buttonDisabled}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-lg shadow-lg ${trainingStatus === "completed"
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

        {/* Predictions Table */}
        {trainingStatus === "completed" && predictions.length > 0 && (
          <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Prediction Results
              </h4>
              <div className="flex items-center gap-4">
                <label className="text-slate-400 text-sm">Rows per page:</label>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="bg-slate-700 text-white rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-700 max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-700/70 backdrop-blur-sm border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Customer ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Logistic Regression</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Random Forest</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Average Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {paginatedData.map((row, idx) => {
                    const avgRisk = (row.LogisticRegressionProb + row.RandomForestProb) / 2;
                    return (
                      <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">{row.customerID}</td>
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${avgRisk > 0.7
                              ? "bg-red-500/20 text-red-400"
                              : avgRisk > 0.5
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                              }`}
                          >
                            {(avgRisk * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-slate-300 text-sm">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={pagination.offset === 0}
                className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
              >
                Previous
              </button>

              <span>
                Page {pagination.offset / pageSize + 1} of{" "}
                {Math.ceil(predictions.length / pageSize)}
              </span>

              <button
                onClick={() => handlePageChange("next")}
                disabled={pagination.offset + pageSize >= predictions.length}
                className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-40"
              >
                Next
              </button>
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
