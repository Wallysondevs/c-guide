import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HashTable() {
  return (
    <PageContainer
      title={"Hash table"}
      subtitle={"O dicionário que faz busca em O(1) amortizado. Como escolher função de hash e resolver colisões."}
      difficulty={"avancado"}
      timeToRead={"14 min"}
    >
      <h2>FNV-1a: um hash bom o suficiente</h2>

      <CodeBlock
        language="c"
        code={`uint32_t fnv1a(const char *s) {
    uint32_t h = 2166136261u;
    while (*s) { h ^= (uint8_t)*s++; h *= 16777619u; }
    return h;
}`}
      />

      <h2>Tabela com chaining</h2>

      <CodeBlock
        language="c"
        code={`typedef struct Entry {
    char *chave;
    int   valor;
    struct Entry *prox;
} Entry;

#define N 1024
Entry *tab[N] = {0};

void set(const char *k, int v) {
    uint32_t h = fnv1a(k) % N;
    for (Entry *e = tab[h]; e; e = e->prox)
        if (strcmp(e->chave, k) == 0) { e->valor = v; return; }
    Entry *e = malloc(sizeof *e);
    e->chave = strdup(k);
    e->valor = v;
    e->prox  = tab[h];
    tab[h]   = e;
}

int get(const char *k, int *out) {
    for (Entry *e = tab[fnv1a(k) % N]; e; e = e->prox)
        if (strcmp(e->chave, k) == 0) { *out = e->valor; return 1; }
    return 0;
}`}
      />

      <h2>Open addressing (linear probing)</h2>

      <p>Sem listas: colisão pula pra próxima posição. Mais cache-friendly, mas precisa rehash quando carga &gt; ~70%.</p>

      <AlertBox type="warning" title={"Resize é obrigatório"}>
        <p>Se a tabela ficar cheia, performance cai pra O(n). Sempre dobre o tamanho quando <code>n / cap &gt; 0.75</code> e refaça hash de tudo.</p>
      </AlertBox>
    </PageContainer>
  );
}
