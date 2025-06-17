<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/computer_vision/object_detection/README.md
-->

# **Object Detection Software Template Overview**

By choosing this template you can deploy an Object Detection application that is supported by:

- A [facebook/detr-resnet-101](https://huggingface.co/facebook/detr-resnet-101) model using FastAPI for HTTP communication
- Your own chosen model server
  - You can provide your own through the template execution
  - This should be a FastAPI application that can be used with DEtection TRansformer (DETR) models

This application was created with Python 3.11, and relies on [FastAPI](https://fastapi.tiangolo.com/) for HTTP communication and [Streamlit](https://streamlit.io/) to construct the entire application web interface.

For additional information, see:

- [The Deployable Application](./application.md)
- [Using the Object Detection Software Template](./usage.md)