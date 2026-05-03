import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Ponteiros2() {
  return (
    <PageContainer
      title="Aritmética de Ponteiros"
      subtitle="Você pode SOMAR e SUBTRAIR de um ponteiro — e isso é a base de como C trabalha com arrays. A pegadinha: a soma é em UNIDADES DO TIPO, não em bytes."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>p + 1 não é p + 1 byte</h2>
      <CodeBlock
        language="c"
        code={`int arr[5] = {10, 20, 30, 40, 50};
int *p = arr;            // p aponta pra arr[0]

p     → endereço de arr[0]
p + 1 → endereço de arr[1]   (avança 4 bytes — sizeof(int))
p + 2 → endereço de arr[2]   (avança 8 bytes)
p + 4 → endereço de arr[4]   (avança 16 bytes)

*(p + 2)    → 30
p[2]        → 30  (sintaxe SINÔNIMA — açúcar pra *(p+2))`}
      />

      <h2>Diagrama: p+1 anda sizeof(tipo) bytes</h2>
      <CodeBlock
        language="text"
        code={`int arr[5];

Endereço:     0x100  0x104  0x108  0x10C  0x110
              [arr0] [arr1] [arr2] [arr3] [arr4]
                ↑      ↑      ↑
                p     p+1    p+2

double d[5];

Endereço:     0x200      0x208      0x210      0x218      0x220
              [d0]       [d1]       [d2]       [d3]       [d4]
                ↑           ↑           ↑
                p          p+1         p+2     ← agora pula 8 bytes!`}
      />

      <h2>p[i] é açúcar sintático pra *(p+i)</h2>
      <CodeBlock
        language="c"
        code={`/* Estas TRÊS são EQUIVALENTES (em C, não em C++): */
arr[i]
*(arr + i)
*(i + arr)
i[arr]      // SIM — é válido (mas medonho); usa só pra impressionar`}
      />

      <h2>Diferença entre dois ponteiros</h2>
      <CodeBlock
        language="c"
        code={`int arr[5] = {10, 20, 30, 40, 50};
int *p = &arr[1];
int *q = &arr[4];

ptrdiff_t d = q - p;      // 3 — quantos elementos entre eles
                          // (NÃO 12 bytes — em unidades do TIPO)

/* Use ptrdiff_t (em <stddef.h>) — o tipo "diferença de ponteiros" */`}
      />

      <h2>Iterar com ponteiro</h2>
      <CodeBlock
        language="c"
        code={`/* Forma com índice (mais comum) */
for (size_t i = 0; i < n; i++) {
    printf("%d\\n", arr[i]);
}

/* Forma com aritmética de ponteiro (mais idiomático em código C antigo) */
for (int *p = arr; p < arr + n; p++) {
    printf("%d\\n", *p);
}

/* Loop "estilo strings" — para no '\\0' */
for (const char *p = s; *p != '\\0'; p++) {
    putchar(*p);
}`}
      />

      <h2>Comparação de ponteiros</h2>
      <CodeBlock
        language="c"
        code={`/* Comparar < > == é VÁLIDO se ambos apontam pro mesmo array */
int arr[10];
int *p = &arr[2];
int *q = &arr[7];

if (p < q) { ... }       // OK
if (p == q) { ... }      // OK

/* Comparar ponteiros pra arrays DIFERENTES é UB
   (a não ser pra ==/!=) */`}
      />

      <h2>Ponteiro pra ponteiro (** — duplo)</h2>
      <CodeBlock
        language="c"
        code={`int  x  = 10;
int  *p = &x;        // p aponta pra x
int **pp = &p;       // pp aponta pra p (que aponta pra x)

x        // 10
*p       // 10
**pp     // 10
*pp      // valor de p = &x
&pp      // endereço de pp`}
      />

      <CodeBlock
        language="text"
        code={`            +-----+      +-----+      +-----+
   pp ────→ |  &p | ──→ |  &x | ──→ | 10  |
            +-----+      +-----+      +-----+
              pp           p           x`}
      />

      <h2>Pra que serve duplo ponteiro?</h2>
      <p>
        Principalmente: <strong>função que precisa modificar o
        próprio ponteiro</strong>. Ex: alocar memória dentro da função
        e devolver via parâmetro.
      </p>

      <CodeBlock
        language="c"
        code={`void alocar_buffer(char **out, size_t n) {
    *out = malloc(n);    // muda o ponteiro DE QUEM CHAMOU
}

int main(void) {
    char *buf;
    alocar_buffer(&buf, 1024);     // passa endereço do PONTEIRO
    /* ... usa buf ... */
    free(buf);
}`}
      />

      <h2>Outro caso: array de strings (vetor de char*)</h2>
      <CodeBlock
        language="c"
        code={`const char *frutas[] = { "maça", "uva", "banana", NULL };

for (int i = 0; frutas[i] != NULL; i++) {
    printf("%s\\n", frutas[i]);
}

/* O argv do main é exatamente isso: char **argv (ou char *argv[]) */
int main(int argc, char **argv) {
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\\n", i, argv[i]);
    }
}`}
      />

      <h2>Strings via ponteiro — implementando strlen</h2>
      <CodeBlock
        language="c"
        code={`size_t my_strlen(const char *s) {
    const char *p = s;
    while (*p != '\\0') p++;
    return p - s;            // diferença de ponteiros = quantidade
}

/* Versão "K&R style" (mais densa) */
size_t my_strlen(const char *s) {
    const char *p = s;
    while (*p++);            // anda até achar '\\0' (que é falso)
    return p - s - 1;
}`}
      />

      <h2>Implementando strcpy</h2>
      <CodeBlock
        language="c"
        code={`/* Versão clara */
char *my_strcpy(char *dst, const char *src) {
    char *original = dst;
    while ((*dst = *src) != '\\0') {
        dst++;
        src++;
    }
    return original;
}

/* "K&R style" (clássica do K&R) */
char *my_strcpy(char *dst, const char *src) {
    char *original = dst;
    while ((*dst++ = *src++));
    return original;
}`}
      />

      <h2>Aritmética em void* — não pode</h2>
      <CodeBlock
        language="c"
        code={`void *p = ...;
p + 1;     // ❌ erro — sizeof(void) é indefinido!

/* Solução: cast pra char* (ou tipo concreto) primeiro */
char *q = (char*)p;
q + 1;     // OK — anda 1 byte`}
      />

      <h2>Ponteiro fora dos bounds — UB</h2>
      <CodeBlock
        language="c"
        code={`int arr[10];
int *p = arr;

p + 9      // OK
p + 10     // OK (one-past-the-end — válido pra comparar, INVÁLIDO pra deref)
p + 11     // UB! (mesmo só calcular endereço)
*(p + 10)  // UB GARANTIDO`}
      />

      <AlertBox type="warning" title="Ponteiro pode passar 1 do fim">
        O padrão permite calcular um endereço UMA posição depois do
        fim (chamado <em>one past the end</em>) — pra usar em loops.
        Mas você NÃO pode dereferenciar.
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Aritmética em UNIDADES DO TIPO */
int  *p; p + 1 → +sizeof(int)    bytes
double *q; q + 1 → +sizeof(double) bytes

/* Equivalências */
arr[i]  ==  *(arr + i)  ==  *(i + arr)  ==  i[arr]

/* Iteração */
for (int *p = arr; p < arr + n; p++) { ... *p ... }
for (const char *p = s; *p; p++) { ... }    // strings

/* Diferença */
ptrdiff_t d = q - p;     // em <stddef.h>

/* Duplo ponteiro */
char **argv      // array de strings
int  **pp        // pra modificar o próprio ponteiro

/* Não pode */
void *p; p + 1     // ❌ — cast pra char* primeiro
*(p + n) onde n > tamanho do array     // UB`}
      />
    </PageContainer>
  );
}
