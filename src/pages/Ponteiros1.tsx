import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Ponteiros1() {
  return (
    <PageContainer
      title="Ponteiros — o conceito"
      subtitle="Aqui é onde 90% das pessoas trava em C. Mas a ideia é simples: ponteiro é uma variável que guarda um endereço de memória. Vamos com analogia, diagrama e MUITO exemplo."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>Analogia: o número da casa</h2>
      <p>
        Imagine uma rua: cada casa tem um <strong>número</strong>{" "}
        (endereço) e <strong>moradores</strong> (conteúdo).
      </p>
      <ul>
        <li>Uma <strong>variável normal</strong> é a casa em si — você se refere aos moradores.</li>
        <li>Um <strong>ponteiro</strong> é um pedaço de papel onde você anotou o número da casa.</li>
      </ul>
      <p>
        Com o papel você pode: <strong>ler</strong> quem mora lá, <strong>trocar</strong>{" "}
        os moradores, ou <strong>passar o papel</strong> pra outra pessoa fazer
        o mesmo. O papel é um ponteiro pra casa.
      </p>

      <h2>Sintaxe — três operadores essenciais</h2>
      <CodeBlock
        language="c"
        code={`int  x = 10;        // variável normal: x guarda 10
int *p;             // p é PONTEIRO pra int (ainda não aponta pra nada)

p = &x;             // & = "endereço de" — p agora guarda o endereço de x

printf("%d\\n", x);    // 10  — valor de x
printf("%p\\n", p);    // 0x7ffd4cf0  — endereço guardado em p
printf("%d\\n", *p);   // 10  — * = "valor apontado por" (deref)

*p = 99;            // muda o valor APONTADO por p (== muda x!)
printf("%d\\n", x);    // 99`}
      />

      <h2>Diagrama de memória</h2>
      <CodeBlock
        language="text"
        code={`int x = 10;
int *p = &x;

Endereço      Conteúdo       Variável
+----------+--------------+
| 0x1000   |     10       |  ← x (4 bytes na stack)
+----------+--------------+
| 0x1004   |   0x1000     |  ← p (8 bytes — guarda o endereço de x)
+----------+--------------+

p          → 0x1000 (endereço)
*p         → 10     (vai pro endereço e lê)
&p         → 0x1004 (endereço do PRÓPRIO p)
&x         → 0x1000 (endereço de x)`}
      />

      <h2>Os 3 operadores em uma frase</h2>
      <CodeBlock
        language="c"
        code={`int x = 5;
int *p = &x;

x       → o valor (5)
&x      → o endereço de x
p       → o endereço guardado dentro de p (= &x)
*p      → o valor lá no endereço (= x = 5)
&p      → o endereço de p (onde o ponteiro mora)`}
      />

      <AlertBox type="info" title="Memorize isso">
        <strong>&amp;</strong> pega o endereço. <strong>*</strong> vai
        até o endereço. Inversos. Toda confusão de ponteiro vem de
        misturar essas duas operações.
      </AlertBox>

      <h2>Por que ponteiros importam</h2>
      <ol>
        <li><strong>Modificar variáveis em outra função</strong> (passagem por referência simulada).</li>
        <li><strong>Trabalhar com arrays</strong> sem copiar tudo (passar só o endereço do início).</li>
        <li><strong>Memória dinâmica</strong> — <code>malloc</code> retorna um ponteiro pra memória do heap.</li>
        <li><strong>Estruturas linkadas</strong> — listas, árvores, grafos: nós que apontam pra nós.</li>
        <li><strong>Callbacks</strong> — passar uma função como argumento (ponteiro pra função).</li>
        <li><strong>Tipos genéricos</strong> — <code>void*</code> pode apontar pra qualquer coisa.</li>
      </ol>

      <h2>Caso 1: modificar variável em outra função (revisão)</h2>
      <CodeBlock
        language="c"
        code={`/* Sem ponteiro: NÃO modifica o original */
void aumentar(int x) { x += 10; }

/* Com ponteiro: modifica via endereço */
void aumentar(int *x) { *x += 10; }

int main(void) {
    int n = 5;
    aumentar(&n);            // passa o ENDEREÇO
    printf("%d\\n", n);      // 15
}`}
      />

      <h2>Caso 2: arrays e ponteiros — quase a mesma coisa</h2>
      <CodeBlock
        language="c"
        code={`int arr[5] = {10, 20, 30, 40, 50};

/* arr (sem [ ]) DECAI pra ponteiro pro primeiro elemento */
int *p = arr;            // == &arr[0]

p[0]                     // 10  (sintaxe de array funciona em ponteiro!)
*p                       // 10  (mesma coisa)
p[2]                     // 30
*(p + 2)                 // 30  (aritmética de ponteiro — capítulo 13)

/* Por isso passar array pra função "vira" ponteiro */
void f(int *arr) { ... }
void f(int arr[]) { ... }    // SINÔNIMO`}
      />

      <h2>NULL — o ponteiro "pra lugar nenhum"</h2>
      <CodeBlock
        language="c"
        code={`#include <stddef.h>

int *p = NULL;       // ponteiro pra "nada"

if (p == NULL) {
    printf("nada apontado\\n");
}

/* C23 introduziu nullptr (mais moderno, type-safe) */
int *p2 = nullptr;`}
      />

      <AlertBox type="danger" title="Dereferenciar NULL = CRASH">
        <code>*NULL</code> ou acessar campo via NULL gera segfault no
        Linux/Mac (Access Violation no Windows). É um dos crashes mais
        comuns. Sempre cheque antes:
        <pre className="text-xs mt-2">{`if (p) {
    use(*p);     // só se p não for NULL
}`}</pre>
      </AlertBox>

      <h2>Ponteiros não inicializados — o pior cenário</h2>
      <CodeBlock
        language="c"
        code={`int *p;            // contém LIXO — aponta pra qualquer endereço aleatório
*p = 10;           // PODE crashar, PODE corromper memória aleatória

/* SEMPRE inicialize: */
int *p = NULL;     // bom — pelo menos deref vai segfaltar (fácil de debug)`}
      />

      <h2>Tipo do ponteiro IMPORTA</h2>
      <CodeBlock
        language="c"
        code={`int    n = 1;
double d = 1.0;

int    *pi = &n;    // OK
double *pd = &d;    // OK
int    *p  = &d;    // ❌ warning — tipos incompatíveis
double *q  = &n;    // ❌ ler 8 bytes de uma área de 4 = UB

/* O tipo diz QUANTOS BYTES ler ao deref e
   QUANTOS BYTES pular na aritmética. */`}
      />

      <h2>Exemplo prático: swap (clássico de ponteiros)</h2>
      <CodeBlock
        language="c"
        code={`void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("%d %d\\n", x, y);    // 20 10
}`}
      />

      <h2>Exemplo prático: encontrar mínimo E máximo de uma vez</h2>
      <CodeBlock
        language="c"
        code={`void min_max(const int *arr, size_t n, int *min_out, int *max_out) {
    *min_out = arr[0];
    *max_out = arr[0];
    for (size_t i = 1; i < n; i++) {
        if (arr[i] < *min_out) *min_out = arr[i];
        if (arr[i] > *max_out) *max_out = arr[i];
    }
}

int main(void) {
    int v[] = {3, 1, 4, 1, 5, 9, 2, 6};
    int min, max;
    min_max(v, 8, &min, &max);
    printf("min=%d  max=%d\\n", min, max);   // min=1 max=9
}`}
      />

      <h2>Cuidados de leitura — onde está o *</h2>
      <CodeBlock
        language="c"
        code={`int *p, q;     // ⚠ p é ponteiro, q NÃO É! (apenas int)
int *p, *q;    // os dois são ponteiros

/* Por isso muita gente escreve assim: */
int* p;        // estilo C++ — pode confundir em declaração múltipla

/* Estilo recomendado: '*' grudado no NOME */
int *p;`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`int  x = 10;
int *p = &x;

&x       endereço de x
p        endereço guardado em p
*p       valor apontado (10)
*p = 99  modifica x via p

/* Inicialize SEMPRE */
int *p = NULL;

/* Cheque antes de deref */
if (p) use(*p);

/* Tipo importa */
int *pi   ↔   int
double *pd ↔   double
void *v    aponta pra QUALQUER coisa (mas precisa cast pra usar)

/* Útil pra: */
- modificar fora da função (passar &x)
- passar arrays sem copiar
- malloc/free (heap)
- estruturas linkadas
- callbacks (ponteiro de função)`}
      />
    </PageContainer>
  );
}
