# Bem vindo(a)
Esta é uma aplicação GraphQL desenvolvida com Node/NestJS e TypeORM; usei Jest para os testes unitários.

#### Aqui está o [Front-end](https://github.com/filiperv7/question-tech_front) desta aplicação.

A aplicação tem como foco ajudar nos estudos dos devs, com a oportunidade de tirar dúvidas com pessoas mais experiêntes. Funciona assim:
- crie sua conta;
- faça login;
- navegue pelas perguntas existentes; ou
- faça um nova pergunta;
- você também pode responder perguntas.

## Regras de negócio
1. Os recursos de perguntas e respostas só estão disponíveis para usuários autenticados com um token JWT válido.
2. Para criar uma pergunta o usuário deve, obrigatóriamente, preeencher o titulo, descrição e alguma tag.
3. Para criar uma pergunta é obrigatório adicionar pelo menos 1 tag relacionada ao assunto e no máximo 3.
4. Uma pergunta só pode ser editada pelo seu próprio autor.
5. Uma pergunta só pode ser editada se ainda não tiver nenhuma resposta.
6. Ao editar uma pergunta, todas as regras de criação são válidas aqui também.
7. Uma pergunta só pode ser excluída pelo seu próprio autor.
8. Ao excluir uma pergunta, suas respostas, caso existam, também são excluídas do banco.
9. Você pode responder as perguntas de qualquer pessoa, inclusive as suas.
10. Ninguém pode editar nenhuma resposta.
11. Uma resposta só pode ser excluída pelo seu próprio autor.

## Algumas decisões e observações
Escolhi o TypeORM, porque nunca tinha usado, então decidi me desafiar com ele.
No início, como pensei em uma aplicação com CRUD mais simples, estava fazendo uma aplicação um pouco mais acoplada, pois não tinha necessidade de subdividir tanto. Mas durante o desenvolvimento fui adicionando novas coisas (alguns arquivos estavam grandes e um pouco complexos), então decidi refatorar toda a infraestrutura e dividir os recursos da API em usecases e desacoplar a aplicação do TypeORM com as repositories.

Cada recurso da aplicação tem uma usecase com a lógica e seus respectivos testes unitários. Basicamente as services servem mais como ponte entre a lógica do domínio e a interface da aplicação (API).

## Como rodar a aplicação

##### - Clone o projeto
```bash
git clone https://github.com/filiperv7/desafio-gen-backend
```

##### - Acesse a pasta do projeto
```bash
cd desafio-gen-backend
```

##### - Faça a instalação dos pacotes

```bash
npm install
```

##### - Crie um arquivo .env na raiz do projeto
###### O arquivo deve ter as seguintes variáveis:

_PORT_ (a porta onde a aplicação vai rodar, 6001, por exemplo)

_JWT_SECRET_ (alguma string ou hash que sisva de secret para a criação dos tokens JWT)

##### - Rode a aplicação

```bash
# development
npm run start

# watch mode
npm run start:dev
```

##### E pronto! A aplicação já está rodando
Agora é só acessar http://localhost:6001/graphql para ter acesso ao Sandbox do Apollo GraphQL e fazer as requisição

##### Para rodar os testes

```bash
# unit tests
 npm run test
```

