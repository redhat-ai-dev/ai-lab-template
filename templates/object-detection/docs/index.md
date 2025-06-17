<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/computer_vision/object_detection/README.md
-->

# **Object Detection Software Template**

## **Using the Software Template**

This AI Software Template allows you to customize the final generated result. In addition to specifying the application name and container image, you can also control the following actions:

- The owner listed through Red Hat Developer Hub (RHDH)
- The desired GitHub/GitLab organization and repository
- The namespace the application and applicable model servers are deployed to

!!! tip "Git Repositories"

    You can choose between GitHub and GitLab as your desired Source Code Management (SCM) platform, and the template fields will update accordingly!


With this template, you can supply your own model and model server. By utilizing this option, ensure that you provide models that supports Object Detection tasks.

## **Deployable Application**

This AI Software Template creates a web application that utilizes the [facebook/detr-resnet-101](https://huggingface.co/facebook/detr-resnet-101) model to identify objects from images. 

!!! info

    This model is classified as an "Object Detection" model. These models are specifically trained and designed to accurately identify objects that are contained within images!

    The model provided for use with this application is licensed under the Apache-2.0 license.

The following image depicts an example of what you can expect to see from your deployed application. This example displays the identification of various objects in the image, ranging from cats to the couch itself.

![Example of Application](./images/object-detection.png)

The source code for this Audio to Text application is available at [github.com/redhat-ai-dev/ai-lab-samples/tree/main/object-detection](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/object-detection).

## **Technologies used**

This application was created with Python 3.11, and relies on [FastAPI](https://fastapi.tiangolo.com/) for HTTP communication and [Streamlit](https://streamlit.io/) to construct the entire application web interface.