import ffmpeg
import whisper

def process_video(video_path, audio_path=None, output_path=None, srt_path=None, duration="10min"):
    # Step 1: Audio ဆွဲထုတ်ပြီး Whisper နဲ့ စာသားပြောင်း
    if audio_path:
        ffmpeg.input(video_path).output(audio_path, acodec='pcm_s16le', ac=1, ar='16k').run(overwrite_output=True)
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"]
    
    # Step 2: Recap Video ထုတ်မယ် - FFmpeg Engine
    if output_path and srt_path:
        duration_sec = 600 if duration == "10min" else 300  # 10min or 5min
        
        # Video ဖြတ် + စာတန်းကပ် + Gray/Red filter
        (
            ffmpeg
            .input(video_path, t=duration_sec)
            .filter('subtitles', srt_path, force_style='FontName=Pyidaungsu,FontSize=24,PrimaryColour=&H0000FF&')
            .filter('colorbalance', rs=0.3)  # Red tint
            .output(output_path, vcodec='libx264', acodec='aac')
            .run(overwrite_output=True)
        )
        return output_path
