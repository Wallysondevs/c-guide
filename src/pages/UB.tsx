import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function UB() {
  return (
    <PageContainer
      title="Undefined Behavior — o capítulo mais importante"
      subtitle="UB é o conceito que faz C ser tão rápido — e tão perigoso. O padrão diz 'aqui é proibido' e o compilador assume que VOCÊ NÃO FEZ. Quando você fez, o programa tem licença pra fazer LITERALMENTE qualquer coisa."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <h2>Definição rápida</h2>
      <p>
        O padrão C divide comportamentos em 3 categorias:
      </p>
      <CodeBlock
        language="text"
        code={`IMPLEMENTATION-DEFINED   varia entre compiladores, mas é DOCUMENTADO
                         (ex: tamanho de int, sinal do '%' com negativo)

UNSPECIFIED              o padrão deixa em aberto, sem precisar documentar
                         (ex: ordem de avaliação dos args de uma função)

UNDEFINED BEHAVIOR (UB)  PROIBIDO — programa pode fazer QUALQUER COISA
                         (ex: escrever em ponteiro NULL, overflow signed)`}
      />

      <h2>O que "qualquer coisa" significa de fato</h2>
      <ul>
        <li>Crashar (melhor cenário — é fácil de debug).</li>
        <li>Funcionar "normalmente" (pior — esconde bug por anos).</li>
        <li>Funcionar em <code>-O0</code>, quebrar em <code>-O2</code>.</li>
        <li>Funcionar no Linux, quebrar no Windows.</li>
        <li>Apagar arquivos no seu disco (sério — o padrão permite).</li>
        <li>Abrir uma vulnerabilidade de segurança.</li>
      </ul>

      <AlertBox type="danger" title="UB ≠ erro de runtime">
        Não tem "exceção". Não tem "panic". O compilador assume que
        UB nunca acontece e <strong>otimiza</strong> baseado nisso.
        Você nunca verá erro — só comportamento estranho.
      </AlertBox>

      <h2>UB #1 — Dereferenciar ponteiro inválido</h2>
      <CodeBlock
        language="c"
        code={`int *p = NULL;
*p = 10;             // ❌ UB

int *p;              // não inicializado — aponta pra LIXO
*p = 10;             // ❌ UB

int *p = malloc(10);
free(p);
*p = 10;             // ❌ UB — use-after-free`}
      />

      <h2>UB #2 — Buffer overflow</h2>
      <CodeBlock
        language="c"
        code={`int arr[10];
arr[10] = 99;        // ❌ UB — só vai até arr[9]

char buf[5];
strcpy(buf, "string longa");    // ❌ UB — overflow`}
      />

      <h2>UB #3 — Signed integer overflow</h2>
      <CodeBlock
        language="c"
        code={`int x = INT_MAX;
x = x + 1;           // ❌ UB! NÃO é "vira INT_MIN"

/* Por incrível que pareça, isso é EXPLORADO pelo compilador: */
int loop(int n) {
    for (int i = 0; i <= n; i++) { ... }
    /* Compilador assume: i nunca dá overflow.
       Se n == INT_MAX, o loop seria infinito.
       Compilador ELIMINA a comparação i <= n e gera loop infinito. */
}

/* Solução: use UNSIGNED — wrap-around é DEFINIDO */
unsigned u = UINT_MAX;
u = u + 1;           // = 0 (definido pelo padrão)`}
      />

      <h2>UB #4 — Modificar literal de string</h2>
      <CodeBlock
        language="c"
        code={`char *s = "olá";
s[0] = 'O';          // ❌ UB — literal vive em memória READ-ONLY

/* Linux/Mac: segfault. Windows: às vezes funciona, às vezes não.
   Sempre proteja com const: */

const char *s = "olá";
s[0] = 'O';          // erro de COMPILAÇÃO — pegou antes de virar UB`}
      />

      <h2>UB #5 — Múltiplas modificações da mesma variável sem sequence point</h2>
      <CodeBlock
        language="c"
        code={`int i = 0;
i = i++ + ++i;       // ❌ UB — ordem de modificação indefinida

int x = 5;
printf("%d %d", x++, x++);    // ❌ UB

a[i] = i++;          // ❌ UB

/* Em geral: NÃO modifique a mesma variável duas vezes na mesma expressão. */`}
      />

      <h2>UB #6 — Divisão por zero</h2>
      <CodeBlock
        language="c"
        code={`int x = 10 / 0;        // ❌ UB
int y = 10 % 0;        // ❌ UB

double d = 10.0 / 0.0;  // tecnicamente IMPLEMENTATION-DEFINED — IEEE 754 dá +inf
                        // mas pra int é UB sólido`}
      />

      <h2>UB #7 — Acesso desalinhado</h2>
      <CodeBlock
        language="c"
        code={`char buf[10];
int *p = (int*)(buf + 1);    // pode não estar alinhado a 4 bytes
*p = 42;                      // ❌ UB no padrão (e crash em ARM)

/* Solução portável: memcpy */
int valor = 42;
memcpy(buf + 1, &valor, sizeof(valor));`}
      />

      <h2>UB #8 — Ler variável sem inicializar</h2>
      <CodeBlock
        language="c"
        code={`int x;
printf("%d\\n", x);    // ❌ UB

/* Compilador moderno pode SUMIR com qualquer código que dependa de x. */`}
      />

      <h2>UB #9 — Aritmética de ponteiro fora dos bounds</h2>
      <CodeBlock
        language="c"
        code={`int arr[10];
int *p = arr;

p + 10;     // OK — "one-past-the-end" (pra comparação)
p + 11;     // ❌ UB — só calcular o endereço!
*(p + 10);  // ❌ UB GARANTIDO — dereferência fora`}
      />

      <h2>UB #10 — Strict aliasing</h2>
      <CodeBlock
        language="c"
        code={`/* Você não pode acessar memória de um TIPO via ponteiro pra OUTRO tipo
   (com poucas exceções: char*, void*, tipos compatíveis) */

float f = 3.14f;
int *p = (int*)&f;
int  bits = *p;        // ❌ UB — viola strict aliasing

/* Solução: union ou memcpy */
int bits;
memcpy(&bits, &f, sizeof(bits));    // ✅`}
      />

      <h2>UB sutil — exemplo real</h2>
      <BeforeAfter
        beforeLabel="❌ UB que parece funcionar"
        afterLabel="✅ Versão correta"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int* alocar(void) {
    int x = 42;
    return &x;
}
// retorna ponteiro
// pra variável LOCAL
// que MORREU
// → UB ao ler
// (talvez funcione
//  em -O0... no -O2
//  vira lixo)`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int* alocar(void) {
    int *p = malloc(
        sizeof(int));
    if (p) *p = 42;
    return p;
}
// chamador faz free()`}
          </pre>
        }
      />

      <h2>Por que o compilador "explora" UB</h2>
      <CodeBlock
        language="c"
        code={`/* Famoso bug do kernel Linux (CVE-2009-1897) */

struct sock *sk = tun->sk;     // 1. Usa o ponteiro
if (!tun) return;              // 2. Checa se é NULL — TARDE DEMAIS

/* gcc com -O2: */
/* "Se tun fosse NULL, linha 1 seria UB.
    Como UB nunca acontece, tun NUNCA é NULL.
    Logo, posso REMOVER a checagem da linha 2." */

/* Resultado: checagem some, kernel NULL-deref → exploitable */`}
      />

      <p>
        Lição: <strong>cheque ANTES de usar</strong>, nunca depois.
      </p>

      <h2>Como se defender de UB</h2>

      <h3>1. Compilador estrito</h3>
      <CodeBlock
        language="bash"
        code={`gcc -Wall -Wextra -Wpedantic -Werror -std=c11 \\
    -Wshadow -Wconversion -Wcast-align -Wstrict-prototypes`}
      />

      <h3>2. Sanitizers em DEV</h3>
      <CodeBlock
        language="bash"
        code={`# Combo poderoso
gcc -g -O1 -fsanitize=address,undefined -fno-omit-frame-pointer prog.c

# UBSan detecta runtime: overflow, deref NULL, shift inválido, etc.
# ASan detecta: use-after-free, buffer overflow, leak.`}
      />

      <h3>3. valgrind em CI</h3>
      <CodeBlock
        language="bash"
        code={`valgrind --error-exitcode=1 --leak-check=full ./prog`}
      />

      <h3>4. Análise estática</h3>
      <CodeBlock
        language="bash"
        code={`# clang
scan-build gcc -c programa.c

# cppcheck
cppcheck --enable=all programa.c`}
      />

      <h3>5. Padrões defensivos no código</h3>
      <CodeBlock
        language="c"
        code={`/* Sempre inicialize */
int *p = NULL;
int  x = 0;

/* Cheque ANTES de usar */
if (p && p->valor > 0) { ... }

/* Use unsigned se faz sentido (wrap-around definido) */
size_t i;

/* memcpy em vez de cast pra bypass aliasing */
memcpy(&dst, &src, sizeof(dst));

/* const pra detectar tentativa de write em literal */
const char *msg = "olá";

/* Use snprintf, fgets — funções com limite */
snprintf(buf, sizeof(buf), "%s", input);`}
      />

      <h2>Lista mental de UB pra revisar antes de commit</h2>
      <CodeBlock
        language="text"
        code={`☐  Toda variável foi inicializada?
☐  Todo malloc tem free correspondente?
☐  Todo ponteiro foi checado contra NULL antes de usar?
☐  Nenhum buffer overflow possível? (snprintf vs sprintf)
☐  Nenhuma operação de array com índice sem bounds check?
☐  Sem signed overflow possível? (use size_t/uint)
☐  Sem modificar literal "..."? (use const char*)
☐  Sem dereferência de ponteiro DEPOIS de free?
☐  Sem retorno de ponteiro pra variável local?
☐  Sem mistura de tipos via cast de ponteiro? (use memcpy)
☐  Sem múltiplas modificações da mesma var em uma expressão?`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`UB = comportamento INDEFINIDO. Compilador pode fazer QUALQUER coisa.

OS 10 UB MAIS COMUNS:
1. Dereferenciar NULL / ponteiro inválido
2. Buffer overflow
3. Signed overflow (use unsigned se for do tipo)
4. Modificar string literal (use const char*)
5. Múltiplas modificações em uma expressão
6. Divisão por zero
7. Acesso desalinhado
8. Ler variável não inicializada
9. Aritmética de ponteiro fora dos bounds
10. Strict aliasing (cast entre tipos via ponteiro)

DEFESAS:
- gcc -Wall -Wextra -Wpedantic -Werror
- gcc -fsanitize=address,undefined  (DEV)
- valgrind                           (CI)
- cppcheck / scan-build              (estática)
- Sempre inicialize, sempre cheque NULL,
  use snprintf, use const, prefira unsigned.

REGRA DE OURO: cheque ANTES de usar. Compilador assume que
UB não acontece e remove checagens "redundantes".`}
      />
    </PageContainer>
  );
}
