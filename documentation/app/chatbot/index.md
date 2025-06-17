<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/chatbot/README.md
-->

# **Chatbot Software Template**

## **Using the Software Template**

This AI Software Template allows you to customize the final generated result. In addition to specifying the application name and container image, you can also control the following actions:

- The owner listed through Red Hat Developer Hub (RHDH)
- The desired GitHub/GitLab organization and repository
- The namespace the application and applicable model servers are deployed to

!!! tip "Git Repositories"

    You can choose between GitHub and GitLab as your desired Source Code Management (SCM) platform, and the template fields will update accordingly!


With this template, you can supply your own model and model server. By utilizing this option, ensure that you provide models that support Text Generation tasks.

## **Deployable Application**

This AI Software Template creates a web application that utilizes the [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model to generate text responses to your queries. To access this model, you can choose between two separate inference servers:

!!! info

    You will need to have GPUs available on your cluster for vLLM usage!

- Llamacpp_python
  - A simple Python binding of the Llamacpp LLM inference server.
- vLLM
  - A high throughput, memory efficient inference and serving engine with GPU support for LLMs.


The following image depicts an example of what you can expect to see from your deployed application. This example displays a brief conversation with the deployed Chatbot. You can determine the speed of the response by choosing `Llamacpp_python` (slower) or `vLLM` (faster).

You should be very **clear** and **specific** when giving your prompt in order to obtain the best possible results. The less you leave up to interpretation the better!

![Example of Application](./images/chatbot.png)

The source code for this Chatbot application is available at [github.com/redhat-ai-dev/ai-lab-samples/tree/main/chatbot](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/chatbot).

## **Technologies used**

This application was created with Python 3.11, and heavily relies on [Langchain](https://python.langchain.com/docs/introduction/) to simplify the communication with the chosen model service (Llamacpp_python/vLLM).

[Streamlit](https://streamlit.io/) is utilized to construct the entire application web interface.