## eslint-config-ts-lambdas

> config of `typescript-eslint` for Lambdas style.

<br/>

### Usage

- before: `yarn add eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser -D`

- install: `yarn add eslint-config-ts-lambdas -D`

- import to `.eslintrc`:

```json
{
  "extends": ["eslint-config-ts-lambdas"],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}

```

<br/>

### For React

```json
{
  "extends": [
    "eslint-config-ts-lambdas",
    "eslint-config-ts-lambdas/react"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}

```


<br/>

### Why `typescript-eslint`

- [TSLint and ESLint today](https://medium.com/palantir/tslint-in-2019-1a144c2317a9)

- [Roadmap: TSLint -> ESLint ](https://github.com/palantir/tslint/issues/4534)

- [Yarn's Future - v2 and beyond](https://github.com/yarnpkg/yarn/issues/6953) (tslint does not work properly in Yarn v2 project.)

<br/>

### Recommends

  - [eslint-config-lambdas](https://github.com/unix/eslint-config-lambdas)
  - [tslint-config-lambdas](https://github.com/unix/tslint-config-lambdas)

<br/>

### LICENSE
[MIT](LICENSE)

