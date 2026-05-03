import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Moderno() {
  return (
    <PageContainer
      title="C Moderno — C11, C17, C23"
      subtitle="Os padrões pós-C99 trouxeram mudanças que tornam C significativamente menos perigoso e mais expressivo. Se você só conhece K&R, prepara: tem coisa nova e útil."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <h2>C11 (2011) — A grande virada</h2>

      <h3>_Static_assert — checagem em compile time</h3>
      <CodeBlock
        language="c"
        code={`_Static_assert(sizeof(int) == 4, "preciso de int 32-bit");
_Static_assert(sizeof(void*) >= 8, "só funciona em 64-bit");

struct Pacote { uint8_t tipo; uint16_t tam; uint32_t crc; };
_Static_assert(sizeof(struct Pacote) == 8, "header não pode ter padding");

/* Em C23 virou simplesmente: static_assert (sem underscore) */`}
      />

      <h3>_Generic — type-generic dispatch</h3>
      <CodeBlock
        language="c"
        code={`/* Macro que escolhe a função certa baseada no TIPO */
#define abs(x) _Generic((x), \\
    int:    abs,    \\
    long:   labs,   \\
    long long: llabs, \\
    float:  fabsf,  \\
    double: fabs    \\
)(x)

abs(-5)        // chama abs(int)
abs(-5L)       // chama labs(long)
abs(-5.0)      // chama fabs(double)

/* Foi isso que permitiu o tgmath.h funcionar de verdade
   (math automático pro tipo certo) */`}
      />

      <h3>Anonymous structs/unions</h3>
      <CodeBlock
        language="c"
        code={`/* Pré-C11: precisava nomear */
struct Antigo {
    int tag;
    union { int i; float f; } valor;     // .valor.i, .valor.f
};

/* C11: pode omitir o nome */
struct Moderno {
    int tag;
    union { int i; float f; };           // .i direto, .f direto
};

struct Moderno m = { .tag = 1, .i = 42 };`}
      />

      <h3>Threads e atômicos</h3>
      <CodeBlock
        language="c"
        code={`/* C11 padronizou — antes você dependia de pthread (POSIX) ou Win32 */

#include <threads.h>
thrd_t t;
thrd_create(&t, minha_funcao, NULL);
thrd_join(t, NULL);

#include <stdatomic.h>
atomic_int contador = 0;
atomic_fetch_add(&contador, 1);

/* (Capítulo dedicado a seguir) */`}
      />

      <h3>aligned_alloc</h3>
      <CodeBlock
        language="c"
        code={`/* Aloca memória ALINHADA — útil pra SIMD, GPU, hardware */
#include <stdlib.h>

void *p = aligned_alloc(64, 1024);    // 1024 bytes alinhados a 64
free(p);`}
      />

      <h3>noreturn</h3>
      <CodeBlock
        language="c"
        code={`#include <stdnoreturn.h>

noreturn void erro_fatal(const char *msg) {
    fprintf(stderr, "FATAL: %s\\n", msg);
    abort();
}

/* Compilador agora SABE que essa função não retorna —
   pode otimizar e silenciar warnings de "fluxo não retorna". */

/* Em C23 virou atributo: [[noreturn]] */`}
      />

      <h3>Removidas em C11</h3>
      <ul>
        <li><code>gets()</code> — REMOVIDA do padrão (era buffer overflow garantido).</li>
        <li>VLAs viraram OPCIONAIS (compiladores podem não suportar).</li>
      </ul>

      <h2>C17 (2018) — Bug-fix release</h2>
      <p>
        C17 não trouxe features novas. Só correções e clarificações
        do C11. Pode usar <code>-std=c17</code> sem medo —
        praticamente igual a C11.
      </p>

      <h2>C23 (2024) — Modernização forte</h2>

      <h3>nullptr — keyword pra ponteiro nulo</h3>
      <CodeBlock
        language="c"
        code={`/* Antes (e ainda válido) */
int *p = NULL;        // NULL é macro: ((void*)0) ou 0

/* C23 */
int *p = nullptr;     // tem TIPO próprio (nullptr_t) — type-safe

/* Diferença prática: */
void f(int x);
void f(char *s);
f(NULL);              // ambíguo (NULL pode ser 0)
f(nullptr);           // chama f(char*) — sem dúvida`}
      />

      <h3>true / false / bool nativos</h3>
      <CodeBlock
        language="c"
        code={`/* C23 — sem precisar de #include <stdbool.h> */
bool ok = true;
bool falhou = false;`}
      />

      <h3>typeof — tipo de uma expressão</h3>
      <CodeBlock
        language="c"
        code={`int x = 10;
typeof(x) y = 20;     // y também é int

/* Macros que preservam tipo */
#define swap(a, b) do { typeof(a) tmp = (a); (a) = (b); (b) = tmp; } while (0)

int  i = 1, j = 2;
double d1 = 1.0, d2 = 2.0;
swap(i, j);
swap(d1, d2);

/* GCC já tinha __typeof__ há décadas — agora é padrão */`}
      />

      <h3>Atributos no estilo [[…]]</h3>
      <CodeBlock
        language="c"
        code={`/* C23 — sintaxe oficial */
[[nodiscard]] int calcular(int x);
[[deprecated("use foo() em vez")]] void bar(void);
[[noreturn]] void erro_fatal(const char *msg);
[[maybe_unused]] int debug_var;

switch (x) {
    case 1:
        algo();
        [[fallthrough]];
    case 2:
        outra_coisa();
        break;
}

/* Substituem __attribute__((noreturn)) etc. do GCC */`}
      />

      <h3>Constantes binárias</h3>
      <CodeBlock
        language="c"
        code={`int mascara = 0b1010'1100;     // C23 oficial — antes era extensão GCC
                               // o ' é separador de dígitos`}
      />

      <h3>auto — inferência de tipo (estilo C++)</h3>
      <CodeBlock
        language="c"
        code={`auto x = 42;          // x deduzido como int
auto d = 3.14;        // double
auto s = "oi";        // const char *

/* Em C clássico, 'auto' era uma storage class quase sem uso.
   Em C23 ganhou novo significado: inferência de tipo. */`}
      />

      <h3>#embed — incluir arquivo binário no source</h3>
      <CodeBlock
        language="c"
        code={`/* Sem precisar de xxd, ld -r, ou scripts */
const unsigned char logo_png[] = {
    #embed "logo.png"
};

const size_t logo_size = sizeof(logo_png);

/* Antes você fazia: xxd -i logo.png > logo.h
   Agora: 1 linha de código padrão. */`}
      />

      <h3>constexpr</h3>
      <CodeBlock
        language="c"
        code={`/* Garante que o valor é uma constante de compilação */
constexpr int MAX = 1024;
constexpr double PI = 3.14159;

/* Pode usar em arrays de tamanho fixo, case labels, etc. */
int arr[MAX];

/* Mais expressivo que #define MAX 1024 — tem TIPO. */`}
      />

      <h3>Nomes de membros designated em compound literals</h3>
      <CodeBlock
        language="c"
        code={`struct Ponto { int x, y; };

struct Ponto p = { .x = 1, .y = 2 };          // C99
struct Ponto p = (struct Ponto){ .x = 1, .y = 2 };   // C99 também (compound literal)`}
      />

      <h3>Outras melhorias C23</h3>
      <ul>
        <li><code>memccpy</code>, <code>strdup</code>, <code>strndup</code> finalmente no padrão.</li>
        <li><code>printf("%b", ...)</code> — formato binário.</li>
        <li>UTF-8 strings literais (<code>u8"..."</code>) com tipo <code>char8_t</code>.</li>
        <li>Comentários de delimitador (<code>// ...</code>) sempre aceitos (já era em C99).</li>
        <li>Funções com parênteses vazios <code>f()</code> finalmente significam <code>f(void)</code>.</li>
      </ul>

      <h2>Como ativar cada padrão no compilador</h2>
      <CodeBlock
        language="bash"
        code={`gcc -std=c89   prog.c     # ANSI C clássico
gcc -std=c99   prog.c     # // comments, VLAs, designated init, stdint
gcc -std=c11   prog.c     # threads, _Generic, _Static_assert, anon union
gcc -std=c17   prog.c     # = c11 + bug fixes
gcc -std=c23   prog.c     # nullptr, typeof, [[attrs]], #embed, auto, constexpr

# Sufixo "gnu":
gcc -std=gnu11 prog.c     # padrão + extensões GNU (typeof antigo, expr stmts)`}
      />

      <h2>O que usar HOJE?</h2>
      <ul>
        <li><strong>Projeto novo</strong> — <code>-std=c11</code> ou <code>c17</code>. Suporte universal, ganhos grandes.</li>
        <li><strong>Embarcado / driver</strong> — geralmente C99. Compilador específico do chip pode ser limitado.</li>
        <li><strong>Bleeding edge</strong> — <code>-std=c23</code> em gcc 13+, clang 16+. Ainda em adoção.</li>
        <li><strong>Manter código legacy</strong> — fique em C89/C99 se assim ele já compila.</li>
      </ul>

      <h2>Detectar versão em código</h2>
      <CodeBlock
        language="c"
        code={`#if __STDC_VERSION__ >= 202311L
    /* C23 */
#elif __STDC_VERSION__ >= 201710L
    /* C17 */
#elif __STDC_VERSION__ >= 201112L
    /* C11 */
#elif __STDC_VERSION__ >= 199901L
    /* C99 */
#else
    /* C89 ou indefinido */
#endif`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`C99 (1999)   // comments, VLA, designated init,
             stdint.h, stdbool.h, snprintf, declarações no meio do código

C11 (2011)   _Static_assert, _Generic, anonymous union/struct,
             threads.h, stdatomic.h, aligned_alloc, noreturn,
             gets() REMOVIDA

C17 (2018)   só correções

C23 (2024)   nullptr, true/false/bool nativos, typeof,
             [[attrs]], 0b1010 binários, auto/constexpr,
             #embed, atributos de fallthrough/nodiscard/deprecated

Recomendado HOJE: -std=c11 ou -std=c17 pra portabilidade
                  -std=c23 se sabe que toolchain suporta`}
      />
    </PageContainer>
  );
}
