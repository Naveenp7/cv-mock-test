import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [exam, setExam] = useState('CV');
  const [year, setYear] = useState('2023');
  const [topic, setTopic] = useState('General');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!exam || !year) {
      toast.error('Please provide exam and year information');
      return;
    }

    try {
      setLoading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('exam', exam);
      formData.append('year', year);
      formData.append('topic', topic);

      // Upload PDF
      const response = await axios.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResults(response.data.data);
      toast.success(`Successfully extracted ${response.data.data.questionsCount} questions from the PDF`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error(error.response?.data?.error || 'Error uploading PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Upload PDF Questions</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Exam</label>
            <input
              type="text"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-bold ${
              loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>
      </form>
      
      {results && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-lg font-semibold mb-2">Upload Results</h3>
          <p>Filename: {results.filename}</p>
          <p>Questions Extracted: {results.questionsCount}</p>
          <p className="mt-2">{results.message}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUpload; 