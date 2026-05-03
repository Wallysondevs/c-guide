import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Recursao() {
  return (
    <PageContainer
      title={"Recursão e backtracking"}
      subtitle={"Quando dividir-pra-conquistar simplifica tudo: torres de Hanói, N-rainhas, geração de combinações."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <h2>Fatorial e Fibonacci (clássicos)</h2>

      <CodeBlock
        language="c"
        code={`unsigned long fat(unsigned n) {
    return n <= 1 ? 1 : n * fat(n - 1);
}

unsigned long fib(unsigned n) {
    if (n < 2) return n;
    return fib(n-1) + fib(n-2);   // O(2^n) — péssimo, use DP!
}`}
      />

      <h2>Backtracking: N-rainhas</h2>

      <CodeBlock
        language="c"
        code={`int solucoes = 0;
int coluna_de[20];

int conflita(int linha) {
    for (int i = 0; i < linha; i++) {
        if (coluna_de[i] == coluna_de[linha]) return 1;
        if (abs(coluna_de[i] - coluna_de[linha]) == linha - i) return 1;
    }
    return 0;
}

void resolve(int linha, int n) {
    if (linha == n) { solucoes++; return; }
    for (int c = 0; c < n; c++) {
        coluna_de[linha] = c;
        if (!conflita(linha)) resolve(linha + 1, n);
    }
}`}
      />

      <AlertBox type="warning" title={"Stack overflow"}>
        <p>Recursão profunda demais (10⁵+ chamadas) estoura a stack. Converta pra iterativo com pilha explícita ou aumente RLIMIT_STACK.</p>
      </AlertBox>

      <h2>Memoização: Fibonacci O(n)</h2>

      <CodeBlock
        language="c"
        code={`unsigned long memo[100] = {0};
unsigned long fib(unsigned n) {
    if (n < 2) return n;
    if (memo[n]) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}`}
      />
    </PageContainer>
  );
}
