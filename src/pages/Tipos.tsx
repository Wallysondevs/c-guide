import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Tipos() {
  return (
    <PageContainer
      title="Tipos & Variáveis"
      subtitle="C trabalha perto da memória — então o tipo de uma variável diz exatamente quantos bytes ela ocupa e o que cabe lá. Diferente de Python ou JavaScript, isso importa em CADA declaração."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>Os tipos primitivos</h2>
      <CodeBlock
        language="c"
        code={`/* Inteiros */
char        // 1 byte (geralmente)
short       // 2 bytes
int         // 4 bytes (geralmente)
long        // 4 ou 8 bytes (depende do SO!)
long long   // pelo menos 8 bytes

/* Ponto flutuante (decimais) */
float       // 4 bytes — ~7 dígitos de precisão
double      // 8 bytes — ~15 dígitos
long double // 10/16 bytes — depende do compilador

/* Booleano (a partir de C99) */
#include <stdbool.h>
bool ok = true;

/* Vazio — usado pra "função sem retorno" e ponteiros genéricos */
void`}
      />

      <AlertBox type="warning" title="Tamanho de int NÃO é garantido">
        O padrão C diz que <code>int</code> tem <em>pelo menos</em> 16
        bits. Na prática, 32 bits em quase todo lugar. Mas em sistemas
        embarcados pode ser 16. Se precisa de tamanho EXATO, use
        <code> &lt;stdint.h&gt;</code> (próximo bloco).
      </AlertBox>

      <h2>Tipos de tamanho FIXO (use em código portátil)</h2>
      <CodeBlock
        language="c"
        code={`#include <stdint.h>

int8_t   a;   // exatamente 8 bits (1 byte)
int16_t  b;   // exatamente 16 bits (2 bytes)
int32_t  c;   // exatamente 32 bits (4 bytes)
int64_t  d;   // exatamente 64 bits (8 bytes)

uint8_t  e;   // versões SEM sinal (só positivos)
uint16_t f;
uint32_t g;
uint64_t h;

/* Tamanhos específicos pra propósitos */
size_t   tam;       // tamanho de objetos (sempre não negativo). retorno de sizeof, strlen
ptrdiff_t dif;      // diferença entre dois ponteiros
intptr_t  p;        // inteiro grande o suficiente pra guardar um ponteiro`}
      />

      <h2>Signed vs unsigned</h2>
      <p>
        Toda variável inteira pode ser <strong>com sinal</strong>{" "}
        (signed, padrão) ou <strong>sem sinal</strong> (unsigned,
        só positivos). A diferença é onde os bits são usados:
      </p>
      <CodeBlock
        language="c"
        code={`/* signed char (8 bits) */
//   1 bit pro sinal + 7 bits pra magnitude
//   intervalo: -128 a 127

/* unsigned char (8 bits) */
//   8 bits pra magnitude
//   intervalo: 0 a 255

unsigned char idade = 200;     // OK (cabe em 0..255)
char temp = -50;                // OK (signed por padrão)

unsigned int neg = -1;          // PERIGO — vira valor enorme (4294967295)
                                // (regra de "wrap around")`}
      />

      <h2>sizeof — descubra o tamanho na sua máquina</h2>
      <CodeBlock
        language="c"
        title="sizes.c"
        code={`#include <stdio.h>

int main(void) {
    printf("char       = %zu byte(s)\\n", sizeof(char));
    printf("short      = %zu byte(s)\\n", sizeof(short));
    printf("int        = %zu byte(s)\\n", sizeof(int));
    printf("long       = %zu byte(s)\\n", sizeof(long));
    printf("long long  = %zu byte(s)\\n", sizeof(long long));
    printf("float      = %zu byte(s)\\n", sizeof(float));
    printf("double     = %zu byte(s)\\n", sizeof(double));
    printf("void*      = %zu byte(s)\\n", sizeof(void*));
    return 0;
}

/* Saída típica em Linux x86_64:
   char       = 1
   short      = 2
   int        = 4
   long       = 8
   long long  = 8
   float      = 4
   double     = 8
   void*      = 8        (32-bit em sistema 32 bits) */`}
      />

      <p>
        <code>%zu</code> é o specifier para <code>size_t</code>. Use
        SEMPRE com <code>sizeof</code> — não use <code>%d</code> que
        pode estar errado em sistemas 64 bits.
      </p>

      <h2>Declarando e inicializando</h2>
      <CodeBlock
        language="c"
        code={`/* Declarar (reserva espaço, valor LIXO até inicializar) */
int x;

/* Inicializar (declara + atribui) */
int y = 10;
int z = 0xFF;        // hexadecimal (255)
int w = 0b1010;      // binário (10) — extensão GCC, oficial em C23
int v = 0755;        // OCTAL (cuidado!) — começou com 0 = 493

/* Múltiplas */
int a = 1, b = 2, c = 3;

/* Constantes */
const float PI = 3.14159f;     // f no fim = float (sem isso é double)
const long N = 1000000L;       // L no fim = long
const long long NN = 1LL << 40; // LL = long long

/* "Mágicos" */
char letra = 'A';      // aspas simples = char (UM caractere)
char tab = '\\t';
char nl  = '\\n';
char zero = '\\0';      // o terminador de string (importantíssimo)`}
      />

      <AlertBox type="danger" title="Variável não inicializada = LIXO">
        Em C, declarar não zera a variável. <code>int x;</code> contém
        <em> qualquer coisa </em> que estava na memória antes. Ler antes
        de escrever é <strong>undefined behavior</strong> — programa
        pode rodar, crashar, ou dar resultado errado de forma
        intermitente. <strong>SEMPRE inicialize.</strong>
      </AlertBox>

      <h2>Format specifiers para printf</h2>
      <CodeBlock
        language="c"
        code={`int   i = 42;       printf("%d\\n", i);     // decimal
int   i = 42;       printf("%x\\n", i);     // hex (2a)
int   i = 42;       printf("%o\\n", i);     // octal (52)
unsigned u = 42u;   printf("%u\\n", u);     // unsigned
long  l = 42L;      printf("%ld\\n", l);    // long
long long ll = 42;  printf("%lld\\n", ll);  // long long
size_t s = 42;      printf("%zu\\n", s);    // size_t (use com sizeof)

float f = 3.14f;    printf("%f\\n", f);     // 3.140000
double d = 3.14;    printf("%.2f\\n", d);   // 3.14 (2 casas)
double d = 3.14;    printf("%e\\n", d);     // 3.140000e+00

char c = 'A';       printf("%c\\n", c);     // A
char *s = "oi";     printf("%s\\n", s);     // oi

void *p = &x;       printf("%p\\n", p);     // 0x7ffd...
                    printf("%%\\n");        // literal '%'`}
      />

      <h2>Tipos de dados em hex e bits — mostre que entende</h2>
      <CodeBlock
        language="c"
        code={`uint8_t b = 0xFF;            // 11111111 = 255
uint8_t b = 1 << 3;          // 00001000 = 8 (1 deslocado 3 bits à esquerda)

/* Permissões UNIX (clássico) */
int mode = 0755;             // rwxr-xr-x
int read_bit  = 1 << 2;      // 4
int write_bit = 1 << 1;      // 2
int exec_bit  = 1 << 0;      // 1`}
      />

      <h2>Limites — &lt;limits.h&gt; e &lt;float.h&gt;</h2>
      <CodeBlock
        language="c"
        code={`#include <limits.h>
INT_MIN, INT_MAX           // -2147483648 .. 2147483647 (em 32 bits)
LONG_MAX, ULONG_MAX
CHAR_BIT                   // bits por byte (sempre >= 8, geralmente 8)

#include <float.h>
FLT_MAX, DBL_MAX           // maior valor representável
FLT_EPSILON                // menor diferença entre 1.0 e o próximo float

#include <stdint.h>
INT32_MAX, UINT64_MAX, SIZE_MAX`}
      />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="warning" title="Comparar signed com unsigned">
        <pre className="text-xs mt-2">{`int  a = -1;
unsigned b = 1;
if (a < b) { ... }   // FALSO! -1 vira 4294967295`}</pre>
        Compile com <code>-Wsign-compare</code> e o gcc avisa.
      </AlertBox>

      <AlertBox type="warning" title="float não é exato">
        <code>0.1 + 0.2 != 0.3</code> em C (e em qualquer linguagem
        com IEEE 754). Pra dinheiro, use inteiros de centavos:
        <code> int valor_em_centavos = 1099; </code> em vez de float.
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Para código novo, prefira tipos de tamanho fixo */
#include <stdint.h>
int32_t  x = 42;
uint64_t y = 0;
size_t   tam = sizeof(arr);   // sempre %zu

/* Sempre inicialize */
int x = 0;     // bom
int x;         // LIXO (UB se ler antes de escrever)

/* Pra constantes */
const float PI = 3.14f;
#define MAX_BUF 1024     // alternativa via macro

/* Saber em sua máquina */
printf("%zu\\n", sizeof(int));`}
      />
    </PageContainer>
  );
}
