"""Generate text from video"""

import os
import tempfile
from moviepy import VideoFileClip, TextClip, ColorClip, CompositeVideoClip, vfx
from datetime import datetime
import numpy as np


class Transcriptor:
    """Generate text from video"""

    def __init__(self, model) -> None:
        self.model = model

    def extract_audio(self, video: str) -> tuple[str, float]:
        """Function to extract audio from video and process in memory"""
        clip = VideoFileClip(video)
        try:
            # Create a temporary file for the audio
            temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            temp_audio_file_path = temp_audio.name
            temp_audio.close()
            # write the audio to the wave file
            clip.audio.write_audiofile(
                temp_audio_file_path,
                codec="pcm_s16le",
                fps=16000,
                nbytes=2,
                logger=None,  # New in 2.0: silence logger
            )

            return (temp_audio_file_path, clip.duration)
        finally:
            clip.close()

    def create_clip_from_video(
        self,
        video_path: str,
        dest_path: str,
        start_time: float,
        clip_length: float = 30,
        clip_count: int = 1,
        caption_text: str = None,
    ):
        """Creates a clip from a larger video"""
        clip = None
        temp_audio = None
        try:
            clip = VideoFileClip(video_path)
            clip_start_time = max(0, start_time - clip_length)
            subclip = clip.subclipped(clip_start_time, start_time)

            # Apply the resize for shorts
            processed_clip = self.resize_clip(subclip)

            # Add captions if text is provided
            # if caption_text:
            #     processed_clip = self.add_captions_to_clip(processed_clip, caption_text)

            output_clip = f"{dest_path}/clip_{clip_count}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
            temp_audio = os.path.normpath(f"{dest_path}/temp_{clip_count}.mp3")

            processed_clip.write_videofile(
                output_clip,
                codec="libx264",
                temp_audiofile=temp_audio,
                logger=None,  # New in 2.0: silence logger
            )
        finally:
            if clip:
                clip.close()
            if temp_audio and os.path.exists(temp_audio):
                try:
                    os.remove(temp_audio)
                except Exception as e:
                    print(f"Error removing temp audio: {e}")

    def resize_clip(self, clip: VideoFileClip, target_ratio=(9, 16)) -> VideoFileClip:
        """Resize a clip for shorts while preserving important content."""
        try:
            # Get original dimensions
            original_width, original_height = clip.size

            # Calculate target dimensions maintaining 9:16 ratio
            target_width = 1080  # Standard width for vertical video
            target_height = 1920  # 1080 * 16/9 = 1920

            # Calculate dimensions for center crop
            # We want to crop the width to match the target ratio while keeping full height
            crop_width = int(original_height * (9 / 16))  # This ensures 9:16 ratio

            # Center crop coordinates
            x1 = (original_width - crop_width) // 2
            x2 = x1 + crop_width

            # First crop to 9:16 ratio
            cropped = clip.cropped(x1=x1, x2=x2, y1=0, y2=original_height)

            # Then resize to target dimensions
            resized = cropped.resized(width=target_width, height=target_height)

            # If the original video is wider than 9:16, create a blurred background
            if original_width / original_height > 9 / 16:
                # Create a blurred background by resizing the original clip
                background = (
                    clip.resized(height=target_height).cropped(
                        x1=0, x2=target_width, y1=0, y2=target_height
                    )
                    # .fx(vfx.blur, radius=30)  # Add strong blur effect
                )

                # Composite the resized clip over the blurred background
                final = CompositeVideoClip(
                    [background, resized.with_position("center")]
                )
                return final

            return resized

        except Exception as e:
            print(f"Error resizing clip: {e}")
            return clip

    def create_animated_caption(
        self, text: str, duration: float, clip_size: tuple
    ) -> VideoFileClip:
        """Create an animated caption with gaming-style effects"""

        txt_clip = TextClip(
            "./fonts/font.ttf",
            text=text,
            font_size=70,
            color="white",
            stroke_color="black",
            stroke_width=2,
            size=clip_size,
            method="caption",
            vertical_align="bottom",
            duration=duration,
        )

        # Create a simple shadow effect
        shadow = (
            TextClip(
                "./fonts/font.ttf",
                text=text,
                font_size=70,
                color="black",
                size=clip_size,
                method="caption",
                vertical_align="bottom",
                duration=duration,
            )
            .with_position((2, 2))
            .with_opacity(0.6)
        )

        return CompositeVideoClip([shadow, txt_clip])

    def add_captions_to_clip(self, clip: VideoFileClip, text: str) -> VideoFileClip:
        """Add gaming-style captions to the clip"""
        caption = self.create_animated_caption(
            text=text, duration=clip.duration, clip_size=clip.size
        )
        # Position the caption at the top of the video with some padding
        caption = caption.with_position(("center", 50))
        return CompositeVideoClip([clip, caption], size=clip.size)

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

    def detect_keyword_and_extract_clips(
        self,
        vid_path: str,
        keyword: str,
        dest_path: str = os.path.dirname(os.path.abspath(__file__)),
    ):
        try:
            os.environ["TEMP_DIR"] = dest_path
            audio_file_path, _ = self.extract_audio(vid_path)

            keyword_ts = self.detect_keyword_in_audio(audio_file_path, keyword)
            for i, keyword_info in enumerate(keyword_ts):
                try:
                    caption_text = keyword_info["word"].strip()
                    self.create_clip_from_video(
                        vid_path,
                        dest_path=dest_path,
                        start_time=keyword_info["end"],
                        clip_length=30,
                        clip_count=i + 1,
                        caption_text=caption_text,
                    )
                except Exception as e:
                    print(f"Error creating clip {i+1}: {e}")
        finally:
            if "audio_file_path" in locals():
                try:
                    os.remove(audio_file_path)
                except Exception as e:
                    print(f"Error removing temp file: {e}")
