import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Grafo() {
  return (
    <PageContainer
      title={"Grafos: representação e travessia"}
      subtitle={"Lista de adjacência vs matriz, BFS e DFS, e quando usar qual."}
      difficulty={"avancado"}
      timeToRead={"13 min"}
    >
      <h2>Lista de adjacência</h2>

      <CodeBlock
        language="c"
        code={`typedef struct Aresta {
    int destino;
    int peso;
    struct Aresta *prox;
} Aresta;

Aresta *adj[1000] = {0};

void add(int u, int v, int w) {
    Aresta *a = malloc(sizeof *a);
    a->destino = v; a->peso = w; a->prox = adj[u];
    adj[u] = a;
}`}
      />

      <h2>BFS (caminho mais curto em grafo não-ponderado)</h2>

      <CodeBlock
        language="c"
        code={`void bfs(int origem, int n) {
    int *visit = calloc(n, sizeof *visit);
    int fila[1000], head = 0, tail = 0;
    fila[tail++] = origem;
    visit[origem] = 1;
    while (head < tail) {
        int u = fila[head++];
        printf("%d ", u);
        for (Aresta *a = adj[u]; a; a = a->prox)
            if (!visit[a->destino]) {
                visit[a->destino] = 1;
                fila[tail++] = a->destino;
            }
    }
    free(visit);
}`}
      />

      <h2>DFS (recursivo)</h2>

      <CodeBlock
        language="c"
        code={`void dfs(int u, int *visit) {
    visit[u] = 1;
    printf("%d ", u);
    for (Aresta *a = adj[u]; a; a = a->prox)
        if (!visit[a->destino]) dfs(a->destino, visit);
}`}
      />

      <AlertBox type="info" title={"Lista vs matriz"}>
        <p>Lista de adjacência: O(V+E) memória, ótima pra esparsos. Matriz V×V: O(V²), constante pra checar se aresta existe — boa pra densos ou pequenos.</p>
      </AlertBox>
    </PageContainer>
  );
}
