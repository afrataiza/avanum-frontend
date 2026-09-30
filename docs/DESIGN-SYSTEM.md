# Design System do Avanum

O Design System traduz o baseline aprovado no Figma em tokens e componentes reutilizáveis.

## Fonte de verdade

O arquivo oficial do Figma é a referência visual. O frontend deve reproduzir os padrões existentes antes de criar novas variações.

## Tokens

### Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `surface` | `#121416` | fundo principal |
| `surface-elevated` | `#1A201F` | cards e elementos elevados |
| `surface-muted` | `#222A27` | inputs, tracks e áreas secundárias |
| `border` | `#2A3330` | bordas e divisores |
| `content` | `#E8E0CF` | texto principal |
| `content-muted` | `#A9ACA5` | texto secundário |
| `content-accent-muted` | `#687B68` | labels auxiliares |
| `accent` | `#C8A96B` | destaque principal |
| `accent-border` | `rgba(200,169,107,0.4)` | bordas de destaque |

### Tipografia

- Inter: interface funcional, metadados, números, estados e controles.
- Cormorant Garamond: títulos, nomes de livros, branding e elementos editoriais.
- Pesos Inter: 400, 500, 600, 700.
- Pesos Cormorant Garamond: 600, 700.

Escala observada no Figma: 32, 28, 22, 20, 18, 15, 14, 13, 12, 11, 10, 9 e 7px.

### Espaçamento

A escala recorrente é 4, 8, 12, 16 e 24px. Telas principais usam 24px de padding horizontal.

### Raios

- 8px: elementos pequenos.
- 12px: botões e inputs.
- 16px: cards principais.
- 20–24px: avatares.
- 999px: pills.
- 32px não é raio genérico de componente; pertence ao frame do dispositivo no Figma.

## Primitivas

As primitivas ficam em `src/components/ui`:

- `Button`
- `Card`
- `Input`
- `Badge`
- `Progress`
- `Divider`
- `Avatar`
- `EloraMessage`
- `FeedbackState`

Cada componente aceita propriedades e/ou `className` para composição sem duplicar a base visual.

## Regras de implementação

1. Não criar novas cores fora dos tokens sem decisão explícita.
2. Não adicionar gradientes decorativos ou sombras genéricas.
3. Não substituir a linguagem de ícones do Figma por emojis.
4. Preferir composição de primitivas a estilos específicos repetidos em páginas.
5. Estados de loading, empty, error e disabled devem reutilizar a mesma linguagem visual.
6. Validar visualmente contra o Figma antes de considerar um componente pronto.
