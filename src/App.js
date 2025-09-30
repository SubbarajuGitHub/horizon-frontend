import React, { useEffect, useState } from 'react';
import Sidebar from './Components/SideNavBar';
import UploadPage from './Components/UploadPage';
import { TrainingPage } from './Components/TrainingPage';
import { EvaluationPage } from './Components/EvaluationPage';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);
  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  const [resultsFiles, setResultsFiles] = useState([]);

  const fetchUploadedFiles = async () => {

    try {

      const res = await fetch("http://localhost:8000/files");
      const data = await res.json();
      console.log("data", data)
      setAllUploadedFiles(data.files || []);
    } catch (err) {
      console.error("Error fetching uploaded files:", err);
    }
  };

  useEffect(() => {

    const fetchTrainedResults = async () => {
      try {

        const res = await fetch("http://localhost:8000/results");
        const data = await res.json();
        setResultsFiles(data.results || []);
      } catch (err) {
        console.error("Error fetching trained results:", err);
      }
    }
    fetchUploadedFiles();
    fetchTrainedResults()
  }, []);

  useEffect(() => {
    fetchUploadedFiles()
  }, [uploadedFile]);

  const handleFileUpload = (value) => {
    setUploadedFile(value);
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allUploadedFiles={allUploadedFiles}
        evaluationData={evaluationData}
      />

      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Subscriber Churn Prediction</h2>
              <p className="text-slate-400 text-sm mt-1">AI-Powered Customer Retention Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-purple-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <div>
                  <p className="text-xs text-slate-400">Total Users</p>
                  <p className="text-white font-bold">{uploadedFile ? '12,847' : '0'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-pink-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 8l-8 8"></path>
                  <path d="M8 8l8 8"></path>
                </svg>
                <div>
                  <p className="text-xs text-slate-400">At Risk</p>
                  <p className="text-white font-bold">{uploadedFile ? '2,341' : '0'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-900 p-8">
          {activeTab === 'upload' && (
            <UploadPage
              uploadedFile={uploadedFile}
              setUploadedFile={handleFileUpload}
            />
          )}

          {activeTab === 'training' && (
            <TrainingPage
              allUploadedFiles={allUploadedFiles}
            />
          )}

          {activeTab === 'evaluation' && (
            <EvaluationPage
              evaluationData={evaluationData}
              setActiveTab={setActiveTab}
              resultsFiles={resultsFiles}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;