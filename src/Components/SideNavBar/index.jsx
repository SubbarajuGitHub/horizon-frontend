import { ChartIcon, PlayIcon, TvIcon, UploadIcon } from "../Icons/customIcons";

const Sidebar = ({ activeTab, setActiveTab, allUploadedFiles, evaluationData }) => {
  
  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
            <div className="w-8 h-8">
              <TvIcon />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">OTT Mega</h1>
            <p className="text-xs text-slate-400">Churn Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <div className="w-5 h-5">
            <UploadIcon />
          </div>
          <span className="font-medium">Upload CSV</span>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'training'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <div className="w-5 h-5">
            <PlayIcon />
          </div>
          <span className="font-medium">Train Models</span>
          {allUploadedFiles && (
            <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
              {allUploadedFiles?.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeTab === 'evaluation'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <div className="w-5 h-5">
            <ChartIcon />
          </div>
          <span className="font-medium">Evaluation Results</span>
          {evaluationData && (
            <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-white font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
