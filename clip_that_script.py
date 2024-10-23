"""Application entry"""

import os
import argparse
import sys

import whisper
import transcriptor


if __name__ == "__main__":
    if getattr(sys, "frozen", False):  # Check if running from PyInstaller bundle
        # Use sys._MEIPASS to get the path to bundled resources
        base_path = sys._MEIPASS
        print(base_path)
    else:
        base_path = os.path.dirname(os.path.abspath(__file__))

    # Set the path to the bundled FFmpeg binary
    ffmpeg_path = os.path.join(base_path, "bin", "ffmpeg.exe")

    # Ensure FFmpeg is found by MoviePy
    os.environ["IMAGEIO_FFMPEG_EXE"] = ffmpeg_path

    # load model
    model = whisper.load_model("base")

    parser = argparse.ArgumentParser(description="Process some video.")
    parser.add_argument("keyword", type=str, help="The keyword to detect")
    parser.add_argument("video_file", type=str, help="The video file to process")
    parser.add_argument(
        "dest", type=str, help="The folder where the resulting clip should appear"
    )

    args = parser.parse_args()
    t = transcriptor.Transcriptor(model)
    t.detect_keyword_and_extract_clips(
        os.path.normpath(args.video_file), args.keyword, args.dest
    )

# file naming convention - 24-06-17-{filename}-c-1
# data-filename, this way new files are on top
# create a folder for each interaction
# folder name 24-06-17-{filename}-clips
