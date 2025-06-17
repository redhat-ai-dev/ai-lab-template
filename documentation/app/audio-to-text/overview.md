<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/audio/audio_to_text/README.md
-->

# **Audio to Text Software Template Overview**

By choosing this template you can deploy an Audio to Text application that is supported by:

- A [ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp) model and model server
- Your own chosen model server and model
  - You can provide your own through the template execution
  - Your model(s) should support Automatic Speech Recognition (ASR) tasks

The sample application was created with Python 3.11, and heavily relies on [Langchain](https://python.langchain.com/docs/introduction/) to simplify the communication with the model service. [Streamlit](https://streamlit.io/) is utilized to construct the entire application web interface.

For additional information, see:

- [The Deployable Application](./application.md)
- [Using the Audio to Text Software Template](./usage.md)