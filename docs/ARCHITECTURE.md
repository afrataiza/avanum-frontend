# Arquitetura inicial

## Objetivo

O frontend do Avanum será uma aplicação React + Vite + TypeScript, construída mobile-first e alinhada visualmente ao arquivo oficial do Figma.

## Princípios

- Figma é a fonte de verdade visual.
- Componentes reutilizáveis devem concentrar padrões compartilhados.
- Integrações externas ficam isoladas em `src/lib` e em serviços por domínio.
- Telas e regras de negócio não devem criar chamadas diretas ao backend de forma espalhada.
- Variáveis públicas de runtime usam o prefixo `VITE_`.
- Nenhum segredo deve ser versionado no repositório.

## Estrutura inicial

```text
src/
├── app/          # composição da aplicação e providers
├── components/   # componentes reutilizáveis
├── features/     # módulos organizados por domínio de produto
├── lib/          # integrações e utilitários técnicos
├── pages/        # páginas/rotas da aplicação
├── styles/       # estilos globais e tokens
└── types/        # tipos compartilhados
```

A estrutura será expandida conforme os cards seguintes forem implementados; não criar abstrações antecipadamente sem necessidade real.
