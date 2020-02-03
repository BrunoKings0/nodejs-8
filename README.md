# Testando uma API Rest de Cadastro de Animais

Criamos um CRUD (Create, Read, Update e Delete) para gerenciamento de uma listagem de animais. Como sabemos, testes automatizados são um dos fundamentos na construção de aplicações confiáveis. Por isso, precisamos que você aumente a qualidade e consistência da nossa API, aumentando a cobertura de testes de integração dela.

## Tópicos

Neste desafio, você aprenderá:

- NodeJS
- Jest
- Supertest
- Testar APIs
- Testes de integração

## Requisitos
​
Para este desafio você precisará de:

- NodeJS LTS (8.12.0+)
- Jest (npm install jest -g)

## Detalhes

Com o intuito de simplificar o desafio, não estamos usando um banco de dados nessa aplicação. Todos os dados são manipulados nos arquivos `./data/database.{environment}.json` (já havendo dois necessários: para os ambiente de desenvolvimento e ambiente de execução dos testes). Os dados são manipulados através de um `model` que provê uma interface com métodos, como `findAll`, `findById`, `create`, `update` e `destroy` - que são os responsáveis pelas operações CRUD nessa nossa base de dados. Esse model fica em `./src/model/index.js` e é importado, sua interface utilizada no fica no servidor express, no arquivo `./src/server.js`.

No arquivo `./src/server.js` temos o servidor express com todos os endpoints e middlewares declarados ali dentro. A API possui os seguintes endpoints:

### /api/animals

Método: GET

Retorna um objeto chave/valor com todos os animais cadastrados.

Resposta:

StatusCode: 200
```json
{
  total: Number,
  data: {
    "{ANIMAL_ID}": {
      created_at: String,
      updated_at: String,
      pet_name: String,
      description: String,
      animal_type: String,
      pet_age: String,
      sex: String,
      color: String,
      image_url: String
    }
  } 
}
```

### /api/animals/:animalId

Método: GET

Retorna o animal cadastrado para o parâmetro referido (animalId)

Resposta:

StatusCode: 200
```json
{
  created_at: String,
  updated_at: String,
  pet_name: String,
  description: String,
  animal_type: String,
  pet_age: String,
  sex: String,
  color: String,
  image_url: String
}
```

### /api/animals

Método: POST

Cria um novo cadastro de animal.

Corpo aceito:
```json
{
  pet_name: String,
  description: String,
  animal_type: String,
  pet_age: String,
  sex: String,
  color: String,
  image_url: String
}
```

Resposta:
StatusCode: 201
```json
{
  created_at: String,
  updated_at: String,
  pet_name: String,
  description: String,
  animal_type: String,
  pet_age: String,
  sex: String,
  color: String,
  image_url: String
}
```

### /api/animals/:animalId

Método: PATCH

Atualiza os dados de cadastro do animal referido no parâmetro `animalId`. Os campos a serem atualizados são opcionais.

Corpo aceito:
```json
{
  pet_name: String,
  description: String,
  animal_type: String,
  pet_age: String,
  sex: String,
  color: String,
  image_url: String
}
```

Retorna o animal atualizado:
StatusCode: 200
```json
{
  created_at: String,
  updated_at: String,
  pet_name: String,
  description: String,
  animal_type: String,
  pet_age: String,
  sex: String,
  color: String,
  image_url: String
}
```

### /api/animals/:animalId

Método: DELETE

Remove o recurso determinado pelo parâmetro `animalId`.

Resposta:
StatusCode: 204

## Sobre a implementação dos testes de integração

Iniciamos a implementação dos testes de integração no arquivo `./test/server.test.js`.Junto a ele, encontra-seo arquivo `./test/utils.js` com alguns métodos que podem ser úteis para usar nos testes, principalmente nos hooks do jest (`beforeAll`, `beforeEach`, `afterEach`, `afterAll`).
Como você pode observar, já existe implementação para o endpoint `/api/animals` no método GET (o que retorna todos os animais na base de dados), mas a cobertura ainda é baixa e precisamos que você implemente o restante dos cenários de teste, em todos os endpoints. Consideramos aceitável quando a cobertura da aplicação estiver em pelo menos 85% (considerando a média entre cobertura de statements, branches, functions e lines).

Para acompanhar a evolução da cobertura dos testes que está implementando, considere executar o comando:

```
$ node_modules/jest/bin/jest.js test/server.test.js --coverage
```

A partir da raiz da aplicação.


Obs.: Tente usar o mínimo de bibliotecas o possível.