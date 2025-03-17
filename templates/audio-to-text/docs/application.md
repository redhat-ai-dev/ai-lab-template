<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/audio/audio_to_text/README.md
-->

# Audio to Text Application

## Application Information

The application created by this AI Software Template utilizes the [ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp) model. This is classified as a "Automatic Speech Recognition" model and is licensed under the MIT license.

This application relies on [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer. The UI prompts the user to upload an audio file from the following types:

- .wav
- .mp3
- .mp4
- .flac

After the user has uploaded an acceptable audio file the application will begin outputting the contents of that audio file on the screen for the user to read. You can view an example of this application below:

![image](./images/audio-to-text.png)


If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/audio-to-text](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/audio-to-text).