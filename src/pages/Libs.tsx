import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Libs() {
  return (
    <PageContainer
      title="math, time, ctype, stdint, stdbool"
      subtitle="As bibliotecas que você acaba usando em quase todo programa, mesmo sem perceber. Resumo rápido de cada uma — funções essenciais e armadilhas."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <h2>&lt;math.h&gt; — funções matemáticas</h2>
      <AlertBox type="warning" title="Lembre do -lm ao linkar">
        Funções de math.h vivem na <code>libm</code>, não na libc.
        Compile com <code>gcc app.c -o app -lm</code> — senão o
        linker reclama "undefined reference to sqrt".
      </AlertBox>

      <CodeBlock
        language="c"
        code={`#include <math.h>

/* Básicas */
sqrt(x)       /* raiz quadrada */
pow(x, y)     /* x^y */
exp(x)        /* e^x */
log(x)        /* ln(x) */
log10(x)      /* log base 10 */
log2(x)       /* log base 2 */
fabs(x)       /* valor absoluto pra DOUBLE (não confundir com abs() de int) */

/* Trigonometria (radianos) */
sin(x), cos(x), tan(x)
asin(x), acos(x), atan(x)
atan2(y, x)   /* arco-tangente preservando quadrante */

/* Arredondamento */
floor(x)      /* maior int <= x */
ceil(x)       /* menor int >= x */
round(x)      /* arredondamento simétrico */
trunc(x)      /* trunca pra 0 */
fmod(x, y)    /* resto da divisão (pra double — % só funciona com int) */

/* Constantes (extensão GNU; não no padrão) */
M_PI, M_E, M_SQRT2

/* Padrão: defina você mesmo */
#define PI 3.14159265358979323846`}
      />

      <h2>Detectar valores especiais</h2>
      <CodeBlock
        language="c"
        code={`#include <math.h>

isnan(x)       /* x é NaN? */
isinf(x)       /* x é infinito? */
isfinite(x)    /* não é NaN nem inf? */

/* NaN aparece em: 0.0/0.0, sqrt(-1), log(-1) */
double nan = 0.0/0.0;
if (isnan(nan)) printf("é NaN\\n");

/* nan != nan SEMPRE — única forma de testar é com isnan() */
if (x != x) { /* funciona, mas isnan(x) é mais claro */ }`}
      />

      <h2>&lt;time.h&gt; — tempo</h2>
      <CodeBlock
        language="c"
        code={`#include <time.h>

/* Tempo unix (segundos desde 1970) */
time_t agora = time(NULL);
printf("%ld\\n", (long)agora);

/* Pra string legível */
char buf[64];
struct tm *t = localtime(&agora);
strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", t);
printf("%s\\n", buf);            // 2025-05-03 14:30:00

/* Componentes individuais */
printf("ano=%d mês=%d dia=%d\\n",
       t->tm_year + 1900,         // anos desde 1900!
       t->tm_mon + 1,             // 0-11
       t->tm_mday);

/* Diferença entre dois tempos */
time_t inicio = time(NULL);
fazer_algo();
time_t fim = time(NULL);
printf("levou %.0f segundos\\n", difftime(fim, inicio));`}
      />

      <h2>Tempo de alta resolução</h2>
      <CodeBlock
        language="c"
        code={`/* Pra benchmark — em segundos com casas decimais */
clock_t inicio = clock();
fazer_calculo();
clock_t fim = clock();
double s = (double)(fim - inicio) / CLOCKS_PER_SEC;
printf("%.3f s\\n", s);

/* C11: ainda mais preciso (nanossegundos) */
struct timespec t0, t1;
timespec_get(&t0, TIME_UTC);
fazer_calculo();
timespec_get(&t1, TIME_UTC);
long ns = (t1.tv_sec - t0.tv_sec) * 1000000000L +
          (t1.tv_nsec - t0.tv_nsec);
printf("%ld ns\\n", ns);`}
      />

      <h2>&lt;ctype.h&gt; — caracteres</h2>
      <CodeBlock
        language="c"
        code={`#include <ctype.h>

/* Testes (retornam int: != 0 = sim, 0 = não) */
isalpha(c)     /* letra */
isdigit(c)     /* dígito 0-9 */
isalnum(c)     /* letra ou dígito */
isspace(c)     /* whitespace ( \\t \\n \\r etc.) */
isupper(c)     /* maiúscula */
islower(c)     /* minúscula */
ispunct(c)     /* pontuação */
isxdigit(c)    /* hex digit (0-9, a-f, A-F) */
iscntrl(c)     /* controle (não imprimível) */
isprint(c)     /* imprimível (incluindo espaço) */

/* Conversão */
toupper(c)
tolower(c)`}
      />

      <AlertBox type="danger" title="SEMPRE cast pra unsigned char">
        <pre className="text-xs mt-2">{`char c = ...;
isalpha(c);                        // ❌ UB se c < 0 (acentos!)
isalpha((unsigned char)c);         // ✅ correto`}</pre>
        <code>ctype.h</code> recebe <code>int</code> mas só aceita
        valores 0-255 ou EOF. Char com sinal pode passar negativo.
      </AlertBox>

      <h2>&lt;stdint.h&gt; — tipos com tamanho EXATO</h2>
      <CodeBlock
        language="c"
        code={`#include <stdint.h>

int8_t   int16_t   int32_t   int64_t        /* signed */
uint8_t  uint16_t  uint32_t  uint64_t       /* unsigned */

/* Garantia: tamanho EXATO em qualquer arquitetura */
uint32_t timestamp;
int64_t  contador;

/* "Pelo menos N bits" — se exatos não disponíveis */
int_least16_t  /* >= 16 bits */
int_fast32_t   /* >= 32, do tipo MAIS RÁPIDO */

/* Limites */
INT32_MAX, UINT64_MAX, ...

/* Pra ponteiros como inteiros */
intptr_t p = (intptr_t)ptr;
uintptr_t u = (uintptr_t)ptr;`}
      />

      <h2>&lt;inttypes.h&gt; — printar stdint</h2>
      <CodeBlock
        language="c"
        code={`#include <inttypes.h>

int64_t  big = 1234567890123;
uint32_t u   = 42;

printf("%" PRId64 "\\n", big);       // expande pra "%lld" ou "%ld"
printf("%" PRIu32 "\\n", u);         // expande pra "%u"

/* Macros: PRId8/16/32/64, PRIu8/16/32/64, PRIx8/16/32/64 */`}
      />

      <h2>&lt;stdbool.h&gt; — bool nativo</h2>
      <CodeBlock
        language="c"
        code={`#include <stdbool.h>

bool ok = true;
bool falhou = false;

if (ok) { ... }

/* Internamente é só um inteiro (1 byte), mas legibilidade aumenta. */

/* Em C23, bool, true, false viraram keywords nativos
   — não precisa mais de #include <stdbool.h>. */`}
      />

      <h2>&lt;assert.h&gt; — checagens em debug</h2>
      <CodeBlock
        language="c"
        code={`#include <assert.h>

void dividir(int a, int b) {
    assert(b != 0);     /* se falso → printa msg e abort() */
    /* ... */
}

/* Compilar com -DNDEBUG remove TODOS os asserts:
   gcc -DNDEBUG release.c -o release
   Use pra checagens "que não devem acontecer NUNCA". */

/* C11: _Static_assert pra checagem em COMPILE TIME */
_Static_assert(sizeof(int) == 4, "preciso de int 32-bit");`}
      />

      <h2>&lt;errno.h&gt; — erros do sistema</h2>
      <CodeBlock
        language="c"
        code={`#include <errno.h>
#include <string.h>

FILE *f = fopen("inexistente.txt", "r");
if (!f) {
    printf("erro %d: %s\\n", errno, strerror(errno));
    // erro 2: No such file or directory
}

/* Códigos comuns */
ENOENT     /* No such file or directory */
EACCES     /* Permission denied */
EINVAL     /* Invalid argument */
EAGAIN     /* Resource temporarily unavailable */
EINTR      /* Interrupted system call */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`<math.h>     sqrt, pow, sin, log, floor, ceil, isnan
             COMPILE COM -lm

<time.h>     time(), localtime(), strftime("%Y-%m-%d", t)
             clock() / timespec_get pra benchmark

<ctype.h>    isalpha, isdigit, toupper
             SEMPRE (unsigned char)c antes

<stdint.h>   int32_t, uint64_t, intptr_t — tamanho exato
<inttypes.h> printf("%" PRId64, x)

<stdbool.h>  bool / true / false (em C23 vira built-in)

<assert.h>   assert(cond)         — runtime
             _Static_assert       — compile time

<errno.h>    errno + strerror(errno)`}
      />
    </PageContainer>
  );
}
