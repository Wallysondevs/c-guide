import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Ponteiros3() {
  return (
    <PageContainer
      title="void*, ponteiro de função, const correctness"
      subtitle="Os tópicos que separam quem 'sabe ponteiro' de quem 'usa ponteiro'. Aqui entram callbacks, código genérico, e o segredo do const que faz o compilador trabalhar por você."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <h2>void* — ponteiro genérico</h2>
      <p>
        <code>void*</code> é um ponteiro que pode apontar pra
        <strong> qualquer tipo</strong>. Não tem aritmética nem
        deref direto — você precisa fazer cast pro tipo certo
        antes de usar.
      </p>

      <CodeBlock
        language="c"
        code={`int    n = 42;
double d = 3.14;
char  *s = "oi";

void *p;
p = &n;       // OK
p = &d;       // OK
p = s;        // OK

/* Deref precisa de cast */
int    valor_int = *(int*)p;
double valor_dbl = *(double*)p;`}
      />

      <h2>O caso clássico: malloc</h2>
      <CodeBlock
        language="c"
        code={`/* malloc retorna void* — funciona pra qualquer tipo */
int    *arr  = malloc(10 * sizeof(int));      // sem cast em C
double *real = malloc(10 * sizeof(double));
struct Pessoa *p = malloc(sizeof(struct Pessoa));

/* Em C++, cast é OBRIGATÓRIO. Em C puro, NÃO faça cast — esconde
   bug se esquecer de incluir <stdlib.h> */`}
      />

      <h2>Memcpy é a porta de entrada do void*</h2>
      <CodeBlock
        language="c"
        code={`#include <string.h>

void memcpy(void *dst, const void *src, size_t n);

/* Funciona pra QUALQUER tipo de dado — copia n bytes "burros" */
int orig[5] = {1, 2, 3, 4, 5};
int copia[5];
memcpy(copia, orig, sizeof(orig));`}
      />

      <h2>Ponteiros de função — passar comportamento</h2>
      <CodeBlock
        language="c"
        code={`/* Sintaxe (notoriamente esquisita): */
//  tipo_retorno (*nome)(parâmetros)

int (*operacao)(int, int);    // operacao é PONTEIRO pra função
                              // que recebe (int,int) e retorna int

/* Exemplos concretos */
int somar(int a, int b)  { return a + b; }
int subtr(int a, int b)  { return a - b; }

int main(void) {
    int (*op)(int, int);

    op = somar;              // mesmo nome da função = endereço dela
    printf("%d\\n", op(2, 3));   // 5

    op = subtr;
    printf("%d\\n", op(10, 4));  // 6
}`}
      />

      <AlertBox type="info" title="typedef salva sua leitura">
        Sintaxe de ponteiro de função vira pesadelo. Sempre
        <code> typedef </code>:
        <pre className="text-xs mt-2">{`typedef int (*Operacao)(int, int);

Operacao op = somar;
op(2, 3);

/* Pra função que retorna ponteiro de função, sem typedef vira ilegível */`}</pre>
      </AlertBox>

      <h2>Caso real: qsort com comparador</h2>
      <CodeBlock
        language="c"
        code={`#include <stdlib.h>

/* qsort é genérica — recebe ponteiro pra função de comparação */
void qsort(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *));

int comparar_ints(const void *a, const void *b) {
    int x = *(const int*)a;
    int y = *(const int*)b;
    return x - y;     // <0, 0, >0
}

int main(void) {
    int v[] = {3, 1, 4, 1, 5, 9, 2, 6};
    qsort(v, 8, sizeof(int), comparar_ints);
    for (int i = 0; i < 8; i++) printf("%d ", v[i]);
    /* 1 1 2 3 4 5 6 9 */
}`}
      />

      <h2>Callback patterns — o map de C</h2>
      <CodeBlock
        language="c"
        code={`/* Aplicar uma função em cada elemento */
void for_each(int *arr, size_t n, void (*fn)(int)) {
    for (size_t i = 0; i < n; i++) fn(arr[i]);
}

void imprimir(int x) { printf("%d\\n", x); }
void dobrar(int x)   { /* só pra exemplo */ }

int main(void) {
    int v[] = {1, 2, 3, 4, 5};
    for_each(v, 5, imprimir);
}`}
      />

      <h2>const correctness — fazer o compilador trabalhar</h2>
      <p>
        <code>const</code> avisa "não vou modificar isso". Compilador
        impede você de tentar — e documenta a interface da função.
      </p>

      <CodeBlock
        language="c"
        code={`/* SEM const: chamador NÃO sabe se a função vai modificar */
size_t strlen(char *s);

/* COM const: contrato claro = "não mexo no que você passou" */
size_t strlen(const char *s);

/* Compilador IMPEDE acidentes */
size_t strlen(const char *s) {
    *s = 'X';      // ❌ erro de compilação
    s[0] = 'X';    // ❌ erro
    return ...;
}`}
      />

      <h2>Os 4 sabores de const com ponteiro</h2>
      <CodeBlock
        language="c"
        code={`int x = 10, y = 20;

/* 1. Ponteiro normal — pode mudar tudo */
int *p = &x;
*p = 100;       // ✅ muda valor
p = &y;         // ✅ aponta pra outra variável

/* 2. Ponteiro pra const — não pode mudar VALOR, pode REASSIGNAR */
const int *p = &x;     // (ou: int const *p — equivalente)
*p = 100;       // ❌ erro
p = &y;         // ✅ ok

/* 3. Const pointer — pode mudar VALOR, NÃO pode reassignar */
int *const p = &x;
*p = 100;       // ✅ ok
p = &y;         // ❌ erro

/* 4. Const pointer pra const — não pode NADA */
const int *const p = &x;
*p = 100;       // ❌
p = &y;         // ❌`}
      />

      <CodeBlock
        language="text"
        code={`Truque pra ler: leia da DIREITA pra esquerda.

  const int *p     →  p é um ponteiro pra (int const)        → conteúdo é const
  int const *p     →  mesma coisa
  int *const p     →  p é um const ponteiro pra int          → ponteiro é const
  const int *const p →  ambos const`}
      />

      <h2>Exemplo: API pública só com const correto</h2>
      <CodeBlock
        language="c"
        code={`/* Recebe entrada (const), preenche saída */
int validar(const char *entrada,
            char *saida, size_t cap);

/* Comparador (jamais modifica os elementos) */
int comparar(const void *a, const void *b);

/* Acesso a config global imutável */
const Config *get_config(void);`}
      />

      <h2>Ponteiro de função em struct (objeto-orientado em C)</h2>
      <CodeBlock
        language="c"
        code={`/* "Métodos" via ponteiros de função em struct = OO em C */
typedef struct {
    void (*falar)(void);
    void (*comer)(int qty);
} Animal;

void cao_falar(void)        { printf("au!\\n"); }
void cao_comer(int qty)     { printf("comi %d\\n", qty); }

int main(void) {
    Animal cao = { cao_falar, cao_comer };
    cao.falar();
    cao.comer(3);
}

/* Por baixo dos panos, é assim que a "vtable" do C++ funciona */`}
      />

      <h2>void* + size = "qualquer tipo" — exemplo de swap genérico</h2>
      <CodeBlock
        language="c"
        code={`#include <string.h>

void swap_generic(void *a, void *b, size_t size) {
    char tmp[size];                      // VLA (C99) — alternativa: malloc
    memcpy(tmp, a, size);
    memcpy(a, b, size);
    memcpy(b, tmp, size);
}

int main(void) {
    int x = 1, y = 2;
    swap_generic(&x, &y, sizeof(int));   // funciona pra int

    double d1 = 1.5, d2 = 2.5;
    swap_generic(&d1, &d2, sizeof(double));  // pra double também
}`}
      />

      <h2>Restrict — promete "ponteiros não se cruzam"</h2>
      <CodeBlock
        language="c"
        code={`/* Diz ao compilador: "esses dois ponteiros NÃO apontam pra mesma área" */
void copia(int *restrict dst, const int *restrict src, size_t n) {
    for (size_t i = 0; i < n; i++) dst[i] = src[i];
}

/* Permite otimizações fortes (vetorização SIMD).
   Se você MENTIR (passar áreas sobrepostas), é UB. */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* void* */
void *p = qualquer_ponteiro;     // OK
*(int*)p                          // deref via cast
malloc retorna void*              // sem cast em C puro

/* Ponteiro de função */
int (*op)(int, int) = somar;
op(2, 3);
typedef int (*Op)(int, int);     // SEMPRE typedef

/* Const correctness — leia da direita pra esquerda */
const int *p     → conteúdo const
int *const p     → ponteiro const
const int *const p   → ambos

/* Padrões */
qsort(arr, n, sizeof, cmp);       // callback
struct { void (*op)(); }          // OO em C
restrict                          // promessa de não-aliasing

/* Use const SEMPRE que possível em parâmetros — pega bug e
   documenta a interface */`}
      />
    </PageContainer>
  );
}
