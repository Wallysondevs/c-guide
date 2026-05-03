import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Stdlib() {
  return (
    <PageContainer
      title="stdlib essencial"
      subtitle="<stdlib.h> tem o canivete suíço do C: alocação, conversão de strings em números, qsort, bsearch, exit, getenv, abort, rand. Vamos ver as funções que aparecem em quase todo programa."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>Memória (revisão)</h2>
      <CodeBlock
        language="c"
        code={`malloc(n)           // n bytes (lixo)
calloc(num, sz)     // num × sz bytes (zero)
realloc(p, n)       // redimensiona
free(p)             // libera (free(NULL) ok)
aligned_alloc(a, n) // C11 — aloca alinhado a 'a' bytes`}
      />

      <h2>Conversão string → número</h2>
      <CodeBlock
        language="c"
        code={`/* Antigas (sem detecção de erro) — EVITE */
int    atoi(const char *s);          // "42abc" → 42 (sem aviso!)
long   atol(const char *s);
double atof(const char *s);

/* Novas — com detecção de erro */
long      strtol (const char *s, char **end, int base);
long long strtoll(const char *s, char **end, int base);
double    strtod (const char *s, char **end);
unsigned long strtoul(const char *s, char **end, int base);

/* Uso recomendado */
char *fim;
errno = 0;
long n = strtol(input, &fim, 10);
if (fim == input)            { /* nada parseado */ }
if (*fim != '\\0')           { /* lixo no fim */ }
if (errno == ERANGE)          { /* overflow */ }`}
      />

      <h2>base em strtol — flexível</h2>
      <CodeBlock
        language="c"
        code={`strtol("42",   NULL, 10)   /* decimal     → 42 */
strtol("2A",   NULL, 16)   /* hex         → 42 */
strtol("0x2A", NULL, 16)   /* aceita 0x   → 42 */
strtol("052",  NULL, 8)    /* octal       → 42 */
strtol("0x2A", NULL, 0)    /* AUTO: 0x→16, 0→8, senão 10 → 42 */`}
      />

      <h2>Aleatório — rand / srand</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>
#include <time.h>

srand((unsigned)time(NULL));     /* semente — uma vez no início */

int x = rand();                  /* 0 .. RAND_MAX (>= 32767) */
int y = rand() % 100;            /* 0..99 (com leve viés) */

/* Pra jogo: ok. Pra criptografia: NÃO USE. Use /dev/urandom ou getrandom() */`}
      />

      <h2>qsort — ordenação genérica</h2>
      <CodeBlock
        language="c"
        code={`void qsort(void *base, size_t n, size_t size,
           int (*compar)(const void*, const void*));

/* Comparador retorna: <0 se a<b, 0 se igual, >0 se a>b */

int cmp_int(const void *a, const void *b) {
    int x = *(const int*)a;
    int y = *(const int*)b;
    return (x > y) - (x < y);    // safe — evita overflow de 'x - y'
}

int v[] = {3, 1, 4, 1, 5, 9, 2, 6};
qsort(v, 8, sizeof(int), cmp_int);
// 1 1 2 3 4 5 6 9`}
      />

      <h2>qsort de strings</h2>
      <CodeBlock
        language="c"
        code={`int cmp_str(const void *a, const void *b) {
    const char *const *pa = a;
    const char *const *pb = b;
    return strcmp(*pa, *pb);
}

const char *frutas[] = { "uva", "banana", "maça" };
qsort(frutas, 3, sizeof(char*), cmp_str);
// banana, maça, uva`}
      />

      <h2>qsort de struct</h2>
      <CodeBlock
        language="c"
        code={`typedef struct { char nome[32]; int idade; } P;

int cmp_idade(const void *a, const void *b) {
    const P *pa = a, *pb = b;
    return (pa->idade > pb->idade) - (pa->idade < pb->idade);
}

P pessoas[] = { {"Ana", 25}, {"Bru", 30}, {"Cris", 22} };
qsort(pessoas, 3, sizeof(P), cmp_idade);
// Cris, Ana, Bru`}
      />

      <h2>bsearch — busca binária (já ordenado!)</h2>
      <CodeBlock
        language="c"
        code={`int v[] = {1, 3, 5, 7, 9, 11};
int chave = 7;

int *r = bsearch(&chave, v, 6, sizeof(int), cmp_int);
if (r) printf("achei na posição %ld\\n", r - v);   // 3
else   printf("não achei\\n");

/* O array PRECISA estar ordenado pelo MESMO comparador. */`}
      />

      <h2>Saída do programa</h2>
      <CodeBlock
        language="c"
        code={`exit(0);          // sai com código 0 = sucesso
exit(1);          // sai com código 1 = erro genérico
exit(EXIT_SUCCESS);   // 0
exit(EXIT_FAILURE);   // 1 (constante padrão)

abort();          // termina IMEDIATO (sem cleanup, sem fclose)
                  // gera core dump → útil pra assert

/* atexit — registra função pra rodar na saída */
void cleanup(void) { fclose(log); }

int main(void) {
    atexit(cleanup);     // chamado quando exit() ou retorno de main
    ...
}

_Exit(0);         // C99 — sai SEM rodar atexit nem flush dos buffers`}
      />

      <h2>Variáveis de ambiente</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>

const char *home = getenv("HOME");
const char *path = getenv("PATH");
if (home) printf("home = %s\\n", home);

setenv("MEU_VAR", "valor", 1);    // 1 = sobrescreve se já existir (POSIX)
unsetenv("MEU_VAR");              // POSIX

/* main pode receber: */
int main(int argc, char *argv[], char *envp[]) {
    for (int i = 0; envp[i]; i++) puts(envp[i]);
}`}
      />

      <h2>Executar comando do shell</h2>
      <CodeBlock
        language="c"
        code={`int system(const char *cmd);

system("ls -la");
system("mkdir -p /tmp/meudir");

int rc = system("git status");
/* rc != 0 → comando falhou ou shell falhou */

/* CUIDADO: passar input do usuário direto = vulnerabilidade
   de injeção de shell. Sempre sanitize ou prefira fork+exec (POSIX). */`}
      />

      <h2>Aritmética: abs, div</h2>
      <CodeBlock
        language="c"
        code={`abs(-5)              /* 5  — int */
labs(-5L)            /* long */
llabs(-5LL)          /* long long */

div_t r = div(17, 5);
r.quot   /* 3 */
r.rem    /* 2 */`}
      />

      <h2>Exemplo prático: ler números do stdin e ordenar</h2>
      <CodeBlock
        language="c"
        title="ordenar.c"
        code={`#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b) {
    int x = *(int*)a, y = *(int*)b;
    return (x > y) - (x < y);
}

int main(void) {
    int  *v = NULL;
    size_t n = 0, cap = 0;
    int  x;

    while (scanf("%d", &x) == 1) {
        if (n >= cap) {
            cap = cap ? cap * 2 : 16;
            int *novo = realloc(v, cap * sizeof(int));
            if (!novo) { free(v); return 1; }
            v = novo;
        }
        v[n++] = x;
    }

    qsort(v, n, sizeof(int), cmp);

    for (size_t i = 0; i < n; i++) printf("%d\\n", v[i]);

    free(v);
    return 0;
}`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>

/* Memória */
malloc, calloc, realloc, free, aligned_alloc

/* String → número (use strtol não atoi) */
long n = strtol(s, &fim, 10);
double d = strtod(s, &fim);

/* Aleatório */
srand((unsigned)time(NULL));
int x = rand() % N;

/* Ordenação / busca */
qsort(arr, n, sizeof(*arr), cmp);
bsearch(&chave, arr, n, sizeof(*arr), cmp);

/* Saída */
exit(EXIT_SUCCESS);
exit(EXIT_FAILURE);
abort();             /* dump core */
atexit(cleanup);     /* hook de saída */

/* Ambiente */
getenv("HOME");
setenv("X", "1", 1);  /* POSIX */

/* Comando */
system("ls");`}
      />
    </PageContainer>
  );
}
