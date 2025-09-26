# **Audio to Text Software Template Deployable Application**

This AI Software Template creates a web application that utilizes the [ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp) model to transform audio files into text. 

!!! info

    This Software Template uses an "Automatic Speed Recognition (ASR)" model. These models are specifically trained and designed to accurately transcribe spoken language into written text!

    The model provided for use with this application is licensed under the MIT license.

The following image depicts an example of what you can expect to see from your deployed application. This example displays the text result of an audio file (*harvard_1.wav*) uploaded by the user. For best results, you should ensure that you upload high-quality audio files, and limit background noise that might interfere with the transcription.

![Example of Application](./images/audio-to-text.png)

!!! info "Allowable Media Types"

    This application allows you to upload audio files from the following media types:

    - .wav
    - .mp3
    - .mp4
    - .flac

The source code for this Audio to Text application is available at [github.com/redhat-ai-dev/ai-lab-samples/tree/main/audio-to-text](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/audio-to-text).