import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mergesort() {
  return (
    <PageContainer
      title={"Mergesort"}
      subtitle={"O(n log n) garantido, estável, mas precisa O(n) de memória extra. O sort que você implementa no whiteboard."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        code={`static void merge(int *v, int lo, int mid, int hi, int *buf) {
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi)
        buf[k++] = (v[i] <= v[j]) ? v[i++] : v[j++];
    while (i <= mid) buf[k++] = v[i++];
    while (j <= hi)  buf[k++] = v[j++];
    for (k = lo; k <= hi; k++) v[k] = buf[k];
}

static void rec(int *v, int lo, int hi, int *buf) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    rec(v, lo, mid, buf);
    rec(v, mid + 1, hi, buf);
    merge(v, lo, mid, hi, buf);
}

void mergesort(int *v, int n) {
    int *buf = malloc(n * sizeof *buf);
    rec(v, 0, n - 1, buf);
    free(buf);
}`}
      />

      <h2>Versão bottom-up (sem recursão)</h2>

      <CodeBlock
        language="c"
        code={`for (int tam = 1; tam < n; tam *= 2)
    for (int lo = 0; lo + tam < n; lo += 2*tam) {
        int mid = lo + tam - 1;
        int hi  = (lo + 2*tam - 1 < n) ? lo + 2*tam - 1 : n - 1;
        merge(v, lo, mid, hi, buf);
    }`}
      />

      <AlertBox type="info" title={"Estável = preserva ordem de iguais"}>
        <p>Se dois elementos têm a mesma chave, mergesort mantém a ordem original. Quicksort não. Importa quando você ordena por múltiplas chaves em sequência.</p>
      </AlertBox>
    </PageContainer>
  );
}
