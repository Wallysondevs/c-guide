import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SortsBasicos() {
  return (
    <PageContainer
      title={"Sorts O(n²)"}
      subtitle={"Bubble, insertion, selection. Lentos em grandes, mas insertion é o segredo de quicksorts otimizados em pequenos."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <h2>Bubble sort</h2>

      <CodeBlock
        language="c"
        code={`void bubble(int *v, size_t n) {
    for (size_t i = 0; i + 1 < n; i++) {
        int trocou = 0;
        for (size_t j = 0; j + 1 < n - i; j++)
            if (v[j] > v[j+1]) { int t = v[j]; v[j] = v[j+1]; v[j+1] = t; trocou = 1; }
        if (!trocou) return;
    }
}`}
      />

      <h2>Insertion sort</h2>

      <CodeBlock
        language="c"
        code={`void insertion(int *v, size_t n) {
    for (size_t i = 1; i < n; i++) {
        int x = v[i];
        size_t j = i;
        while (j > 0 && v[j-1] > x) { v[j] = v[j-1]; j--; }
        v[j] = x;
    }
}`}
      />

      <h2>Selection sort</h2>

      <CodeBlock
        language="c"
        code={`void selection(int *v, size_t n) {
    for (size_t i = 0; i < n; i++) {
        size_t menor = i;
        for (size_t j = i+1; j < n; j++)
            if (v[j] < v[menor]) menor = j;
        int t = v[i]; v[i] = v[menor]; v[menor] = t;
    }
}`}
      />

      <AlertBox type="info" title={"Insertion não é só pra brincar"}>
        <p>É O(n) em arrays quase ordenados, e sorts profissionais (Timsort, introsort) trocam pra insertion quando o sub-array fica pequeno (~16 elementos).</p>
      </AlertBox>
    </PageContainer>
  );
}
