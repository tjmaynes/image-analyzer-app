# API

> an api for talking to ChatGPT

## Requirements

- [GNU Make](https://www.gnu.org/software/make)
- [Nodejs](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

## Usage

To install project dependencies, run the following command:

```bash
make install
```

To run all tests, run the following command:

```bash
make test
```

To start the application, run the following command:

```bash
make start
```

To work on the application, run the following command:

```bash
make dev
```

To deploy the application, run the following command:

```bash
make deploy
```

## Notes

To test `POST /conversation`, run the following command:

```bash
curl -v \
    -H 'Content-Type: application/json' \
    -d '{"context":"some-context"}' \
    http://localhost:8081/conversation
```
