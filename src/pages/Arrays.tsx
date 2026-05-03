import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Arrays() {
  return (
    <PageContainer
      title="Arrays"
      subtitle="Em C, array é uma sequência contígua de bytes — nada mais. Sem método length, sem checagem de bounds, e que VAI virar ponteiro na primeira oportunidade. Vamos desmistificar."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>Declarando e inicializando</h2>
      <CodeBlock
        language="c"
        code={`/* Tamanho fixo, valor LIXO */
int arr[10];

/* Inicializado parcialmente — resto é ZERO */
int arr[10] = {1, 2, 3};       // {1,2,3,0,0,0,0,0,0,0}

/* Tudo zero (idiom comum) */
int arr[10] = {0};

/* Compilador deduz tamanho */
int arr[] = {1, 2, 3, 4, 5};   // tamanho = 5

/* Designated initializers (C99) */
int dias[12] = {
    [0] = 31, [1] = 28, [2] = 31, [3] = 30, [4] = 31, [5] = 30,
    [6] = 31, [7] = 31, [8] = 30, [9] = 31, [10] = 30, [11] = 31
};`}
      />

      <h2>Acesso e tamanho</h2>
      <CodeBlock
        language="c"
        code={`int arr[5] = {10, 20, 30, 40, 50};

arr[0]                    // primeiro elemento (10)
arr[4]                    // último elemento (50)
arr[5]                    // ⚠ FORA dos bounds — UB!

/* Quantos elementos? */
size_t n = sizeof(arr) / sizeof(arr[0]);   // 5

/* Macro padrão (use em projetos seus) */
#define ARRAY_SIZE(a) (sizeof(a) / sizeof((a)[0]))
size_t n = ARRAY_SIZE(arr);`}
      />

      <AlertBox type="danger" title="Não tem checagem de bounds">
        <code>arr[100]</code> de um array de 10 elementos não dá
        erro de compilação NEM de runtime — só corrompe memória
        adjacente, gerando bug intermitente em local distante. Use
        <code> -fsanitize=address </code> em debug pra detectar.
      </AlertBox>

      <h2>Loops sobre array</h2>
      <CodeBlock
        language="c"
        code={`int arr[5] = {10, 20, 30, 40, 50};

for (size_t i = 0; i < ARRAY_SIZE(arr); i++) {
    printf("%d\\n", arr[i]);
}

/* Padrão pra somar */
int total = 0;
for (size_t i = 0; i < ARRAY_SIZE(arr); i++) {
    total += arr[i];
}`}
      />

      <h2>Array decai pra ponteiro (importantíssimo)</h2>
      <p>
        Quando você passa um array pra função, na verdade está
        passando o <strong>endereço do primeiro elemento</strong>.
        Dentro da função, o "array" é um ponteiro — e
        <code> sizeof </code> retorna o tamanho do PONTEIRO, não do
        array.
      </p>

      <BeforeAfter
        beforeLabel="❌ sizeof dentro da função"
        afterLabel="✅ Passe o tamanho explicitamente"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`void imprimir(int arr[]) {
    size_t n = sizeof(arr)
             / sizeof(arr[0]);
    // n = 8/4 = 2
    // (sizeof de PONTEIRO!)
    for (size_t i=0; i<n; i++) ...
}`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`void imprimir(int *arr,
              size_t n) {
    for (size_t i=0; i<n; i++)
        printf("%d\\n", arr[i]);
}

imprimir(arr, ARRAY_SIZE(arr));`}
          </pre>
        }
      />

      <CodeBlock
        language="c"
        code={`/* Estas três assinaturas são EQUIVALENTES em C: */
void f(int arr[10]);     // o '10' é IGNORADO
void f(int arr[]);       // forma comum
void f(int *arr);        // o que REALMENTE acontece`}
      />

      <h2>Arrays multidimensionais</h2>
      <CodeBlock
        language="c"
        code={`/* Matriz 3x4 (3 linhas, 4 colunas) */
int matriz[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

matriz[1][2]                  // 7

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        printf("%d ", matriz[i][j]);
    }
    printf("\\n");
}

/* Em memória estão CONTÍGUOS — linha por linha (row-major):
   1 2 3 4 | 5 6 7 8 | 9 10 11 12 */`}
      />

      <h2>Passar matriz pra função (chato)</h2>
      <CodeBlock
        language="c"
        code={`/* PRECISA dar pelo menos as dimensões SECUNDÁRIAS (em C99 dá menos) */
void imprimir(int m[][4], int linhas) {
    for (int i = 0; i < linhas; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%d ", m[i][j]);
        }
        printf("\\n");
    }
}

/* C99 permite VLA na assinatura — mais flexível */
void imprimir(int linhas, int colunas, int m[linhas][colunas]) {
    for (int i = 0; i < linhas; i++)
        for (int j = 0; j < colunas; j++)
            printf("%d ", m[i][j]);
}`}
      />

      <h2>Variable Length Array (VLA) — C99</h2>
      <CodeBlock
        language="c"
        code={`void f(int n) {
    int arr[n];           // tamanho dinâmico em RUNTIME, mas vive na STACK!
    /* ... */
}

/* Vantagem: sem precisar de malloc.
   Desvantagem: stack pequena (~8MB) — 'n' grande = stack overflow.
   Em C11+ ficou OPCIONAL — alguns compiladores não suportam.
   Padrão moderno: prefira malloc pra arrays dinâmicos. */`}
      />

      <h2>Inicialização total a zero (truques)</h2>
      <CodeBlock
        language="c"
        code={`int arr[100] = {0};                  // todos os 100 = 0

char buf[256] = "";                  // todos = '\\0'

#include <string.h>
memset(arr, 0, sizeof(arr));         // explícito, funciona pra struct também
memset(arr, 0xFF, sizeof(arr));      // todos -1 (cuidado: byte a byte!)`}
      />

      <h2>Strings são arrays de char</h2>
      <CodeBlock
        language="c"
        code={`char saudacao[] = "olá";        // {'o','l','á','\\0'} — TAMANHO 4 (com NUL!)

/* Equivalente */
char saudacao[4] = {'o','l','á','\\0'};

/* Não esqueça do '\\0' final — strings em C precisam dele */`}
      />
      <p>Mais sobre strings no próximo capítulo.</p>

      <h2>Exemplo do mundo real: tabuleiro de xadrez 8×8</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>
#include <string.h>

#define N 8

int main(void) {
    char tabuleiro[N][N];
    memset(tabuleiro, '.', sizeof(tabuleiro));

    /* Coloca peças iniciais (simplificado) */
    for (int j = 0; j < N; j++) {
        tabuleiro[1][j] = 'p';   // peões pretos
        tabuleiro[6][j] = 'P';   // peões brancos
    }

    /* Imprime */
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%c ", tabuleiro[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`}
      />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="danger" title="Off-by-one">
        Array de N elementos vai de <code>arr[0]</code> a
        <code> arr[N-1]</code>. Loop deve ser
        <code> for (i = 0; i &lt; N; i++)</code>, NUNCA
        <code> &lt;=</code>.
      </AlertBox>

      <AlertBox type="warning" title="VLA não é portátil">
        Em C11+ é opcional. MSVC nunca suportou. Pra código portátil,
        use <code>malloc</code> ou tamanho fixo.
      </AlertBox>

      <AlertBox type="warning" title="Array NÃO é atribuível">
        <code>arr1 = arr2;</code> não compila. Use <code>memcpy</code>:
        <pre className="text-xs mt-2">{`memcpy(dest, src, sizeof(src));`}</pre>
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Declarar */
int arr[10];                       // lixo
int arr[10] = {0};                 // tudo 0
int arr[]  = {1, 2, 3};            // tamanho = 3

/* Tamanho */
size_t n = sizeof(arr) / sizeof(arr[0]);   // só funciona NO escopo onde foi declarado!

/* Acesso */
arr[i]    /* SEM checagem de bounds */

/* Passar pra função */
void f(int *arr, size_t n);    // SEMPRE passe o tamanho

/* Multidimensional */
int m[3][4];   m[i][j];        // contíguo em memória (row-major)

/* Inicialização */
memset(arr, 0, sizeof(arr));
char buf[256] = "";

/* Cuidado */
sizeof dentro de função = tamanho do PONTEIRO
arr[N] em array de N = UB`}
      />
    </PageContainer>
  );
}
