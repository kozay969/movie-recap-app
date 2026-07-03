import re
from datetime import timedelta

def create_srt_file(script_text, srt_path):
    # Script ကို စာကြောင်းတွေခွဲမယ်
    sentences = re.split(r'[.!?။]\s+', script_text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    srt_content = ""
    start_time = 0
    
    for i, sentence in enumerate(sentences, 1):
        # တစ်ကြောင်းကို 3 စက္ကန့်နှုန်း
        duration = 3
        end_time = start_time + duration
        
        start_str = str(timedelta(seconds=start_time))
        end_str = str(timedelta(seconds=end_time))
        
        # SRT format: 00:00:00,000 --> 00:00:03,000
        start_str = start_str.replace('.', ',') + ',000'
        end_str = end_str.replace('.', ',') + ',000'
        
        srt_content += f"{i}\n{start_str} --> {end_str}\n{sentence}\n\n"
        start_time = end_time
    
    with open(srt_path, 'w', encoding='utf-8') as f:
        f.write(srt_content)
    
    return srt_path
