<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/codegen/README.md
-->

# **Codegen Software Template**

## **Using The Template**

This AI Software Template provides you with some customization to alter the final generated result. Aside from being able to input your desired name for the application and container image you can control:

- The owner listed through Red Hat Developer Hub (RHDH)
- The desired GitHub/GitLab organization and repository
- The namespace the application and applicable model servers are deployed to

!!! tip "Git Repositories"

    You can choose between GitHub and GitLab as your desired Source Code Management (SCM) platform, and the template fields will update accordingly!


This template provides the option to supply your own model and model server. By utilizing this option you will need to ensure that the models support Text Generation tasks.

## **Deployable Application**

This AI Software Template will create a web application that utilizes the [TheBloke/Mistral-7B-Instruct-v0.2-AWQ](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-AWQ) model to generate text responses to your queries. To access this model you will have a choice between 2 separate inference servers:

!!! info

    You will need to have GPUs available on your cluster for vLLM usage!

- Llamacpp_python
  - A simple Python binding of the Llamacpp LLM inference server.
- vLLM
  - A high throughput, memory efficient inference and serving engine with GPU support for LLMs.

The image below is an example of what you can expect to see from your deployed application. This example shows a brief request to the application asking for a Python webserver. The speed of the response is determined by your choice of Llamacpp_python (slower) vs. vLLM (faster).

![Example of Application](./images/codegen.png)

The source code for this Codegen application is available at [github.com/redhat-ai-dev/ai-lab-samples/tree/main/codegen](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/codegen).

## **Technologies Used**

This application was created with Python 3.11, and heavily relies on [Langchain](https://python.langchain.com/docs/introduction/) to simplify the communication with the chosen model service (Llamacpp_python/vLLM).

[Streamlit](https://streamlit.io/) is utilized to construct the entire application web interface.