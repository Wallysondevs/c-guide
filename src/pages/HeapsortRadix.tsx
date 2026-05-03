import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function HeapsortRadix() {
  return (
    <PageContainer
      title={"Heapsort, counting e radix"}
      subtitle={"Sorts especiais: heapsort O(n log n) sem memória extra, counting/radix O(n) para inteiros pequenos."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <h2>Heapsort</h2>

      <p>Constrói max-heap no array, depois extrai do fim pra trás. In-place, O(n log n) garantido.</p>

      <CodeBlock
        language="c"
        code={`static void sift_down(int *v, int i, int n) {
    for (;;) {
        int l = 2*i+1, r = 2*i+2, maior = i;
        if (l < n && v[l] > v[maior]) maior = l;
        if (r < n && v[r] > v[maior]) maior = r;
        if (maior == i) return;
        int t = v[i]; v[i] = v[maior]; v[maior] = t;
        i = maior;
    }
}

void heapsort(int *v, int n) {
    for (int i = n/2 - 1; i >= 0; i--) sift_down(v, i, n);
    for (int i = n - 1; i > 0; i--) {
        int t = v[0]; v[0] = v[i]; v[i] = t;
        sift_down(v, 0, i);
    }
}`}
      />

      <h2>Counting sort</h2>

      <CodeBlock
        language="c"
        code={`void counting(int *v, int n, int max) {
    int *cnt = calloc(max + 1, sizeof *cnt);
    for (int i = 0; i < n; i++) cnt[v[i]]++;
    for (int i = 0, k = 0; i <= max; i++)
        while (cnt[i]--) v[k++] = i;
    free(cnt);
}`}
      />

      <p>O(n + max). Imbatível pra inteiros num intervalo pequeno.</p>

      <h2>Radix sort (LSD)</h2>

      <CodeBlock
        language="c"
        code={`// ordena por dígito menos significativo até o mais significativo
for (int exp = 1; max / exp > 0; exp *= 10) counting_por_digito(v, n, exp);`}
      />
    </PageContainer>
  );
}
