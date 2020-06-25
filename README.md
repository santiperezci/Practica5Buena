# Practica5

This program is useful to create, consult, remove and modify recipes.

## Install all packages:
```
npm install
```
#### Packages to install:
```
    "babel-polyfill": "^6.26.0",
    "graphql-yoga": "^1.18.3",
    "mongodb": "^3.4.0",
    "uuid": "^3.3.3"
```
#### Execute:
```
npm run dev
```

#### Graphql Execution
http://localhost:8000

#### Types Explanation

##### Type Equipo

```
_id: ID!
nombre: String!
```
_id: Team identificator

nombre: Name of the match

#### Type Partido

```
_id:ID!
nombre1: Equipo!
nombre2: Equipo!
fecha: String!
resultado: String!
estado: Int! !
```
_id: Match identificator

nombre1: Local team

nombre2: Visitor team

fecha: Date

resultado: String which includes the result of the match

estado: 0 - The match hasn't started
        1 - The match has started
        2 - The match has finished
