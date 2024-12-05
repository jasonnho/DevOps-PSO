# Todometer
Todometer is a simple task management application built using Electron and Node.js. It provides a user interface for adding, updating, reading, and deleting tasks. This is a basic CRUD application that helps users efficiently manage their task lists.

## Tools
- GitHub Actions: Automates workflows and CI/CD pipelines.
- Docker: A platform for packaging applications into Docker containers for easy deployment.
- Terraform: A tool for infrastructure as code, used to set up and manage cloud resources.
- AWS: Cloud infrastructure used to host and manage the application.
- Vitest: A testing framework for unit and integration tests in JavaScript projects.
- Prometheus: A monitoring tool that collects metrics from the deployed application.
- Grafana: A visualization tool used to display the metrics collected by Prometheus for real-time monitoring.


## Installation
- Clone the repo:

```bash
$ git clone https://github.com/jasonnho/DevOps-PSO.git
```

- Go to the project directory and install dependencies:

```bash
$ cd todometer && npm install
```

To show the Electron application window with your current build:

```bash
$ npm run dev
```

To build a production version:

```bash
$ npm install
$ npm run postinstall
$ npm run pre-electron-pack
$ npm run electron-pack
```
