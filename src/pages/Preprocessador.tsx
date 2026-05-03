import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Preprocessador() {
  return (
    <PageContainer
      title="Pré-processador"
      subtitle="Antes da compilação acontecer, o pré-processador (cpp) trata todas as linhas que começam com #. Ele faz substituições de texto puras — poderoso e perigoso ao mesmo tempo."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>O que ele faz</h2>
      <CodeBlock
        language="text"
        code={`hello.c
   ↓
[pré-processador]
   - resolve #include
   - substitui #define
   - avalia #if / #ifdef / #ifndef
   - remove comentários
   - une linhas terminadas em \\
   ↓
hello.i (código C "puro")
   ↓
[compilador]`}
      />

      <p>Pra ver o resultado:</p>
      <CodeBlock
        language="bash"
        code={`gcc -E hello.c -o hello.i
# Veja como hello.c (5 linhas) vira hello.i (~800 linhas)
# por causa do #include <stdio.h>`}
      />

      <h2>#include — colar arquivo aqui</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>      /* ângulos: bibliotecas do SISTEMA */
#include "meu.h"        /* aspas: arquivos LOCAIS (busca primeiro no diretório atual) */`}
      />

      <h2>#define — substituição de texto</h2>
      <CodeBlock
        language="c"
        code={`#define PI 3.14159
#define MAX_BUF 1024
#define ENTRADA "/dev/input"

/* Antes de compilar, todo PI vira 3.14159 */
double area = PI * raio * raio;`}
      />

      <h2>const vs #define</h2>
      <BeforeAfter
        beforeLabel="❌ #define — substituição cega"
        afterLabel="✅ const — tem TIPO"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`#define MAX 100
#define PI  3.14

// sem tipo, debug ruim
// sem escopo (vale tudo)
// erros confusos`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`const int    MAX = 100;
const double PI  = 3.14;

// tipo conhecido
// escopo respeitado
// debugger mostra valor`}
          </pre>
        }
      />

      <p>
        Em C moderno, prefira <code>const</code> pra valores. Use
        <code> #define </code> pra: macros funcionais, includes
        condicionais, configuração via <code>-D</code>.
      </p>

      <h2>Macros funcionais (com argumentos)</h2>
      <CodeBlock
        language="c"
        code={`#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define ABS(x)    ((x) < 0 ? -(x) : (x))

int m = MAX(5, 10);     // vira: ((5) > (10) ? (5) : (10))`}
      />

      <AlertBox type="danger" title="SEMPRE PARÊNTESES (de fora E em cada arg)">
        <BeforeAfter
          beforeLabel="❌ Sem parênteses"
          afterLabel="✅ Com parênteses"
          before={
            <pre className="text-xs text-slate-700 leading-relaxed">
              {`#define SQR(x) x*x

SQR(2+3)
// vira: 2+3*2+3 = 11
// (queria 25)`}
            </pre>
          }
          after={
            <pre className="text-xs text-slate-700 leading-relaxed">
              {`#define SQR(x) ((x)*(x))

SQR(2+3)
// vira: ((2+3)*(2+3))
// = 25 ✅`}
            </pre>
          }
        />
      </AlertBox>

      <h2>O perigo dos efeitos colaterais</h2>
      <CodeBlock
        language="c"
        code={`#define MAX(a, b) ((a) > (b) ? (a) : (b))

int i = 0;
int m = MAX(i++, 10);     // i++ é avaliada DUAS vezes!
                          // resultado IMPREVISÍVEL`}
      />

      <p>
        Em C, prefira <strong>função inline</strong> sempre que
        possível — tem tipo, avalia args só uma vez, e o compilador
        inlina igual:
      </p>
      <CodeBlock
        language="c"
        code={`static inline int max(int a, int b) {
    return a > b ? a : b;
}

int m = max(i++, 10);    // i++ avalia UMA vez, sem surpresa`}
      />

      <h2>Compilação condicional — #ifdef / #if / #else</h2>
      <CodeBlock
        language="c"
        code={`#ifdef DEBUG
    printf("debug: x = %d\\n", x);
#endif

#ifndef NDEBUG          /* "se NDEBUG NÃO está definido" */
    assert(x > 0);
#endif

#if defined(__linux__)
    /* código pra Linux */
#elif defined(_WIN32)
    /* código pra Windows */
#elif defined(__APPLE__)
    /* código pra macOS */
#else
    #error "Plataforma não suportada"
#endif`}
      />

      <p>Definir do compilador (sem tocar no código):</p>
      <CodeBlock
        language="bash"
        code={`gcc -DDEBUG=1 -DVERSION=2 main.c -o main

# Equivale a colocar no topo:
#define DEBUG 1
#define VERSION 2`}
      />

      <h2>Macros multi-linha — barra invertida</h2>
      <CodeBlock
        language="c"
        code={`#define LOG(fmt, ...) do { \\
    fprintf(stderr, "[%s:%d] ", __FILE__, __LINE__); \\
    fprintf(stderr, fmt, __VA_ARGS__); \\
    fprintf(stderr, "\\n"); \\
} while (0)

LOG("x = %d, y = %d", x, y);

/* Por que do { ... } while (0)?
   Pra macro virar UMA "instrução" — funciona certo dentro de if/else sem chaves: */

if (cond)
    LOG("oi", 1);     // ok mesmo sem chaves
else
    ...`}
      />

      <h2>Macros variádicas (C99)</h2>
      <CodeBlock
        language="c"
        code={`#define LOG(fmt, ...) printf(fmt, __VA_ARGS__)

LOG("oi %s\\n", "mundo");
LOG("n = %d\\n", 42);

/* Em C99, precisa de PELO MENOS 1 argumento depois do fmt.
   Em GCC/Clang, '##__VA_ARGS__' permite zero. C23 padronizou: */

#define LOG(fmt, ...) printf(fmt __VA_OPT__(,) __VA_ARGS__)
LOG("oi");      // OK em C23
LOG("oi %s", "mundo");`}
      />

      <h2>Stringification (#) e Concatenation (##)</h2>
      <CodeBlock
        language="c"
        code={`#define STR(x) #x
#define CONCAT(a, b) a##b

const char *s = STR(hello world);   // "hello world"

int xy = 42;
int valor = CONCAT(x, y);           // == xy == 42`}
      />

      <h2>Macros úteis predefinidas</h2>
      <CodeBlock
        language="c"
        code={`__FILE__         // nome do arquivo (string)
__LINE__         // número da linha (int)
__func__         // nome da função atual (C99) — NÃO é macro, é "__func__"
__DATE__         // data da compilação ("Nov  3 2024")
__TIME__         // hora ("12:34:56")
__STDC__         // 1 se compilador segue padrão C
__STDC_VERSION__ // 199901L (C99), 201112L (C11), 201710L (C17), 202311L (C23)`}
      />

      <CodeBlock
        language="c"
        code={`/* Padrão de assert customizado */
#define ASSERT(cond) do { \\
    if (!(cond)) { \\
        fprintf(stderr, "Assertion failed: %s\\n  at %s:%d in %s()\\n", \\
                #cond, __FILE__, __LINE__, __func__); \\
        abort(); \\
    } \\
} while (0)`}
      />

      <h2>X-Macros — truque pra evitar duplicação</h2>
      <CodeBlock
        language="c"
        code={`/* Quer manter um enum + array de strings em sincronia? */
#define CORES \\
    X(VERMELHO) \\
    X(VERDE) \\
    X(AZUL)

typedef enum {
    #define X(c) c,
    CORES
    #undef X
} Cor;

const char *nome_cor[] = {
    #define X(c) #c,
    CORES
    #undef X
};

/* Adicionar uma cor nova: muda 1 linha (em CORES), atualiza ambos */`}
      />

      <h2>Quando NÃO usar macro</h2>
      <ul>
        <li><strong>Pra função simples</strong> → use <code>static inline</code>.</li>
        <li><strong>Pra constante de valor</strong> → use <code>const</code> ou <code>enum</code>.</li>
        <li><strong>Pra "encurtar" tipo</strong> → use <code>typedef</code>.</li>
      </ul>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Includes */
#include <stdio.h>      /* sistema */
#include "meu.h"        /* local */

/* Constantes — prefira const, mas #define ainda comum */
#define MAX 1024
const int MAX = 1024;

/* Macros funcionais — sempre parênteses */
#define MAX(a, b) ((a) > (b) ? (a) : (b))

/* Multi-linha — \\ e do {} while(0) */
#define LOG(...) do { ... } while (0)

/* Compilação condicional */
#ifdef / #ifndef / #if defined(...) / #else / #endif

/* Predefinidas */
__FILE__  __LINE__  __func__  __DATE__  __STDC_VERSION__

/* Macros variádicas */
#define LOG(fmt, ...) printf(fmt, __VA_ARGS__)

/* Use POUCO macro funcional. Use MUITO #include e #ifdef */`}
      />
    </PageContainer>
  );
}
