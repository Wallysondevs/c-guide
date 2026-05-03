import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Memoria() {
  return (
    <PageContainer
      title="Memória Dinâmica"
      subtitle="Stack vs heap. malloc, calloc, realloc, free. Vazamentos, double free, dangling pointers — e como o valgrind te salva. O capítulo que define se você SABE C ou só lê C."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <h2>Stack vs Heap (recapitulando)</h2>
      <CodeBlock
        language="text"
        code={`STACK (variáveis locais)             HEAP (malloc/free)
- automática                          - manual (você gerencia)
- rápida (move ponteiro)              - mais lenta (busca espaço livre)
- pequena (~8MB)                      - grande (gigas)
- vida = duração da função            - vida = até você chamar free
- tamanho fixo em compile time        - tamanho decidido em runtime`}
      />

      <h2>Quando usar heap?</h2>
      <ul>
        <li>Tamanho só conhecido em runtime (input do usuário, arquivo).</li>
        <li>Dado precisa sobreviver à função que criou.</li>
        <li>Estruturas grandes que estouraríam a stack.</li>
        <li>Estruturas linkadas (cada nó alocado separado).</li>
      </ul>

      <h2>malloc — "me dê n bytes"</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>

void *malloc(size_t size);

/* Aloca 100 bytes (sem zerar — contém LIXO) */
char *buf = malloc(100);

/* Aloca 1000 ints */
int *arr = malloc(1000 * sizeof(int));

/* SEMPRE cheque o retorno */
if (arr == NULL) {
    perror("malloc");
    exit(1);
}

/* Use... */
for (int i = 0; i < 1000; i++) arr[i] = i;

/* LIBERE quando terminar */
free(arr);
arr = NULL;     // boa prática: zera depois de free`}
      />

      <h2>calloc — aloca E zera</h2>
      <CodeBlock
        language="c"
        code={`void *calloc(size_t nmemb, size_t size);

/* Aloca espaço pra 1000 ints, todos = 0 */
int *arr = calloc(1000, sizeof(int));

/* Equivalente a: */
int *arr = malloc(1000 * sizeof(int));
if (arr) memset(arr, 0, 1000 * sizeof(int));`}
      />

      <h2>realloc — redimensiona</h2>
      <CodeBlock
        language="c"
        code={`void *realloc(void *ptr, size_t new_size);

/* Cresce ou encolhe (pode mover de lugar!) */
int *arr = malloc(10 * sizeof(int));
arr = realloc(arr, 20 * sizeof(int));     // ⚠ PERIGO se realloc retornar NULL!

/* PADRÃO CERTO */
int *novo = realloc(arr, 20 * sizeof(int));
if (!novo) {
    free(arr);     // arr ainda válido — libere
    return NULL;
}
arr = novo;`}
      />

      <p>
        Casos especiais úteis:
      </p>
      <CodeBlock
        language="c"
        code={`realloc(NULL, n)    /* === malloc(n) */
realloc(p, 0)       /* implementation-defined em C99; UB em C23
                       — não use, prefira free + NULL */`}
      />

      <h2>free — devolve ao heap</h2>
      <CodeBlock
        language="c"
        code={`free(ptr);          // devolve memória alocada
ptr = NULL;         // anula pra evitar uso depois (use-after-free)

/* Regras: */
free(NULL)          /* OK — não faz nada (define no padrão) */
free(p) duas vezes  /* ❌ DOUBLE FREE — UB grave (corrompe heap) */
free(p) onde p NÃO veio de malloc/calloc/realloc → UB`}
      />

      <h2>O ciclo correto: malloc → check → use → free → NULL</h2>
      <CodeBlock
        language="c"
        code={`int *carregar_ids(size_t n) {
    int *ids = malloc(n * sizeof(int));     // 1. alocar
    if (!ids) return NULL;                  // 2. checar

    for (size_t i = 0; i < n; i++) {
        ids[i] = i + 1000;                  // 3. usar
    }
    return ids;     // chamador é dono — DEVE chamar free()
}

int main(void) {
    int *ids = carregar_ids(100);
    if (!ids) return 1;

    /* ... usa ids ... */

    free(ids);                              // 4. liberar
    ids = NULL;                             // 5. anular
    return 0;
}`}
      />

      <h2>Os 4 bugs clássicos de memória</h2>

      <h3>1. Vazamento (memory leak)</h3>
      <BeforeAfter
        beforeLabel="❌ Vazamento — ninguém chama free"
        afterLabel="✅ Sempre libera"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`void f(void) {
    int *p = malloc(100);
    if (!p) return;
    /* usa p */
    return;
    // p morre mas a memória
    // continua ocupada!
}
// chame 1M vezes →
// programa enche a RAM`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`void f(void) {
    int *p = malloc(100);
    if (!p) return;
    /* usa p */
    free(p);
}`}
          </pre>
        }
      />

      <h3>2. Use-after-free</h3>
      <CodeBlock
        language="c"
        code={`char *s = malloc(10);
strcpy(s, "ola");
free(s);
printf("%s\\n", s);     // ❌ UB — memória já devolvida ao alocador
                       //    pode mostrar lixo, crashar, ou (pior) funcionar`}
      />

      <h3>3. Double free</h3>
      <CodeBlock
        language="c"
        code={`free(p);
free(p);     // ❌ UB grave — corrompe estruturas internas do heap

/* PADRÃO seguro */
free(p);
p = NULL;
free(p);     // ✅ ok — free(NULL) é seguro`}
      />

      <h3>4. Buffer overflow</h3>
      <CodeBlock
        language="c"
        code={`char *buf = malloc(10);
strcpy(buf, "string com mais de 10 chars");   // ❌ corrompe heap
                                              //    UB, crash, exploit
free(buf);`}
      />

      <h2>valgrind — sua melhor amiga em C</h2>
      <CodeBlock
        language="bash"
        code={`# Instalar (Ubuntu)
sudo apt install valgrind

# Usar
gcc -g programa.c -o programa
valgrind --leak-check=full --track-origins=yes ./programa

# Saída exemplo:
==12345== Conditional jump or move depends on uninitialised value(s)
==12345==    at 0x...: main (programa.c:42)
==12345==
==12345== HEAP SUMMARY:
==12345==     in use at exit: 100 bytes in 1 blocks
==12345==     definitely lost: 100 bytes in 1 blocks
==12345==        at 0x...: malloc
==12345==        by 0x...: main (programa.c:10)`}
      />

      <h2>AddressSanitizer — alternativa moderna</h2>
      <CodeBlock
        language="bash"
        code={`# Compile com -fsanitize=address (built-in no gcc/clang)
gcc -g -fsanitize=address programa.c -o programa
./programa

# Detecta: use-after-free, double-free, buffer overflow,
# memory leaks, stack-overflow, etc.
# Mais rápido que valgrind, mas binário fica maior. */`}
      />

      <h2>Padrão "ownership"</h2>
      <p>
        Em C não tem RAII (auto cleanup). Você precisa documentar
        QUEM é dono da memória — quem libera. Convenções comuns:
      </p>
      <CodeBlock
        language="c"
        code={`/* Convenção 1: chamador aloca, chamador libera */
void ler_dados(char *buf, size_t n);     // buf é do chamador

/* Convenção 2: função aloca, chamador libera */
char *carregar_arquivo(const char *path);   // chamador deve free()
                                            //    DOCUMENTE NA API!

/* Convenção 3: struct gerencia internamente */
typedef struct { ... } Pessoa;
Pessoa *pessoa_criar(void);
void    pessoa_destruir(Pessoa *p);     // SEMPRE par`}
      />

      <h2>Exemplo prático: ler arquivo inteiro pra string</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>
#include <stdlib.h>

char *ler_arquivo(const char *path) {
    FILE *f = fopen(path, "rb");
    if (!f) return NULL;

    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);

    char *buf = malloc(size + 1);
    if (!buf) { fclose(f); return NULL; }

    fread(buf, 1, size, f);
    buf[size] = '\\0';

    fclose(f);
    return buf;     // chamador faz free()
}

int main(void) {
    char *texto = ler_arquivo("dados.txt");
    if (texto) {
        printf("%s", texto);
        free(texto);
    }
}`}
      />

      <h2>Crescendo um buffer (padrão "geometric growth")</h2>
      <CodeBlock
        language="c"
        code={`/* Buffer dinâmico que dobra de tamanho quando enche */
typedef struct {
    char  *data;
    size_t len;
    size_t cap;
} Vec;

void vec_push(Vec *v, char c) {
    if (v->len >= v->cap) {
        size_t nova = v->cap ? v->cap * 2 : 16;
        char *novo = realloc(v->data, nova);
        if (!novo) { /* trate erro */ return; }
        v->data = novo;
        v->cap = nova;
    }
    v->data[v->len++] = c;
}

void vec_free(Vec *v) {
    free(v->data);
    v->data = NULL;
    v->len = v->cap = 0;
}`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>

void *malloc(n)               // n bytes (lixo)
void *calloc(n, sz)           // n × sz bytes (zerado)
void *realloc(p, n)           // redimensiona (use ponteiro temp!)
void  free(p)                 // libera (free(NULL) é ok)

/* Ciclo */
p = malloc(n);
if (!p) goto cleanup;
... usa p ...
free(p);
p = NULL;

/* Bugs */
- Vazamento  → faltou free
- Use-after-free → use depois de free
- Double free → free(p); free(p);
- Buffer overflow → escreveu > tamanho

/* Ferramentas */
valgrind --leak-check=full ./prog
gcc -fsanitize=address      (mais rápido)

/* Sempre documente OWNERSHIP — quem libera */`}
      />
    </PageContainer>
  );
}
