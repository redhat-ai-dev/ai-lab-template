<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/codegen/README.md
-->

# Code Generation Application

## Application Information

The application created by this AI Software Template utilizes the [mistralai/Mistral-7B-Instruct-v0.2](https://huggingface.co/Nondzu/Mistral-7B-code-16k-qlora) model. This is classified as a "Text Generation" model and is licensed under the Apache-2.0 license.

This application relies on [Langchain's python package](https://python.langchain.com/docs/introduction/) to simplify communication with the Model Service and uses [Streamlit](https://streamlit.io/) for the UI layer. The deployed sample is responsible for code generation and is used to generate code through natural language. After you prompt the model to generate the block of code you want, you will receive a response. With this response, you can continue interacting with the application to customize the initial response. You can view an example of this application in the following image:

![image](./images/codegen.png)

If you are interested in the source code for this application, you can find it at [https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/codegen](https://github.com/redhat-ai-dev/ai-lab-samples/tree/main/codegen).