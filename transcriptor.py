"""Generate text from video"""

import os
import tempfile
import moviepy.editor as mp
from moviepy.video.fx.all import resize, margin


class Transcriptor:
    """Generate text from video"""

    def __init__(self, model) -> None:
        self.model = model

    def extract_audio(self, video: str) -> tuple[str, float]:
        """Function to extract audio from video and process in memory"""
        clip = mp.VideoFileClip(video)

        # Create a temporary file for the audio
        temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        temp_audio_file_path = temp_audio.name
        temp_audio.close()

        # write the audio to the wave file
        clip.audio.write_audiofile(
            temp_audio_file_path, codec="pcm_s16le", fps=16000, nbytes=2
        )

        return (
            temp_audio_file_path,
            clip.duration,
        )  # Return the audio file path and video duration

    def detect_keyword_in_audio(self, audio_file_path: str, keyword: str):
        """Function to detect a keyword in wav audio and get the timestamp"""

        keyword_timestamps = []

        result = self.model.transcribe(audio_file_path)
        for segment in result["segments"]:
            if keyword.lower() in segment["text"].lower():
                keyword_timestamps.append(
                    {
                        "start": segment["start"],
                        "end": segment["end"],
                        "word": segment["text"],
                    }
                )
        return keyword_timestamps

    def create_clip_from_video(
        self,
        video_path: str,
        dest_path: str,
        start_time: float,
        clip_length: float = 30,
        clip_count: int = 1,
    ):
        """Creates a clip from a larger video

        Args:
            video_path (str): path to the larger video
            dest_path (str): where the results should be
            start_time (float): starting point in the old clip
            clip_length (int, optional): the length the new clip should be. Defaults to 30.
            clip_count (int, optional): For naming the clip. Defaults to 1.
        """
        clip = mp.VideoFileClip(video_path)

        clip_start_time = max(0, start_time - clip_length)
        subclip: mp.VideoClip = clip.subclip(clip_start_time, start_time)
        subclip = self.resize_clip(subclip)

        output_clip = f"{dest_path}/clip_{clip_count}.mp4"
        subclip.write_videofile(
            output_clip,
            codec="libx264",
            temp_audiofile=os.path.normpath(f"{dest_path}\\temp.mp3"),
        )

    def resize_clip(
        self, clip: mp.VideoClip, aspect_ratio=(1080, 1920)
    ) -> mp.VideoClip:
        """Resize a clip to the specified aspect_ratio

        Args:
            clip mp.VideoClip: video that needs to be resized
            aspect_ratio float: new aspect ration

        Returns a resized mp.VideoClip clip
        """
        new_clip = clip.resize(aspect_ratio)
        return new_clip

    def detect_keyword_and_extract_clips(
        self,
        vid_path: str,
        keyword: str,
        dest_path: str = os.path.dirname(os.path.abspath(__file__)),
    ):
        """_summary_

        Args:
            vid_path (str): path to the video
            keyword (str): the keyword to look for
        """
        os.environ["TEMP_DIR"] = dest_path

        audio_file_path, _ = self.extract_audio(vid_path)
        print("detect_keyword_and_extract_clips", audio_file_path)
        keyword_ts = self.detect_keyword_in_audio(audio_file_path, keyword)
        for i, keyword_info in enumerate(keyword_ts):
            keyword_time = keyword_info["end"]
            self.create_clip_from_video(
                vid_path,
                dest_path=dest_path,
                start_time=keyword_time,
                clip_length=10,
                clip_count=i + 1,
            )
        os.remove(audio_file_path)
