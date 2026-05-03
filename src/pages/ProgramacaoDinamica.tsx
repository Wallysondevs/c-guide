import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProgramacaoDinamica() {
  return (
    <PageContainer
      title={"Programação dinâmica"}
      subtitle={"Knapsack, LIS, edit distance. Reconhecer subproblemas que se repetem e cachear."}
      difficulty={"avancado"}
      timeToRead={"13 min"}
    >
      <h2>Knapsack 0/1</h2>

      <CodeBlock
        language="c"
        code={`int knapsack(int n, int W, int *peso, int *valor) {
    int **dp = calloc(n+1, sizeof *dp);
    for (int i = 0; i <= n; i++) dp[i] = calloc(W+1, sizeof **dp);
    for (int i = 1; i <= n; i++)
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (peso[i-1] <= w) {
                int alt = dp[i-1][w - peso[i-1]] + valor[i-1];
                if (alt > dp[i][w]) dp[i][w] = alt;
            }
        }
    int r = dp[n][W];
    for (int i = 0; i <= n; i++) free(dp[i]);
    free(dp);
    return r;
}`}
      />

      <h2>Distância de edição (Levenshtein)</h2>

      <CodeBlock
        language="c"
        code={`int edit(const char *a, const char *b) {
    int n = strlen(a), m = strlen(b);
    int dp[n+1][m+1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            int sub = dp[i-1][j-1] + (a[i-1] != b[j-1]);
            int ins = dp[i][j-1] + 1;
            int del = dp[i-1][j] + 1;
            dp[i][j] = sub < ins ? (sub < del ? sub : del) : (ins < del ? ins : del);
        }
    return dp[n][m];
}`}
      />

      <AlertBox type="info" title={"Otimização: rolling array"}>
        <p>Quase toda DP 2D só usa a linha anterior — reduza pra O(min(n,m)) memória usando dois arrays alternados.</p>
      </AlertBox>
    </PageContainer>
  );
}
