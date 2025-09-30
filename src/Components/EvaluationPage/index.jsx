import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader
} from "lucide-react";

export const EvaluationPage = ({ setActiveTab }) => {
  const [allResults, setAllResults] = useState([]);
  const [selectedResultId, setSelectedResultId] = useState("");
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("allResults", allResults)
  // Fetch all trained results on mount
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/results");
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setAllResults(data.results);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // When a result is selected, show its metrics
  useEffect(() => {
    if (!selectedResultId) {
      setEvaluationData(null);
      return;
    }
    const result = allResults.find(r => r._id === selectedResultId);
    setEvaluationData(result ? result.metrics : null);
  }, [selectedResultId, allResults]);

  const ModelComparison = ({ modelName, metrics, color, icon: Icon }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 border border-slate-700/50 shadow-xl`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{modelName}</h3>
          <p className="text-slate-300 text-sm">Performance Metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["ROC_AUC", "Precision", "Recall", "F1"].map((metric) => (
          <div key={metric} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <p className="text-slate-300 text-sm font-medium">{metric.replace("_", " ")}</p>
            </div>
            <p className="text-3xl font-bold text-white">{(metrics[metric] * 100).toFixed(1)}%</p>
            <div className="mt-2 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all"
                style={{ width: `${metrics[metric] * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            Model Evaluation
          </h3>
          <p className="text-slate-400 text-lg ml-[4.5rem]">
            Compare and analyze metrics for previously trained results
          </p>
        </div>

        {/* Result Selection */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-400" />
            <label className="text-white font-semibold text-lg">Select Trained Result</label>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader className="w-6 h-6 animate-spin text-white" />
            </div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : allResults.length === 0 ? (
            <div className="text-slate-400">No trained results available. Train a model first.</div>
          ) : (
            <select
              className="w-full p-4 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
              value={selectedResultId}
              onChange={(e) => setSelectedResultId(e.target.value)}
            >
              <option value="">Select a trained result...</option>
              {allResults.map((res) => (
                <option key={res._id} value={res._id}>
                  {res?.original_filename ?? ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Evaluation Metrics */}
        {evaluationData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ModelComparison
                modelName="Logistic Regression"
                metrics={evaluationData.LogisticRegression}
                color="from-blue-900/30 to-slate-800"
                icon={TrendingUp}
              />
              <ModelComparison
                modelName="Random Forest"
                metrics={evaluationData.RandomForest}
                color="from-green-900/30 to-slate-800"
                icon={Zap}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
