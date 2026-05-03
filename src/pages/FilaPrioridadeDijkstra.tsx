import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FilaPrioridadeDijkstra() {
  return (
    <PageContainer
      title={"Dijkstra com heap"}
      subtitle={"Caminho mais curto num grafo ponderado: junta heap + lista de adjacência num algoritmo de 30 linhas."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        title="dijkstra.c"
        code={`// Pré: Aresta e adj[] como na página de grafos
// dist[v] = distância mínima de origem até v
void dijkstra(int origem, int n, int *dist) {
    for (int i = 0; i < n; i++) dist[i] = INT_MAX;
    dist[origem] = 0;
    Heap pq = {0};
    push(&pq, (origem << 16) | 0);   // empacota: nó nos 16 altos, dist nos baixos

    while (pq.n) {
        int top = pop(&pq);
        int u  = top >> 16;
        int d  = top & 0xFFFF;
        if (d > dist[u]) continue;   // entrada obsoleta
        for (Aresta *a = adj[u]; a; a = a->prox) {
            int nd = d + a->peso;
            if (nd < dist[a->destino]) {
                dist[a->destino] = nd;
                push(&pq, (a->destino << 16) | nd);
            }
        }
    }
}`}
      />

      <AlertBox type="warning" title={"Não funciona com pesos negativos"}>
        <p>Se houver aresta de peso negativo, Dijkstra dá resposta errada. Use Bellman-Ford (O(VE)) ou SPFA.</p>
      </AlertBox>

      <h2>Variantes</h2>

      <ul>
        <li>A*: Dijkstra + heurística pra ir reto pro destino.</li>
        <li>Bidirecional: rode dos dois lados, pare quando se encontrarem.</li>
        <li>Floyd-Warshall: todas-as-distâncias em O(V³).</li>
      </ul>
    </PageContainer>
  );
}
