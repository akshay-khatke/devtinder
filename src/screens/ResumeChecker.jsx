import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ResumeChecker = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setAnalysis(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file first.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${BASE_URL}/resume/analyze`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.data.success) {
                setAnalysis(response.data.analysis);
            } else {
                setError("Failed to analyze resume.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Something went wrong during analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen bg-slate-50">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">AI Resume Reviewer</h1>
                <p className="text-slate-500 text-lg">Upload your resume and get professional feedback in seconds</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mb-10 transition-all hover:shadow-2xl">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 mb-6 bg-slate-50/50">
                    <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-slate-600 mb-2 font-medium">Click to upload or drag and drop</p>
                    <p className="text-slate-400 text-sm">PDF (max. 5MB)</p>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="absolute opacity-0 w-full h-full cursor-pointer" 
                        style={{ display: 'none' }}
                        id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="mt-4 px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition-colors">
                        Select PDF
                    </label>
                    {file && <p className="mt-3 text-primary font-bold">Selected: {file.name}</p>}
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className={`btn btn-primary btn-lg px-12 rounded-full shadow-lg shadow-primary/30 ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Analyzing with AI...' : 'Unlock My Resume Score'}
                    </button>
                </div>
                {error && <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-center font-medium">{error}</div>}
            </div>

            {analysis && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Score Section */}
                        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
                            <div className="relative inline-flex items-center justify-center p-1 bg-gradient-to-tr from-primary to-secondary rounded-full mb-4 shadow-xl shadow-primary/20">
                                <div className="bg-white rounded-full p-6">
                                    <span className="text-5xl font-black text-slate-900">{analysis.overall_score}</span>
                                    <span className="text-slate-400 font-bold">/100</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Overall Score</h3>
                            <div className="mt-4 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div 
                                    className="bg-primary h-full transition-all duration-1000" 
                                    style={{ width: `${analysis.overall_score}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 border-b border-slate-100 pb-2">AI Executive Summary</h2>
                            <p className="text-slate-700 leading-relaxed text-lg italic">"{analysis.summary}"</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-l-green-500 border border-slate-100">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                                <span className="bg-green-100 p-2 rounded-lg text-green-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                </span>
                                Key Strengths
                            </h2>
                            <ul className="space-y-4">
                                {analysis.strengths.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="text-green-500 font-bold font-mono">#{idx+1}</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Improvements */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-l-amber-500 border border-slate-100">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                                <span className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                </span>
                                Opportunities to Improve
                            </h2>
                            <ul className="space-y-4">
                                {analysis.improvements.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="text-amber-500 font-bold font-mono">#{idx+1}</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Career Tips / Action Plan */}
                        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-2xl text-white">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="bg-white/10 p-2 rounded-xl text-primary">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                </span>
                                Pro Career Strategy (Action Plan)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(analysis.action_plan || analysis.tips || []).map((tip, idx) => (
                                    <div key={idx} className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 text-sm hover:bg-white/10 transition-colors">
                                        <div className="text-primary font-black mb-2 opacity-50 uppercase tracking-tighter">Step {idx+1}</div>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeChecker;
