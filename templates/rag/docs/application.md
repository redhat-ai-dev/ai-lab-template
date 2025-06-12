<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/rag/README.md
-->

# RAG Chatbot Application

## Application Information

The application created by the AI Software Template utilizes the [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model. This is classified as a "Text Generation" model and is licensed under the Apache-2.0 license.

This application requires the use of a database to store uploaded documents so that the LLM is able to interact with them. The database for this application is [ChromaDB](https://www.trychroma.com/). The application uses [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer.

The LLM references information within the documents to provide more accurate responses to the prompt. You can view an example of this application in the following image:

![image](./images/rag.png)

If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag).