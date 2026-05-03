import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Quicksort() {
  return (
    <PageContainer
      title={"Quicksort"}
      subtitle={"O(n log n) em média, in-place, e o algoritmo por trás de `qsort` da libc na maioria das implementações."}
      difficulty={"avancado"}
      timeToRead={"12 min"}
    >
      <CodeBlock
        language="c"
        code={`static void troca(int *a, int *b) { int t = *a; *a = *b; *b = t; }

static int particiona(int *v, int lo, int hi) {
    int pivo = v[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (v[j] < pivo) troca(&v[++i], &v[j]);
    troca(&v[i+1], &v[hi]);
    return i + 1;
}

void quicksort(int *v, int lo, int hi) {
    if (lo >= hi) return;
    int p = particiona(v, lo, hi);
    quicksort(v, lo, p - 1);
    quicksort(v, p + 1, hi);
}`}
      />

      <AlertBox type="warning" title={"Pior caso O(n²)"}>
        <p>Com pivô ruim (já ordenado e pivô = último), vira O(n²). Estratégias: pivô aleatório, mediana de três, ou trocar pra heapsort se profundidade passa de 2log n (introsort).</p>
      </AlertBox>

      <h2>qsort da libc</h2>

      <CodeBlock
        language="c"
        code={`int cmp(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);   // evita overflow de x - y
}
qsort(v, n, sizeof(int), cmp);`}
      />
    </PageContainer>
  );
}
