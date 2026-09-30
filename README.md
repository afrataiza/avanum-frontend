# Avanum Frontend

Frontend do Avanum, diário de leitura gamificado.

A implementação visual segue o arquivo oficial do Figma como fonte de verdade e consome o backend consolidado do projeto.

## Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS 4
- Supabase JS
- ESLint
- Prettier
- GitHub Actions

## Pré-requisitos

- Node.js 20.19+ (recomendado: Node.js 22 LTS)
- npm

## Setup

```bash
npm install
cp .env.example .env.local
```

Preencha as variáveis do Supabase em `.env.local` quando for necessário executar funcionalidades que dependem do backend.

## Desenvolvimento

```bash
npm run dev
```

## Validações

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Ou execute tudo:

```bash
npm run check
```

## Variáveis de ambiente

Somente valores públicos podem ser expostos ao frontend por meio de `VITE_*`.

| Variável                        | Uso                             |
| ------------------------------- | ------------------------------- |
| `VITE_SUPABASE_URL`             | URL pública do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave publicável do Supabase    |

Segredos, service role keys e credenciais privadas não devem ser adicionados ao frontend.

## Arquitetura

Consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Figma

O frontend deve reproduzir o baseline aprovado no arquivo oficial do projeto. Mudanças de UX ou layout devem ser discutidas antes de serem incorporadas.

## Branches

O trabalho usa o identificador da tarefa Jira no nome da branch, por exemplo:

```text
ATSA-23
```

Pull requests usam o padrão:

```text
[ATSA-23] Descrição da mudança
```
