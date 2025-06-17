<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/rag/README.md
-->

# **Retrieval-Augmented Generation (RAG) Software Template**

## **Using the Software Template**

This AI Software Template allows you to customize the final generated result. In addition to specifying the application name and container image, you can also control the following actions:

- The owner listed through Red Hat Developer Hub (RHDH)
- The desired GitHub/GitLab organization and repository
- The namespace the application and applicable model servers are deployed to

!!! tip "Git Repositories"

    You can choose between GitHub and GitLab as your desired Source Code Management (SCM) platform, and the template fields will update accordingly!


## **Deployable Application**

This AI Software Template creates a web application that utilizes a Text Generation model to generate responses to your queries. To support this, you can choose between three inference server options:

!!! info

    You will need to have GPUs available on your cluster for vLLM usage!

- Llamacpp_python
  - A simple Python binding of the Llamacpp LLM inference server.
  - Serves the [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model.
- vLLM
  - A high throughput, memory efficient inference and serving engine with GPU support for LLMs.
  - Serves the [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model.
- Bring-Your-Own
  - You can supply your own model server and model.
  - You must ensure that you provide a model that supports Text Generation tasks.

!!! info

    This model is classified as an "Text Generation" model. These models are specifically trained and designed to accurately provide responses to your prompts!

    The model provided for use with this application is licensed under the Apache-2.0 license.

The following image depicts an example of what you can expect to see from your deployed application. This example display the chat window and the section where you can upload reference documents. Retrieval-Augmented Generation (RAG) allows the model to reference documents you provide to enhance the accuracy of responses!

![Example of Application](./images/rag.png)

The source code for this RAG application is available at [github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag).

!!! tip

    When prompting the model you should ensure you use clear and concise language. Vague or overly broad prompts can produce incorrect responses!

## **Technologies used**

This application was created with Python 3.11, and heavily relies on [Langchain](https://python.langchain.com/docs/introduction/) to simplify the communication with the chosen model service (Llamacpp_python/vLLM). Additionally, the UI serving is handled by [Streamlit](https://streamlit.io/).

A vector database is required for the use of Retrieval-Augmented Generation (RAG). This application utilizes [ChromaDB](https://www.trychroma.com/) to handle all storage tasks.