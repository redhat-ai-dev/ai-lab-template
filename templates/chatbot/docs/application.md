<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/chatbot/README.md
-->

# Chatbot Application

## Application Information

The application created by this AI Software Template utilizes the [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model. This is classified as a "Text Generation" model and is licensed under the Apache-2.0 license.

This application relies on [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer. This Chatbot takes conversational input from a user. Based on the input and data from previous conversations, the Chatbot formulates an appropriate response to the prompt. You can view an example of this application in the following image:

![image](./images/chatbot.png)

If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/chatbot](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/chatbot).