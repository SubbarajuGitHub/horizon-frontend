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

      const res = await fetch("https://horizon-backend-lcax.onrender.com/files");
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

        const res = await fetch("https://horizon-backend-lcax.onrender.com/results");
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