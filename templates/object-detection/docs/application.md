<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/computer_vision/object_detection/README.md
-->

# Object Detection Application

## Application Information

The application created by this AI Software Template utilizes the [facebook/detr-resnet-101](https://huggingface.co/facebook/detr-resnet-101) model. This is classified as a "Object Detection" model and is licensed under the Apache-2.0 license.

This application connects to the Model Service by using FastAPI and [Streamlit](https://streamlit.io/) for the UI layer. The deployed sample takes an image input from the user and attempts to identify objects within the image. You can select the image you want to upload by browsing your file system. You can view an example of this application in the following image:

![image](./images/object-detection.png)

If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/object-detection](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/object-detection).