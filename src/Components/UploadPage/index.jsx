import { useState } from "react";
import { UploadIcon } from "../Icons/customIcons";

const UploadPage = ({ uploadedFile, setUploadedFile }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file);

    try {

      // Call FastAPI upload endpoint
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData, // pass FormData here
      });

      if (res.ok) {
        setUploadedFile(file);
        alert(`CSV uploaded successfully! Saved as: ${res.data.filename}`);
      } else {
        alert("Upload failed");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4">
            <div className="w-8 h-8">
              <UploadIcon />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Upload Subscriber Data</h3>
          <p className="text-slate-400">Upload your CSV file containing subscriber information for churn analysis</p>
        </div>

        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-slate-700 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-16 h-16 text-slate-500 mb-4 group-hover:text-purple-400 transition-colors">
              <UploadIcon />
            </div>
            {uploadedFile ? (
              <>
                <div className="w-8 h-8 text-green-500 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-lg text-white font-semibold mb-2">File Uploaded Successfully!</p>
                <p className="text-slate-400">{uploadedFile.name}</p>
                <p className="text-sm text-slate-500 mt-2">Click to upload a different file</p>
              </>
            ) : (
              <>
                <p className="text-lg text-white font-semibold mb-2">Click to upload or drag and drop</p>
                <p className="text-slate-400 text-sm">CSV file (MAX. 50MB)</p>
              </>
            )}
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={uploading} />
        </label>

        {uploadedFile && (
          <div className="mt-6 bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">File Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">File Name</p>
                <p className="text-white">{uploadedFile.name}</p>
              </div>
              <div>
                <p className="text-slate-400">File Size</p>
                <p className="text-white">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
