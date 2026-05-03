import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuscaBinaria() {
  return (
    <PageContainer
      title={"Busca binária sem off-by-one"}
      subtitle={"Parece simples, mas Knuth disse que muito programador leva anos pra acertar a primeira vez. Vamos ver os 3 invariantes."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`int busca(int *v, size_t n, int alvo) {
    size_t lo = 0, hi = n;          // [lo, hi)
    while (lo < hi) {
        size_t mid = lo + (hi - lo) / 2;   // evita overflow
        if      (v[mid] == alvo) return (int)mid;
        else if (v[mid] <  alvo) lo = mid + 1;
        else                     hi = mid;
    }
    return -1;
}`}
      />

      <AlertBox type="warning" title={"(lo + hi) / 2 estoura"}>
        <p>Em arrays gigantes, somar duas posições pode passar de <code>SIZE_MAX</code>. Sempre use <code>lo + (hi - lo) / 2</code>.</p>
      </AlertBox>

      <h2>lower_bound: primeira posição &gt;= alvo</h2>

      <CodeBlock
        language="c"
        code={`size_t lower_bound(int *v, size_t n, int alvo) {
    size_t lo = 0, hi = n;
    while (lo < hi) {
        size_t mid = lo + (hi - lo) / 2;
        if (v[mid] < alvo) lo = mid + 1;
        else               hi = mid;
    }
    return lo;   // pode ser n (alvo > todos)
}`}
      />

      <h2>bsearch da libc</h2>

      <CodeBlock
        language="c"
        code={`int cmp(const void *a, const void *b) { return *(int*)a - *(int*)b; }
int *r = bsearch(&alvo, v, n, sizeof(int), cmp);`}
      />
    </PageContainer>
  );
}
