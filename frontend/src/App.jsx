import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload, FiYoutube, FiFacebook, FiInstagram } from 'react-icons/fi';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('myanmar');
  const [duration, setDuration] = useState('10min');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('recap_length', duration);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setResult(res.data);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-gray-200 flex">
      {/* Sidebar - Glass 70% */}
      <div className="w-64 h-screen fixed left-0 top-0 bg-zinc-800/70 backdrop-blur-xl border-r border-red-900/30 p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-8">Recap AI</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">ဘာသာစကား</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full mt-1 bg-zinc-700/50 border border-zinc-600 rounded-lg p-2 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="myanmar">မြန်မာ</option>
              <option value="english">English</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Recap အရှည်</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full mt-1 bg-zinc-700/50 border border-zinc-600 rounded-lg p-2 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="10min">10 မိနစ်</option>
              <option value="5min">5 မိနစ်</option>
            </select>
          </div>
        </div>

        {/* Social Media - Mobile မှာ အောက်ဆုံးရောက်မယ် */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4">
          <FiYoutube className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer transition-all hover:scale-110" />
          <FiFacebook className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer transition-all hover:scale-110" />
          <FiInstagram className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer transition-all hover:scale-110" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Movie Upload တင်ပြီး Recap ထုတ်မယ်</h2>
          <p className="text-gray-400 mb-8">AI က Auto ဖြတ်ပြီး မြန်မာလို စာတန်းထိုးပေးမယ်</p>

          {/* Upload Box */}
          <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
            <input
              type="file"
              accept="video/*"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FiUpload className="text-5xl text-red-500 mx-auto mb-4 animate-bounce" />
              <p className="text-lg">{file? file.name : "ဇာတ်ကားဖိုင်ရွေးပါ"}</p>
              <p className="text-sm text-gray-500 mt-2">MP4, MKV, AVI support</p>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            {loading? "AI က Recap လုပ်နေပါပြီ..." : "Recap စထုတ်မယ်"}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-8 bg-zinc-800/50 backdrop-blur rounded-xl p-6 border border-zinc-700 animate-fadeIn">
              <h3 className="text-xl font-bold text-green-400 mb-4">✅ Recap ရပါပြီ!</h3>
              <video src={`http://localhost:8000${result.video_url}`} controls className="w-full rounded-lg mb-4" />
              <a
                href={`http://localhost:8000${result.video_url}`}
                download
                className="inline-block bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded-lg transition"
              >
                Download MP4
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
