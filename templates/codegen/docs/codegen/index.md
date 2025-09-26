<!-- Original Recipe README: https://github.com/containers/ai-lab-recipes/blob/main/recipes/natural_language_processing/codegen/README.md
-->

# **Codegen Software Template**

By choosing this template you can deploy a Codegen application that is supported by one of the following model servers, and their respective model(s):

!!! info

    You will need to have GPUs available on your cluster for vLLM usage!

- Llamacpp_python
  - A simple Python binding of the Llamacpp LLM inference server.
  - Serves the [TheBloke/Mistral-7B-Instruct-v0.2-AWQ](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-AWQ) model.
- vLLM
  - A high throughput, memory efficient inference and serving engine with GPU support for LLMs.
  - Serves the [TheBloke/Mistral-7B-Instruct-v0.2-AWQ](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-AWQ) model.
- Bring-Your-Own
  - You can supply your own model server and model.
  - You must ensure that you provide a model that supports Text Generation tasks.

This application was created with Python 3.11, and heavily relies on [Langchain](https://python.langchain.com/docs/introduction/) to simplify the communication with the chosen model service. [Streamlit](https://streamlit.io/) is utilized to construct the entire application web interface.

For additional information, see:

- [The Deployable Application](./application.md)
- [Using the Codegen Software Template](./usage.md)