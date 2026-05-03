import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Trie() {
  return (
    <PageContainer
      title={"Trie (árvore de prefixos)"}
      subtitle={"Dicionário onde a chave é distribuída char a char. Autocomplete, busca por prefixo, dicionários ortográficos."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        code={`#define ABC 26
typedef struct No {
    struct No *filhos[ABC];
    int fim_palavra;
} No;

No *novo(void) {
    No *n = calloc(1, sizeof *n);
    return n;
}

void inserir(No *raiz, const char *s) {
    No *p = raiz;
    for (; *s; s++) {
        int i = *s - 'a';
        if (!p->filhos[i]) p->filhos[i] = novo();
        p = p->filhos[i];
    }
    p->fim_palavra = 1;
}

int contem(No *raiz, const char *s) {
    No *p = raiz;
    for (; *s; s++) {
        int i = *s - 'a';
        if (!p->filhos[i]) return 0;
        p = p->filhos[i];
    }
    return p->fim_palavra;
}`}
      />

      <p>Busca em O(L) onde L é o tamanho da palavra. Independe do tamanho do dicionário.</p>

      <h2>Autocomplete</h2>

      <CodeBlock
        language="c"
        code={`// caminhe até o nó do prefixo, depois DFS coletando todas as palavras
void coletar(No *p, char *buf, int prof) {
    if (p->fim_palavra) { buf[prof] = 0; puts(buf); }
    for (int i = 0; i < ABC; i++)
        if (p->filhos[i]) {
            buf[prof] = 'a' + i;
            coletar(p->filhos[i], buf, prof + 1);
        }
}`}
      />

      <AlertBox type="info" title={"Variantes"}>
        <p>Pra UTF-8 ou alfabetos grandes, troque <code>filhos[26]</code> por hash table ou nó com lista ordenada de filhos. Veja também: Radix tree (Patricia), DAWG (acyclic minimized).</p>
      </AlertBox>
    </PageContainer>
  );
}
