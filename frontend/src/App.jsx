import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('မြန်မာ');
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async () => {
    if (!file) return alert('ဇာတ်ကားဖိုင်ရွေးပါ');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('duration', duration);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData);
      setDownloadUrl(`http://localhost:8000${res.data.download_url}`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h1>🎬 Movie Recap AI</h1>
        <p>1. ဘာသာစကားရွေးပါ</p>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option>မြန်မာ</option>
          <option>English</option>
        </select>

        <p>2. Recap အရှည်ရွေးပါ</p>
        <select value={duration} onChange={e => setDuration(e.target.value)}>
          <option value={5}>5 မိနစ်</option>
          <option value={10}>10 မိနစ်</option>
          <option value={15}>15 မိနစ်</option>
        </select>

        <p>3. ဇာတ်ကားဖိုင် Upload</p>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
        
        <button onClick={handleSubmit} disabled={loading}>
          {loading? 'လုပ်ဆောင်နေသည်...' : 'Recap စထုတ်မယ်'}
        </button>

        {downloadUrl && (
          <a href={downloadUrl} className="download-btn" download>
            ⬇️ Recap Video Download
          </a>
        )}
      </div>
      
      <div className="main">
        <h2>AI နဲ့ ဇာတ်ကားအကျဉ်းချုပ် ထုတ်မယ်</h2>
        <p>ဇာတ်ကားအရှည်ကြီးကို မိနစ်ပိုင်းအတွင်း အနှစ်ချုပ်ကြည့်လို့ရပြီ</p>
        {loading && <div className="loader">AI က Video ဖြတ်နေသည်... 3-5 မိနစ်ကြာမယ်</div>}
      </div>
    </div>
  );
}

export default App;
