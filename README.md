# Figma Plugin Template

Base para criar plugins do Figma com o Claude Code já configurado: as skills certas, o código inicial que compila e as versões que funcionam juntas.

## O que vem pronto

- Um plugin mínimo que funciona: adiciona um prefixo ao nome das layers selecionadas. Serve de exemplo de mensagens tipadas entre `main` e `ui`, configurações salvas e uma UI feita só com a biblioteca.
- Stack: [create-figma-plugin](https://yuanqing.github.io/create-figma-plugin/) v4, `@create-figma-plugin/ui`, Preact 10 e TypeScript 5.
- Skills do Claude Code em `.claude/skills/`:

| Skill | Para quê |
|---|---|
| `figma-plugin-orchestrator` | Ponto de entrada. Conduz do briefing ao plugin rodando e chama as outras skills |
| `figma-plugin-dev` | Arquitetura, eventos main/ui, Plugin API, manifest e as pegadinhas da API |
| `figma-plugin-ui-design` | Filosofia da frontend-design adaptada a plugins, regra de usar a biblioteca primeiro e catálogo de componentes v4 |
| `context7` | Busca a documentação atualizada das bibliotecas |
| `figma-use` | Skill oficial do Figma para mexer em arquivos via Figma MCP (montar arquivos de teste, conferir resultados) |
| `find-skills` | Procura outras skills quando o plugin precisa de algo novo |
| `frontend-design` | A original da Anthropic, mantida como referência |
| `skill-creator` | Para criar e testar skills novas |

## Começando um plugin novo

1. Copie esta pasta (ou use como template no GitHub) e abra no VS Code.
2. Em `package.json`, troque `name` e `description` e, dentro de `"figma-plugin"`, troque `name` e `id`. Durante o desenvolvimento o `id` só precisa ser único; o Figma gera o definitivo quando você publica.
3. Rode:
   ```bash
   npm install
   npm run watch
   ```
4. No Figma desktop: **Plugins → Development → Import plugin from manifest…** e escolha o `manifest.json` desta pasta. Depois rode o plugin em **Plugins → Development**.
5. Peça ao Claude o que o plugin deve fazer, por exemplo: "quero um plugin que encontra textos sem estilo e aplica o mais próximo". A skill orquestradora assume a partir daí.

## Context7

O Claude usa primeiro o MCP do Context7, se ele estiver conectado. A skill `context7` é o plano B e precisa de Python instalado. Para ela funcionar sem o MCP:

```bash
cp .claude/skills/context7/.env.example .claude/skills/context7/.env
```

Depois coloque sua chave em `CONTEXT7_API_KEY`. O `.env` está no `.gitignore` e nunca vai para o repositório.

## Onde ficam as skills

Todas as skills ficam como pastas normais em `.claude/skills/`, então funcionam logo depois de clonar. As skills de terceiros (`frontend-design`, `skill-creator`, `figma-use`, `find-skills`) estão registradas no `skills-lock.json` e podem ser atualizadas com `npx skills update`. Já as `figma-plugin-*` e a `context7` são deste template, e você as edita direto.

## Versões fixadas

- `preact` em 10.x: os tipos do `@create-figma-plugin/ui` 4.0.3 não funcionam com o Preact 11.
- `typescript` em 5.x: o `build-figma-plugin --typecheck` quebra com o TypeScript 7.

Teste o build antes de subir qualquer uma dessas versões.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run watch` | Recompila a cada alteração |
| `npm run build` | Checa os tipos, minifica e gera o `manifest.json` |
| `npm run lint` | Só checa os tipos |
