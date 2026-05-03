import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HeapPriority() {
  return (
    <PageContainer
      title={"Heap binário (priority queue)"}
      subtitle={"Árvore num array, inserir e extrair em O(log n). Base de Dijkstra, A*, top-K e schedulers."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <p>Min-heap: pai sempre &le; filhos. Armazenado em array, filhos de <code>i</code> são <code>2i+1</code> e <code>2i+2</code>.</p>

      <CodeBlock
        language="c"
        title="minheap.c"
        code={`typedef struct {
    int   *a;
    size_t n, cap;
} Heap;

static void troca(int *x, int *y) { int t = *x; *x = *y; *y = t; }

void push(Heap *h, int v) {
    if (h->n == h->cap) {
        h->cap = h->cap ? h->cap * 2 : 16;
        h->a = realloc(h->a, h->cap * sizeof(int));
    }
    size_t i = h->n++;
    h->a[i] = v;
    while (i > 0) {
        size_t pai = (i - 1) / 2;
        if (h->a[pai] <= h->a[i]) break;
        troca(&h->a[pai], &h->a[i]);
        i = pai;
    }
}

int pop(Heap *h) {
    int min = h->a[0];
    h->a[0] = h->a[--h->n];
    size_t i = 0;
    for (;;) {
        size_t l = 2*i+1, r = 2*i+2, menor = i;
        if (l < h->n && h->a[l] < h->a[menor]) menor = l;
        if (r < h->n && h->a[r] < h->a[menor]) menor = r;
        if (menor == i) break;
        troca(&h->a[i], &h->a[menor]);
        i = menor;
    }
    return min;
}`}
      />

      <h2>Heapsort</h2>

      <p>Empurra todos no heap, depois extrai um por um — sai ordenado em O(n log n) sem espaço extra (se fizer in-place no array original).</p>

      <AlertBox type="info" title={"Heap ≠ heap de memória"}>
        <p>O nome é coincidência. "Heap" como estrutura de dados é a árvore acima. "Heap" de memória é a região onde <code>malloc</code> aloca. Não confunda.</p>
      </AlertBox>
    </PageContainer>
  );
}
