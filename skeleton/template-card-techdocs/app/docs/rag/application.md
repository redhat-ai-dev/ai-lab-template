<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/rag/README.md
-->

# sed.edit.APP_DISPLAY_NAME

## Application Information

The application created by this AI Software Template utilizes the [sed.edit.LLM_MODEL_NAME](sed.edit.LLM_MODEL_SRC) model. This is classified as a "sed.edit.LLM_MODEL_CLASSIFICATION" model and is licensed under the sed.edit.LLM_MODEL_LICENSE license.

This application requires the use of a database to store uploaded documents so that the LLM is able to interact with them. The database for this application is [ChromaDB](https://www.trychroma.com/). The use of [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer.

The LLM references information within those documents to provide more accurate responses to the prompt. You can view an example of this application below:

![image](./images/rag.png)

If you are interested in the source code for this application, you can find it at [sed.edit.TEMPLATE_SOURCE_URL](sed.edit.TEMPLATE_SOURCE_URL).