<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/rag/README.md
-->

# RAG Chatbot Application

## Application Information

The application created by this AI Software Template utilizes the [instructlab/granite-7b-lab](https://huggingface.co/instructlab/granite-7b-lab) model. This is classified as a "Text Generation" model and is licensed under the Apache-2.0 license.

This application requires the use of a database to store uploaded documents so that the LLM is able to interact with them. The database for this application is [ChromaDB](https://www.trychroma.com/). The use of [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer.

The LLM references information within those documents to provide more accurate responses to the prompt. You can view an example of this application below:

![image](./images/rag.png)

If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/rag).