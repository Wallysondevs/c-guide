import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Escopo() {
  return (
    <PageContainer
      title="Escopo & Storage Classes"
      subtitle="Onde uma variável vive na memória, quanto tempo dura, e quem consegue enxergá-la — tudo isso é definido por escopo + storage class. Entender essas duas dimensões evita bugs sutis."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <h2>Os 3 níveis de escopo</h2>
      <CodeBlock
        language="c"
        code={`int  global = 10;          // (1) ESCOPO DE ARQUIVO — visível em todo o .c

int  funcao(int x) {       // (2) ESCOPO DE BLOCO — só dentro da função
    int local = 5;

    if (x > 0) {
        int interno = 1;   // (3) ESCOPO DE BLOCO mais aninhado — só no if
    }
    // 'interno' não existe mais aqui

    return local + global;
}`}
      />

      <h2>Sombreamento (shadowing)</h2>
      <BeforeAfter
        beforeLabel="❌ Variável local SOMBREIA a global"
        afterLabel="✅ Use nomes diferentes"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int contador = 0;

void f(void) {
    int contador = 5;
    contador++;
    // muda LOCAL, não global!
}`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`int g_contador = 0;

void f(void) {
    int local = 5;
    g_contador++;
    // claro qual é qual
}`}
          </pre>
        }
      />

      <p>
        Compile com <code>-Wshadow</code> e o gcc avisa.
      </p>

      <h2>Storage classes — quanto tempo a variável vive</h2>

      <h3>auto — o padrão (e ninguém escreve)</h3>
      <CodeBlock
        language="c"
        code={`void f(void) {
    auto int x = 5;       // explícito (raro)
    int y = 5;            // implícito — mesma coisa

    /* x e y são variáveis "automáticas":
       - vivem na STACK
       - criadas ao entrar na função
       - destruídas ao sair (valor perdido)  */
}`}
      />

      <h3>static — preserva valor entre chamadas</h3>
      <CodeBlock
        language="c"
        code={`void contar(void) {
    static int n = 0;     // inicializa UMA VEZ, valor preserva
    n++;
    printf("chamada %d\\n", n);
}

int main(void) {
    contar();    // chamada 1
    contar();    // chamada 2
    contar();    // chamada 3
    /* Vive no segmento de DADOS, não na stack */
}`}
      />

      <h3>static no escopo de arquivo — torna a função/variável "privada"</h3>
      <CodeBlock
        language="c"
        title="utils.c"
        code={`/* Sem static = visível em outros .c (link extern) */
int contador_publico = 0;

/* Com static no topo do arquivo = só visível DENTRO deste .c */
static int contador_privado = 0;
static int helper_interno(int x) { return x * 2; }

/* Funções/variáveis "privadas" do módulo */`}
      />

      <AlertBox type="success" title="Regra de ouro">
        Se algo NÃO precisa ser visto fora do .c, declare
        <code> static</code>. Diminui poluição de namespace, ajuda o
        compilador a otimizar e documenta a intenção.
      </AlertBox>

      <h3>extern — declara que existe em OUTRO arquivo</h3>
      <CodeBlock
        language="c"
        title="globals.h"
        code={`/* Em globals.h: declara (não define) */
extern int contador_publico;
extern void inicializar(void);`}
      />
      <CodeBlock
        language="c"
        title="globals.c"
        code={`/* Em globals.c: define (reserva memória de fato) */
int contador_publico = 0;
void inicializar(void) { ... }`}
      />
      <CodeBlock
        language="c"
        title="main.c"
        code={`#include "globals.h"

int main(void) {
    inicializar();
    contador_publico = 10;
}`}
      />

      <h3>register — sugere usar registrador (obsoleto)</h3>
      <CodeBlock
        language="c"
        code={`register int i;       // "tente colocar em registrador da CPU"

/* Compiladores modernos ignoram — eles otimizam melhor sozinhos.
   Único efeito legal: NÃO PODE pegar o endereço (&i é erro). */`}
      />

      <h2>Onde vive o quê — mapa da memória</h2>
      <CodeBlock
        language="text"
        code={`Memória do processo (esquema simplificado):

  +-----------------+  endereços altos
  |     STACK       |  ← variáveis locais (auto)
  |  ↓ cresce       |    parâmetros de função
  |                 |    endereço de retorno
  |                 |
  |  ↑ cresce       |  ← malloc / calloc
  |     HEAP        |
  +-----------------+
  | BSS             |  ← variáveis globais não inicializadas (zeradas)
  | DATA            |  ← globais inicializadas + static com valor
  | TEXT (CODE)     |  ← código compilado (read-only)
  +-----------------+  endereços baixos`}
      />

      <h2>Tabela rápida</h2>
      <CodeBlock
        language="text"
        code={`Declaração                  Onde vive    Quanto dura       Visibilidade
-----------------------------------------------------------------------
int x;  (dentro de função)   Stack       Da função          Bloco
static int x; (em função)    Data/BSS    Programa todo      Bloco
int x;  (no topo do .c)      Data/BSS    Programa todo      Outros .c (extern)
static int x; (no topo .c)   Data/BSS    Programa todo      SÓ deste .c
extern int x; (em qq lugar)  Data/BSS    Programa todo      Definida em outro .c
malloc(...)                  Heap        Até free()         Quem tem o ponteiro`}
      />

      <h2>Inicialização: quem zera o quê?</h2>
      <CodeBlock
        language="c"
        code={`/* Globais e static SEMPRE começam zeradas */
int g;                        // 0
static int s;                 // 0
char buf[100];                // tudo 0

void f(void) {
    int local;                // LIXO!
    static int once;          // 0 (zera UMA vez)

    int arr[10];              // LIXO!
    int arr2[10] = {0};       // todo zero (idiom)
    int arr3[10] = {1};       // [0]=1, resto = 0
}`}
      />

      <h2>Exemplo prático: contador único de IDs</h2>
      <CodeBlock
        language="c"
        code={`int proximo_id(void) {
    static int next = 1;      // só inicializa na 1ª chamada
    return next++;
}

/* Cada chamada retorna 1, 2, 3, 4...
   sem precisar de variável global. */`}
      />

      <h2>Exemplo prático: módulo "privado"</h2>
      <CodeBlock
        language="c"
        title="cache.c"
        code={`#include "cache.h"

/* Privados (invisíveis fora deste arquivo) */
static int  capacidade = 0;
static char *buffer = NULL;

static int hash(const char *chave) {
    /* implementação interna */
    return 0;
}

/* Públicos (declarados em cache.h) */
void cache_init(int n) { capacidade = n; ... }
void cache_set(const char *k, const char *v) { ... }`}
      />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="danger" title="NÃO retorne ponteiro pra variável local">
        <pre className="text-xs mt-2">{`char *nome(void) {
    char buf[100];
    sprintf(buf, "fulano");
    return buf;          // UB! buf morre ao retornar
}`}</pre>
        Solução: <code>static char buf[100]</code> (mas não é
        thread-safe), ou <code>malloc</code>, ou parâmetro de saída.
      </AlertBox>

      <AlertBox type="warning" title="Variável global = mal necessário">
        Globais facilitam atalho mas dificultam testar, paralelizar e
        manter. Se REALMENTE precisar, declare <code>static</code> e
        encapsule via funções "getter/setter".
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Onde declarar */
int x;                  // global público (extern em outros .c)
static int x;           // global "private" (só este .c)

void f(void) {
    int x;              // local (stack), LIXO
    int x = 0;          // local, inicializada
    static int x = 0;   // local mas sobrevive (data segment)
}

/* Tornar visível em outro .c */
extern int x;           // declara (não cria) — em .h

/* Linkagem */
static int helper() {}  // PRIVADA do .c
int api() {}            // PÚBLICA (default em escopo de arquivo)

/* Memória */
auto/local → stack
static/global → data/bss
malloc → heap
código → text`}
      />
    </PageContainer>
  );
}
