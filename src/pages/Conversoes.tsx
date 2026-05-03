import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Conversoes() {
  return (
    <PageContainer
      title="Conversões e Cast"
      subtitle="C converte tipos automaticamente em quase todo lugar — e isso é a fonte de uma quantidade absurda de bugs. Vamos ver as regras e quando você precisa intervir com cast explícito."
      difficulty="iniciante"
      timeToRead="8 min"
    >
      <h2>Conversão implícita — o compilador faz sozinho</h2>
      <p>
        Quando você mistura tipos, C promove o "menor" pro "maior"
        automaticamente:
      </p>
      <CodeBlock
        language="c"
        code={`int    a = 5;
double b = 2.0;
double r = a + b;       // a vira double, depois soma → 7.0

char c = 65;            // 65 cabe em char
int  i = c;             // promove pra int → 65

int  x = 10;
int  y = 3;
double z = x / y;       // CUIDADO! divisão INT primeiro = 3, depois vira 3.0
                        // Resultado: 3.0, NÃO 3.333

double z2 = (double)x / y;   // agora sim: 3.333...`}
      />

      <h2>Cast explícito — você força a conversão</h2>
      <CodeBlock
        language="c"
        code={`int    centavos = 1099;
double reais    = (double)centavos / 100.0;   // 10.99

double pi = 3.14;
int    truncado = (int)pi;                    // 3 (TRUNCA, não arredonda!)

/* Pra arredondar use round() de math.h */
#include <math.h>
int    arredondado = (int)round(pi);          // 3 (3.5 viraria 4)`}
      />

      <h2>Overflow — quando o valor não cabe</h2>
      <BeforeAfter
        beforeLabel="❌ Overflow signed = Undefined Behavior"
        afterLabel="✅ Overflow unsigned = wrap around (definido)"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int x = INT_MAX;
x = x + 1;
// UB! gcc com -O2 pode
// otimizar como se nunca
// estourasse → bugs malucos`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`unsigned u = UINT_MAX;
u = u + 1;
// = 0 (definido pelo padrão!)
// usado em hash, contadores
// circulares, criptografia`}
          </pre>
        }
      />

      <CodeBlock
        language="c"
        code={`/* Bug clássico: somar dois ints grandes */
int  a = 1500000000;
int  b = 1500000000;
int  s = a + b;          // OVERFLOW (passa de 2.1 bilhões)

/* Solução: tipo maior antes da operação */
long long s2 = (long long)a + b;   // OK, 3 bilhões cabem em long long

/* Outro bug: tamanho de array com tipo errado */
size_t n = 10;
int    i = -1;
if (i < n) { ... }       // i é convertido pra unsigned → vira número GIGANTE`}
      />

      <h2>Truncamento e perda de precisão</h2>
      <CodeBlock
        language="c"
        code={`/* int → char (perda) */
int  big = 300;
char c   = big;          // 300 não cabe em char → vira 44 (300 - 256)

/* double → float (perda de precisão) */
double d = 3.141592653589793;
float  f = d;            // f ≈ 3.1415927 (só ~7 dígitos)

/* float → int (trunca) */
float pi = 3.99f;
int   n  = pi;           // 3 (não 4)

/* unsigned grande → signed pequeno = UB se não couber */
uint32_t u = 4000000000U;
int32_t  s = u;          // implementação-definida em C99,
                         // bem definida em C23 (vira valor negativo via complemento de 2)`}
      />

      <h2>Conversão de char ↔ int</h2>
      <p>
        Em C, <code>char</code> é literalmente um número. <code>'A'</code>{" "}
        é apenas <code>65</code> (ASCII). Você pode fazer aritmética
        direto:
      </p>
      <CodeBlock
        language="c"
        code={`char c = 'A';                 // c = 65
char minuscula = c + 32;      // 'a' = 97

/* Converter char dígito em int */
char d = '7';
int  n = d - '0';             // 7 (subtrair o ASCII de '0' = 48)

/* Inverso */
int  num = 5;
char dig = num + '0';         // '5'`}
      />

      <h2>Promoção em expressões</h2>
      <CodeBlock
        language="c"
        code={`/* Toda operação aritmética promove tipos menores que int para int */
char a = 100, b = 100;
char c = a + b;          // a+b é INT (200) → atribuição vira UB se -fwrapv off
                         //   (200 não cabe em signed char -128..127)

short x = 10, y = 20;
auto soma = x + y;       // tipo da expressão é INT, não short!`}
      />

      <h2>Cast de ponteiros — preview</h2>
      <CodeBlock
        language="c"
        code={`/* void* aceita qualquer ponteiro sem cast */
int  arr[10];
void *generic = arr;

/* De volta exige cast explícito */
int  *p = (int*)generic;

/* malloc retorna void*, então em C puro não precisa de cast */
int *buf = malloc(100 * sizeof(int));        // certo
int *buf = (int*)malloc(100 * sizeof(int));  // certo, mas redundante (mascara bugs!)

/* Cast entre tipos não relacionados = UB se desalinhar */
char  bytes[8];
int  *p = (int*)bytes;       // perigo: bytes pode não estar 4-byte aligned`}
      />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="danger" title="Divisão de int não vira double sozinha">
        <pre className="text-xs mt-2">{`double avg = total / count;     // se ambos são int, divide INT primeiro!
double avg = (double)total / count;   // agora sim`}</pre>
      </AlertBox>

      <AlertBox type="warning" title="Comparar size_t com -1">
        <code>size_t</code> é unsigned. Se um loop tem
        <code> for (size_t i = n - 1; i &gt;= 0; i--) </code>{" "}
        — i NUNCA fica negativo, vira número gigante e o loop é
        infinito. Use <code>for (size_t i = n; i-- &gt; 0; )</code>.
      </AlertBox>

      <AlertBox type="danger" title="Overflow signed é Undefined Behavior">
        Compiladores modernos USAM essa premissa pra otimizar. Se
        você assume "vai dar volta", está em terreno minado.
        Use <code>-fsanitize=undefined</code> em debug pra detectar.
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Promoção implícita */
int + double = double
char + int   = int
signed + unsigned = unsigned (PERIGO!)

/* Cast explícito */
(double)x / y     // força double na divisão
(int)round(d)     // arredondar pra int

/* Conversões char ↔ int */
'7' - '0' = 7
n + '0'   = caractere

/* Tipos sem perda */
int → long → long long → float (mas perde precisão) → double

/* Nunca confie em int pra contadores grandes — use size_t / int64_t */`}
      />
    </PageContainer>
  );
}
