# Smart IoT Monitoring System - Frontend

Angular frontend for the Smart IoT Monitoring System.

## Prerequisites

- WSL / Linux with Docker installed
- Start Docker before running any commands:
```bash
  sudo service docker start
```

## Running the Project (Docker)

The frontend runs as part of the full stack. Clone the backend repo and follow the instructions in its README to run all containers together using `run.sh`.

## For DevOps — Build & Push Frontend Image

Only needed when frontend code changes are made:

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

## Docker Hub Image

| Service | Image |
|---|---|
| Frontend | `salmafayed/frontend-service:v1.0` |

---

# IotFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
