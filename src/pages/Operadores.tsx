import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer
      title="Operadores"
      subtitle="C tem uma quantidade enorme de operadores — incluindo manipulação de bits que outras linguagens escondem. Vamos do básico ao bitwise, com a tabela de precedência que SEMPRE confunde."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <h2>Aritméticos</h2>
      <CodeBlock
        language="c"
        code={`a + b        // soma
a - b        // subtração
a * b        // multiplicação
a / b        // divisão (INT se ambos int!)
a % b        // resto da divisão (só inteiros)

/* Unários */
-a           // negação
+a           // (raramente útil, mas válido)
++a          // incrementa antes (pré-incremento)
a++          // usa, depois incrementa (pós-incremento)
--a          // decrementa antes
a--          // usa, depois decrementa`}
      />

      <CodeBlock
        language="c"
        code={`int a = 5;
int b = a++;     // b = 5, a = 6 (usa, depois incrementa)

int c = 5;
int d = ++c;     // c = 6, d = 6 (incrementa, depois usa)

/* Diferença CRUCIAL em arrays */
int i = 0;
arr[i++] = 10;   // arr[0] = 10, depois i = 1
arr[++i] = 20;   // i = 1, depois arr[1] = 20`}
      />

      <h2>Atribuição composta</h2>
      <CodeBlock
        language="c"
        code={`a += b      // a = a + b
a -= b      // a = a - b
a *= b
a /= b
a %= b
a <<= b     // a = a << b   (shift bits à esquerda)
a >>= b     // shift à direita
a &= b      // AND bit a bit
a |= b
a ^= b      // XOR`}
      />

      <h2>Comparação</h2>
      <CodeBlock
        language="c"
        code={`a == b      // igual a (CUIDADO: dois sinais!)
a != b      // diferente
a < b       // menor
a > b
a <= b
a >= b

/* Resultado: 0 (falso) ou 1 (verdadeiro) — sempre int */
int eh_maior_idade = (idade >= 18);   // 0 ou 1`}
      />

      <AlertBox type="danger" title="O bug que TODO mundo já cometeu">
        <pre className="text-xs mt-2">{`if (x = 5) { ... }    // ATRIBUIÇÃO! resultado é 5 → sempre verdadeiro
if (x == 5) { ... }   // comparação (o que você queria)`}</pre>
        Compile com <code>-Wall</code>: o gcc avisa sobre atribuição
        em condicional.
      </AlertBox>

      <h2>Lógicos</h2>
      <CodeBlock
        language="c"
        code={`a && b      // E lógico — AMBOS verdadeiros
a || b      // OU lógico — pelo menos UM verdadeiro
!a          // NÃO lógico

/* Em C, qualquer valor diferente de 0 é "verdadeiro" */
if (ptr) { ... }       // verdadeiro se ptr != NULL
if (n) { ... }         // verdadeiro se n != 0

/* Curto-circuito (importante!) */
if (p != NULL && p->valor > 0) { ... }
//   ↑ se p é NULL, NÃO avalia p->valor (que crasharia)

if (cache_ok || consultar_db()) { ... }
//   ↑ se cache_ok, NÃO chama consultar_db`}
      />

      <h2>Bitwise — manipulação de bits</h2>
      <p>
        Esses são uma das razões pra C ainda dominar embarcados,
        criptografia, compressão e drivers. Eles operam bit a bit:
      </p>
      <CodeBlock
        language="c"
        code={`a & b       // AND     1100 & 1010 = 1000
a | b       // OR      1100 | 1010 = 1110
a ^ b       // XOR     1100 ^ 1010 = 0110
~a          // NOT     ~1100 = ...0011 (inverte TODOS os bits)
a << n      // shift esquerda  (multiplica por 2^n)
a >> n      // shift direita   (divide por 2^n se unsigned)`}
      />

      <h2>Padrões clássicos com bitwise</h2>
      <CodeBlock
        language="c"
        code={`/* LIGAR um bit (set) */
flags |= (1 << 3);       // liga o bit 3

/* DESLIGAR um bit (clear) */
flags &= ~(1 << 3);      // desliga o bit 3

/* INVERTER um bit (toggle) */
flags ^= (1 << 3);

/* TESTAR se um bit está ligado */
if (flags & (1 << 3)) { ... }

/* MULTIPLICAR/DIVIDIR por potência de 2 */
x << 1     // x * 2
x << 3     // x * 8
x >> 1     // x / 2
x >> 4     // x / 16

/* Pegar só os 4 bits inferiores (mask) */
low = byte & 0x0F;

/* Trocar dois números sem variável temporária (truque clássico) */
a ^= b;
b ^= a;
a ^= b;`}
      />

      <h2>Operador ternário</h2>
      <CodeBlock
        language="c"
        code={`/* condição ? valor_se_verdade : valor_se_falso */
int max = (a > b) ? a : b;

const char *msg = (n == 0) ? "zero" : "não zero";

/* Pode aninhar (mas não exagere) */
const char *grau = (n > 90) ? "A"
                 : (n > 80) ? "B"
                 : (n > 70) ? "C"
                 : (n > 60) ? "D" : "F";`}
      />

      <h2>sizeof, &amp;, *, -&gt;, .</h2>
      <CodeBlock
        language="c"
        code={`sizeof(int)        // tamanho do tipo (sem ()  para variável: sizeof x)
sizeof arr         // tamanho TOTAL do array

&x                 // endereço de x
*p                 // valor apontado por p (deref)
p->campo           // (*p).campo — campo de struct via ponteiro
obj.campo          // campo de struct via valor

(int*)p            // cast de ponteiro
arr[i]             // == *(arr + i)

func(arg1, arg2)   // chamada de função
expr, expr         // operador vírgula — avalia ambos, retorna o último`}
      />

      <h2>Tabela de precedência (decoreba que vale)</h2>
      <CodeBlock
        language="text"
        code={`Maior precedência (avalia PRIMEIRO):

  ()  []  ->  .                       (postfix)
  !   ~   ++  --  +unário  -unário  *  &   sizeof   (cast)
  *   /   %
  +   -
  <<  >>
  <   <=  >   >=
  ==  !=
  &
  ^
  |
  &&
  ||
  ?:                                  (ternário)
  =   +=  -=  *=  /=  %=  <<=  >>=  &=  ^=  |=
  ,                                   (vírgula)

Menor precedência`}
      />

      <AlertBox type="warning" title="Bitwise tem precedência MENOR que comparação">
        <pre className="text-xs mt-2">{`if (flags & MASK == 0) { ... }    // BUG! É (flags & (MASK == 0))
if ((flags & MASK) == 0) { ... }  // certo`}</pre>
        Sempre coloque parênteses ao misturar bitwise com comparação.
      </AlertBox>

      <h2>Exemplo do mundo real: permissões UNIX</h2>
      <CodeBlock
        language="c"
        code={`#define PERM_READ   (1 << 2)   // 100 = 4
#define PERM_WRITE  (1 << 1)   // 010 = 2
#define PERM_EXEC   (1 << 0)   // 001 = 1

int perms = PERM_READ | PERM_WRITE;        // 110 = 6 (rw-)

/* Pode escrever? */
if (perms & PERM_WRITE) { ... }

/* Adicionar exec */
perms |= PERM_EXEC;                        // 111 (rwx)

/* Remover write */
perms &= ~PERM_WRITE;                      // 101 (r-x)

/* Inverter exec */
perms ^= PERM_EXEC;`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Aritméticos */
+  -  *  /  %    ++  --

/* Atribuição */
=  +=  -=  *=  /=  %=  <<=  >>=  &=  |=  ^=

/* Comparação (resulta 0 ou 1) */
==  !=  <  >  <=  >=

/* Lógicos (curto-circuito) */
&&  ||  !

/* Bitwise (operam bit a bit) */
&  |  ^  ~  <<  >>

/* Especiais */
sizeof   ?:   ,   (cast)
&x   *p   p->c   obj.c

/* Padrões úteis */
flags |= MASK              // ligar
flags &= ~MASK             // desligar
flags ^= MASK              // toggle
flags & MASK               // testar`}
      />
    </PageContainer>
  );
}
