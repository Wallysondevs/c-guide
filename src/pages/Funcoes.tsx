import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Funcoes() {
  return (
    <PageContainer
      title="Funções"
      subtitle="Funções organizam o código em peças reusáveis. Em C, elas são simples — mas a passagem por valor (sempre!) e a ordem de declaração geram dúvidas que vamos esclarecer aqui."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <h2>Anatomia</h2>
      <CodeBlock
        language="c"
        code={`/* tipo_retorno  nome  (parâmetros) { corpo } */

int soma(int a, int b) {
    return a + b;
}

/* Sem retorno — use void */
void saudar(const char *nome) {
    printf("Olá, %s!\\n", nome);
}

/* Sem parâmetros — use void na assinatura (importante!) */
int main(void) { ... }

/* main pode receber argumentos da linha de comando */
int main(int argc, char *argv[]) { ... }`}
      />

      <AlertBox type="warning" title="int func() ≠ int func(void)">
        <code>int f()</code> em C antigo significa "qualquer
        número/tipo de argumentos". <code>int f(void)</code> diz
        explicitamente "nenhum argumento". Use SEMPRE
        <code> void </code> pra evitar surpresas (em C23 isso foi
        finalmente unificado, mas seu código talvez compile em C99).
      </AlertBox>

      <h2>Protótipos — declarar ANTES de usar</h2>
      <p>
        C compila o arquivo de cima pra baixo. Se a função
        <code> a </code> chama <code>b</code> que está declarada
        depois, o compilador reclama. Solução: declarar o
        <strong> protótipo </strong> antes.
      </p>

      <BeforeAfter
        beforeLabel="❌ Sem protótipo — warning"
        afterLabel="✅ Com protótipo no topo"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int main(void) {
    int r = dobrar(5);
    return 0;
}

int dobrar(int x) {
    return x * 2;
}

/* warning: implicit
   declaration of dobrar */`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int dobrar(int x);    // protótipo

int main(void) {
    int r = dobrar(5);
    return 0;
}

int dobrar(int x) {
    return x * 2;
}`}
          </pre>
        }
      />

      <p>
        Em projetos grandes, os protótipos vão pro arquivo
        <code> .h </code> (cabeçalho) — vamos cobrir isso no capítulo
        de Headers.
      </p>

      <h2>Passagem por VALOR (sempre)</h2>
      <p>
        Em C, parâmetros são <strong>cópias</strong>. A função recebe
        um valor novo, e modificar dentro dela não afeta a variável
        original.
      </p>
      <CodeBlock
        language="c"
        code={`void mudar(int x) {
    x = 999;       // muda só a CÓPIA local
}

int main(void) {
    int n = 5;
    mudar(n);
    printf("%d\\n", n);    // 5 (não mudou)
}`}
      />

      <h2>Pra modificar de fato — passe um PONTEIRO</h2>
      <CodeBlock
        language="c"
        code={`void mudar(int *x) {
    *x = 999;       // dereferência: muda o valor APONTADO
}

int main(void) {
    int n = 5;
    mudar(&n);              // passa o ENDEREÇO
    printf("%d\\n", n);     // 999 (mudou!)
}`}
      />

      <p>
        Esse padrão se chama "passagem por referência simulada". É a
        única forma de uma função modificar variáveis de quem chama.
        Vamos ver muito mais disso nos capítulos de ponteiros.
      </p>

      <h2>Retorno múltiplo — via ponteiros</h2>
      <CodeBlock
        language="c"
        code={`/* C não tem tuple, mas dá pra retornar múltiplos via "saída por ponteiro" */
void dividir(int a, int b, int *quociente, int *resto) {
    *quociente = a / b;
    *resto = a % b;
}

int main(void) {
    int q, r;
    dividir(17, 5, &q, &r);
    printf("%d resto %d\\n", q, r);   // 3 resto 2
}

/* Convenção: parâmetros de saída vão por ÚLTIMO */`}
      />

      <h2>Retorno por struct (alternativa moderna)</h2>
      <CodeBlock
        language="c"
        code={`typedef struct { int q, r; } DivRes;

DivRes dividir(int a, int b) {
    return (DivRes){ a / b, a % b };   // C99: compound literal
}

int main(void) {
    DivRes d = dividir(17, 5);
    printf("%d resto %d\\n", d.q, d.r);
}`}
      />

      <h2>Recursão</h2>
      <CodeBlock
        language="c"
        code={`int fatorial(int n) {
    if (n <= 1) return 1;          // caso base
    return n * fatorial(n - 1);    // chamada recursiva
}

/* Cada chamada empilha um frame na stack.
   Recursão profunda demais → stack overflow.
   Pra fatorial de 5: 5 frames. Pra Fibonacci ingênuo de 40: bilhões. */`}
      />

      <AlertBox type="danger" title="Recursão tem limite (stack)">
        A stack tem ~8MB por padrão no Linux. Cada frame tem alguns
        bytes. Recursão "infinita" (sem caso base) ou muito profunda
        (calcular Fibonacci(50) ingênuo) crasha. Pra esses casos,
        prefira loops ou recursão de cauda quando o compilador
        otimiza (-O2).
      </AlertBox>

      <h2>Funções inline (C99+)</h2>
      <CodeBlock
        language="c"
        code={`/* Sugere ao compilador "cole o corpo da função onde for chamada"
   evitando o custo da chamada — útil pra funções pequenas e quentes */

static inline int max(int a, int b) {
    return a > b ? a : b;
}

/* "static inline" no .h é o padrão moderno pra helpers */`}
      />

      <h2>Funções variádicas — número variável de argumentos</h2>
      <CodeBlock
        language="c"
        code={`#include <stdarg.h>

int soma(int n, ...) {
    va_list args;
    va_start(args, n);

    int total = 0;
    for (int i = 0; i < n; i++) {
        total += va_arg(args, int);     // pega próximo, dizendo o tipo
    }

    va_end(args);
    return total;
}

int main(void) {
    printf("%d\\n", soma(3, 10, 20, 30));   // 60
}

/* Quem usa isso: printf, scanf, fprintf...
   Use POUCO em código próprio — fácil de errar tipo. */`}
      />

      <h2>Argumentos da linha de comando</h2>
      <CodeBlock
        language="c"
        title="echo.c"
        code={`#include <stdio.h>

int main(int argc, char *argv[]) {
    /* argc = quantos argumentos (incluindo nome do programa)
       argv = vetor de strings (argv[0] = nome do programa) */

    for (int i = 1; i < argc; i++) {
        printf("%s ", argv[i]);
    }
    printf("\\n");
    return 0;
}

/* gcc echo.c -o echo
   ./echo oi mundo
   → oi mundo */`}
      />

      <h2>Boas práticas</h2>
      <ul>
        <li><strong>Funções curtas</strong> — uma função, uma responsabilidade. Se passa de 50 linhas, considere quebrar.</li>
        <li><strong>Nomes verbais</strong> — <code>calcular_total</code>, <code>imprimir_relatorio</code>. Adjetivos pra "predicados": <code>esta_vazio</code>, <code>eh_par</code>.</li>
        <li><strong>const em parâmetros</strong> — <code>void f(const char *s)</code> documenta "não modifico".</li>
        <li><strong>Funções privadas — declare static</strong> — só visíveis dentro do .c (mais sobre isso no capítulo de escopo).</li>
        <li><strong>Sempre retorne — se for void, pode omitir; se não, todo caminho deve ter return</strong> (compile com <code>-Wreturn-type</code>).</li>
      </ul>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Anatomia */
int soma(int a, int b) { return a + b; }
void  imprimir(const char *s) { printf("%s\\n", s); }
int main(int argc, char *argv[]) { ... }

/* Protótipo (declara antes de usar) */
int dobrar(int x);

/* Passagem por valor (cópia) */
void f(int x) { x = 99; }      // não muda fora

/* "Passagem por referência" via ponteiro */
void f(int *x) { *x = 99; }    // muda lá fora

/* Inline pra hot path */
static inline int max(int a, int b) { return a > b ? a : b; }

/* Variádicas (raro fazer, comum usar) */
#include <stdarg.h>
int f(int n, ...) { va_list ap; va_start(ap, n); ... va_end(ap); }`}
      />
    </PageContainer>
  );
}
