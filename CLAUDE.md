# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Template Generation
- `./generate.sh` - Main command to generate all software templates from skeleton and external repositories
- Individual import scripts:
  - `scripts/update-tekton-definition` - Import Tekton pipelines from rhdh-pipelines repository
  - `scripts/import-gitops-template` - Import GitOps resources from ai-lab-app repository  
  - `scripts/import-ai-lab-samples` - Import AI application samples from ai-lab-samples repository
  - `scripts/generate-no-app-template` - Generate templates without application components

### Testing
- E2E tests are configured with TypeScript in `e2e-tests/` directory
- No package.json found - check individual template directories for specific test commands

## Architecture Overview

This repository provides AI-focused Software Templates for Red Hat Developer Hub (RHDH) and Backstage. The architecture follows a modular design where templates are generated from reusable components:

### Core Structure
- **`skeleton/`** - Base template skeleton with `template.yaml` containing gated logic sections
- **`templates/`** - Generated software templates (6 AI use cases: audio-to-text, chatbot, codegen, object-detection, rag, model-server)
- **`scripts/`** - Generation and import utilities with environment-based configuration
- **`scripts/envs/`** - Environment files defining properties for each template type
- **`properties`** - Default host configurations for GitHub, GitLab, and Quay

### Template Generation System
Templates are generated using a sophisticated sed-based substitution system controlled by gated conditions in `scripts/util`. The system supports:
- Conditional inclusion of features (LLM servers, databases, authentication)
- Environment variable substitution from `properties` file
- Multiple model server types (llama.cpp, vLLM, ASR, DETR)

### External Dependencies
The repository imports resources from three external repositories:
- **rhdh-pipelines** - Tekton Pipeline definitions for CI/CD
- **ai-lab-app** - ArgoCD Applications and Kubernetes manifests
- **ai-lab-samples** - AI application source code and documentation

### Template Features
Each template supports:
- Model server selection (bring-your-own or hosted)
- Bearer authentication for external model servers
- OpenShift Pipelines and GitOps integration
- TechDocs documentation generation
- Remote cluster deployment capabilities

### Configuration Management
- Base configurations in `scripts/envs/base` set default values
- Individual template configurations override defaults in `scripts/envs/{template-name}`
- Host customization through `properties` file for on-premises deployments
- Gated feature flags control template capabilities (SUPPORT_LLM, SUPPORT_DB, etc.)

## Key Files
- `all.yaml` - Backstage Location manifest referencing all templates
- `skeleton/template.yaml` - Master template with conditional logic sections
- `generate.sh` - Main generation script orchestrating all imports and builds