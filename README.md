# ml-sentinel
> An agnostic MLOps platform to automate the build, deployment and monitoring of any ML model

[![CI Pipeline Status](https://github.com/Ykaig/toxic-comment-classifier/actions/workflows/main-ci.yml/badge.svg)](https://github.com/Ykaig/toxic-comment-classifier/actions/workflows/main-ci.yml)

## The Problem

In many organizations, MLOps pipelines are either tightly coupled to a specific model or duplicated across multiple projects. This leads to inconsistent standards, repeated work, and difficulty in managing a growing ecosystem of ML services.

## The Solution

ML Sentinel solves this by providing a centralized, reusable, and model-agnostic infrastructure. It acts as a "service" that any number of "consumer" model repositories can use to automate their entire lifecycle.

This platform is not a model itself, but the **factory** that industrializes models, taking them from source code to a monitored, production-grade API endpoint with minimal boilerplate.

## Core Architecture

1.  A developer pushes code to a "consumer" model repository (e.g., `toxic-comment-classifier`).
2.  A GitHub Actions workflow in the model repository is triggered.
3.  This workflow makes a `workflow_call` to the central pipeline defined in *this* repository.
4.  ML Sentinel takes over, executing all steps from data validation to deployment, using the configuration and code provided by the model repository.

## Diagram
work in progress :)

## The "Model Contract"

For a model to be compatible with ML Sentinel, its repository must adhere to a specific contract. This is the key to the platform's agnostic nature. The contract requires:

1.  A standardized folder structure (`/src`, `/config`, etc.).
2.  A `model_config.yaml` file defining metadata and entry points.
3.  Scripts that accept standardized command-line arguments.

The full contract is detailed in the `ARCHITECTURE.md` file.

## Tech Stack

*   **CI/CD:** GitHub Actions (Reusable Workflows)
*   **Cloud Provider:** Google Cloud Platform (GCP)
*   **Compute:** Cloud Run (Serverless Containers)
*   **Containerization:** Docker
*   **Data & Model Versioning:** DVC
*   **Experiment Tracking:** MLflow
*   **API Framework:** FastAPI

## Live Demo & Repositories

*   **Live Dashboard:** work in progress
*   **Consumer Model 1 ():** work in progress
*   **Consumer Model 2 ():** work in progress

## Key Design Principles

-   **Agnosticism:** The core pipeline is completely decoupled from the model's domain (e.g., NLP, CV, Tabular) and ML framework (e.g., Scikit-learn, TensorFlow).
-   **Reusability:** A single, centralized `workflow_call`-triggered pipeline serves all integrated models, enforcing consistency and best practices.
-   **Automation:** Every `git push` to a model's main branch triggers a full CI/CD/CT run, deploying the model as a serverless API on Google Cloud Run.
-   **Observability:** The platform is designed for monitoring. A unified dashboard provides a single pane of glass to observe the health and performance of all deployed models.

## Roadmap
work in progress
