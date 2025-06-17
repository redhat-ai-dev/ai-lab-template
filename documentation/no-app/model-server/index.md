# **Model Server Software Template**

You can use this AI Software Template to create a new GitOps deployment repository for a model server. You can use this model server with other Software Templates, like a Chatbot, or for other use.

!!! warning

    This will **not** deploy a sample application! This will only deploy the model server that an application can use.

## **Deployed Resources**

By running this template, you will receive the following resources:

- [ibm-granite/granite-3.1-8b-instruct](https://huggingface.co/ibm-granite/granite-3.1-8b-instruct) model served by a [vLLM](https://github.com/redhat-ai-dev/developer-images/tree/main/model-servers/vllm/0.8.4) inference server.

!!! info

    You will need to have GPUs available on your cluster for vLLM usage!

This deployed model and model server is accessible for you to use how you see fit, some examples include:

- Building your own custom AI application
- Hitting the server via CLI
- Learning how AI systems work/are deployed

