import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BfsDfs() {
  return (
    <PageContainer
      title={"BFS e DFS aplicados"}
      subtitle={"Detectar ciclo, ordenar topologicamente, contar componentes conexas, encontrar pontes."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <h2>Componentes conexas (DFS)</h2>

      <CodeBlock
        language="c"
        code={`int componentes(int n, int **adj, int *grau) {
    int *visit = calloc(n, sizeof *visit);
    int comp = 0;
    for (int i = 0; i < n; i++) {
        if (!visit[i]) { dfs(i, visit, adj, grau); comp++; }
    }
    free(visit);
    return comp;
}`}
      />

      <h2>Ordenação topológica (DAG)</h2>

      <CodeBlock
        language="c"
        code={`// Kahn: remova nós com grau de entrada 0 em ordem
void topo(int n) {
    int fila[1000], head = 0, tail = 0;
    for (int i = 0; i < n; i++) if (in_deg[i] == 0) fila[tail++] = i;
    while (head < tail) {
        int u = fila[head++];
        printf("%d ", u);
        for (Aresta *a = adj[u]; a; a = a->prox)
            if (--in_deg[a->destino] == 0) fila[tail++] = a->destino;
    }
}`}
      />

      <h2>Detectar ciclo (DFS com cores)</h2>

      <CodeBlock
        language="c"
        code={`// 0 = branco (não visitado), 1 = cinza (na pilha), 2 = preto (fechado)
int tem_ciclo_dfs(int u, int *cor) {
    cor[u] = 1;
    for (Aresta *a = adj[u]; a; a = a->prox) {
        if (cor[a->destino] == 1) return 1;          // back edge
        if (cor[a->destino] == 0 && tem_ciclo_dfs(a->destino, cor)) return 1;
    }
    cor[u] = 2;
    return 0;
}`}
      />

      <AlertBox type="info" title={"BFS = caminho mínimo (não ponderado)"}>
        <p>A camada onde BFS encontra o destino é a distância em arestas. Pra grafos com pesos, vai de Dijkstra.</p>
      </AlertBox>
    </PageContainer>
  );
}
