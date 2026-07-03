from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
import shutil
from video_processor import process_video
from ai_script import generate_recap_script
from subtitle import create_srt_file

app = FastAPI(title="Movie Recap App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_PATH = "/app/storage"
os.makedirs(STORAGE_PATH, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "Movie Recap API Running"}

@app.post("/upload")
async def upload_movie(
    file: UploadFile = File(...),
    language: str = Form("myanmar"),
    recap_length: str = Form("10min")
):
    # 1. Save uploaded video
    video_path = f"{STORAGE_PATH}/{file.filename}"
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Extract audio + transcribe with Whisper
    audio_path = f"{STORAGE_PATH}/audio.wav"
    transcript = process_video(video_path, audio_path)
    
    # 3. Generate AI Recap Script - မြန်မာလို/English
    recap_script = generate_recap_script(transcript, language, recap_length)
    
    # 4. Create SRT subtitle file
    srt_path = f"{STORAGE_PATH}/recap.srt"
    create_srt_file(recap_script, srt_path)
    
    # 5. Cut video + burn subtitles with FFmpeg
    output_video = f"{STORAGE_PATH}/recap_final.mp4"
    process_video(video_path, output_video, srt_path, recap_length)
    
    return {
        "message": "Recap created successfully",
        "video_url": f"/download/recap_final.mp4",
        "script": recap_script
    }

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"{STORAGE_PATH}/{filename}"
    return FileResponse(path=file_path, filename=filename)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
