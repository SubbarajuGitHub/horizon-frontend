
import { useState } from 'react';
import { Activity, TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';

function AtRiskUsers({ selectedFile, allUploadedFiles }) {
  const [threshold, setThreshold] = useState(0.6);
  const [atRiskUsers, setAtRiskUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAtRiskUsers = async () => {
    setLoading(true);
    try {
      const file_location = allUploadedFiles?.filter((each) => each.original_name === selectedFile)?.[0]?.filename;
      
      const response = await fetch("http://localhost:8000/at-risk-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file_location,
          threshold: parseFloat(threshold),
        }),
      });
      const data = await response.json();
      setAtRiskUsers(data?.at_risk_users || []);
    } catch (error) {
      console.error("Error fetching at risk users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-red-500/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/10 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">High-Risk Customers</h2>
          <p className="text-slate-400 text-sm">Identify customers likely to churn</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 items-center justify-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Risk Threshold
          </label>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="0.6"
          />
          <p className="text-xs text-slate-400 mt-1">Range: 0.0 to 1.0</p>
        </div>
        <button
          onClick={fetchAtRiskUsers}
          disabled={loading}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-red-500/20"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              Analyze Risk
            </>
          )}
        </button>
      </div>

      {atRiskUsers.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{atRiskUsers.length}</p>
                <p className="text-sm text-slate-400">At-Risk Customers</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Threshold</p>
              <p className="text-lg font-semibold text-red-400">{(threshold * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-600">
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
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {atRiskUsers.map((user, idx) => {
                  const avgProb = (user.LogisticRegressionProb + user.RandomForestProb) / 2;
                  const riskLevel = avgProb > 0.8 ? 'Critical' : avgProb > 0.7 ? 'High' : 'Medium';
                  const riskColor = avgProb > 0.8 ? 'text-red-400' : avgProb > 0.7 ? 'text-orange-400' : 'text-yellow-400';
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">
                        {user.customerID}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all"
                              style={{ width: `${user.LogisticRegressionProb * 100}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs font-mono min-w-[3rem]">
                            {(user.LogisticRegressionProb * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all"
                              style={{ width: `${user.RandomForestProb * 100}%` }}
                            />
                          </div>
                          <span className="text-slate-300 text-xs font-mono min-w-[3rem]">
                            {(user.RandomForestProb * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${riskColor} bg-opacity-10`}>
                          {riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No at-risk customers found for this threshold</p>
            <p className="text-sm mt-1">Try adjusting the threshold value</p>
          </div>
        )
      )}
    </div>
  );
}

export default AtRiskUsers