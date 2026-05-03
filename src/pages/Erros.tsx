import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Erros() {
  return (
    <PageContainer
      title="Erros, assert e gdb"
      subtitle="C não tem exceções. Erros viram códigos de retorno + errno. E quando algo da errado, gdb é a ferramenta que separa quem perde 3 horas de quem perde 3 minutos pra achar o bug."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <h2>O modelo de erros do C</h2>
      <CodeBlock
        language="c"
        code={`/* Convenção 1: retorno SINALIZA sucesso/erro */
int rc = funcao();
if (rc != 0) {
    /* erro — rc tem o código */
}

/* Convenção 2: retorno é o resultado, errno tem o erro */
FILE *f = fopen("x.txt", "r");
if (!f) {
    /* errno tem o motivo */
    perror("fopen");                // imprime "fopen: No such file..."
}

/* Convenção 3: retorno -1 + errno (POSIX) */
int fd = open("x", O_RDONLY);
if (fd < 0) {
    fprintf(stderr, "open: %s\\n", strerror(errno));
}`}
      />

      <h2>errno — variável global de erro</h2>
      <CodeBlock
        language="c"
        code={`#include <errno.h>
#include <string.h>

errno = 0;                         // SEMPRE zere antes
long n = strtol(input, &fim, 10);
if (errno == ERANGE) {
    fprintf(stderr, "overflow\\n");
}

/* Códigos comuns */
ENOENT       No such file or directory
EACCES       Permission denied
EINVAL       Invalid argument
ENOMEM       Out of memory
EAGAIN       Resource temporarily unavailable
EINTR        Interrupted system call
EEXIST       File exists
EIO          I/O error

/* errno é THREAD-LOCAL nos sistemas modernos — cada thread tem o seu */`}
      />

      <h2>perror vs strerror</h2>
      <CodeBlock
        language="c"
        code={`/* perror — escreve em stderr: "prefixo: mensagem do errno" */
perror("fopen");
// → fopen: No such file or directory

/* strerror — retorna a mensagem como string (mais flexível) */
fprintf(stderr, "Erro lendo %s: %s\\n", path, strerror(errno));`}
      />

      <h2>Padrão "early return" com cleanup</h2>
      <CodeBlock
        language="c"
        code={`int processar(const char *path) {
    FILE *f = NULL;
    char *buf = NULL;
    int rc = -1;

    f = fopen(path, "r");
    if (!f) {
        perror("fopen");
        goto cleanup;
    }

    buf = malloc(4096);
    if (!buf) {
        perror("malloc");
        goto cleanup;
    }

    if (fread(buf, 1, 4096, f) == 0) {
        if (ferror(f)) {
            perror("fread");
            goto cleanup;
        }
    }

    /* sucesso */
    rc = 0;

cleanup:
    free(buf);
    if (f) fclose(f);
    return rc;
}`}
      />

      <h2>assert — "isso NUNCA pode acontecer"</h2>
      <CodeBlock
        language="c"
        code={`#include <assert.h>

void inserir(Lista *l, int valor) {
    assert(l != NULL);            // pré-condição: ponteiro não pode ser NULL
    assert(l->len < l->cap);      // invariante: tem espaço
    l->dados[l->len++] = valor;
}

/* Se condição for falsa → mensagem + abort() */
// Assertion failed: l != NULL, file lista.c, line 42

/* DESLIGAR em release: */
gcc -DNDEBUG release.c       // todos asserts viram no-op (zero custo)`}
      />

      <AlertBox type="danger" title="NÃO ponha lógica em assert">
        <pre className="text-xs mt-2">{`assert(remover(p) == 0);    // ❌ em release, remover() NÃO é chamado!

int rc = remover(p);          // ✅
assert(rc == 0);`}</pre>
        Em release com NDEBUG, o conteúdo do <code>assert</code> é
        removido inteiro — efeitos colaterais somem.
      </AlertBox>

      <h2>_Static_assert — checagem em COMPILE TIME</h2>
      <CodeBlock
        language="c"
        code={`/* C11+ */
_Static_assert(sizeof(int) == 4, "preciso de int 32-bit");
_Static_assert(sizeof(void*) == 8, "só funciona em 64-bit");

/* Útil pra protocolos de rede, layouts de struct, etc. */
typedef struct __attribute__((packed)) {
    uint8_t  tipo;
    uint16_t tamanho;
    uint32_t timestamp;
} PacoteHeader;

_Static_assert(sizeof(PacoteHeader) == 7, "tamanho do header mudou!");`}
      />

      <h2>gdb — o debugger</h2>
      <CodeBlock
        language="bash"
        code={`# 1. Compile com símbolos de debug
gcc -g -O0 programa.c -o programa

# 2. Inicie
gdb ./programa

# Ou direto com argumentos
gdb --args ./programa arg1 arg2`}
      />

      <h2>Comandos essenciais do gdb</h2>
      <CodeBlock
        language="text"
        code={`run / r              roda o programa (até crash ou breakpoint)
break main / b 42    breakpoint em função / linha
break arq.c:10       breakpoint em outro arquivo
delete <n>           remove breakpoint

continue / c         continua até próximo break
next / n             próxima linha (PULA chamadas de função)
step / s             próxima linha (ENTRA em chamadas)
finish               roda até função retornar
until <linha>        roda até linha N

print x / p x        mostra valor de x
p *p                 mostra valor apontado
p arr[0]@10          mostra 10 elementos de arr
p/x x                em hex; p/t em binário

backtrace / bt       pilha de chamadas (essencial em crash!)
frame <n>            muda pra frame N da pilha
list / l             mostra código da linha atual
info locals          variáveis locais
info args            argumentos da função

watch <var>          quebra quando var MUDAR
display <expr>       mostra automaticamente a cada step

quit / q             sair`}
      />

      <h2>Sessão típica de debug — segfault</h2>
      <CodeBlock
        language="text"
        code={`$ gcc -g programa.c -o programa
$ ./programa
Segmentation fault (core dumped)

$ gdb ./programa
(gdb) run
Program received signal SIGSEGV, Segmentation fault.
0x000... in processar (s=0x0) at programa.c:12
12          printf("%s\\n", s);

(gdb) bt                 ← onde estamos?
#0  processar (s=0x0) at programa.c:12
#1  0x... in main () at programa.c:20

(gdb) frame 1             ← sobe pro main
#1  ... main () at programa.c:20
20          processar(NULL);  ← achei! passei NULL

(gdb) p s
$1 = 0x0

(gdb) quit`}
      />

      <h2>core dumps — debug post-mortem</h2>
      <CodeBlock
        language="bash"
        code={`# Habilitar core dump
ulimit -c unlimited

# Rodar — se crashar, gera 'core' (ou 'core.PID')
./programa
# Segmentation fault (core dumped)

# Investigar
gdb ./programa core
(gdb) bt           # vê pilha do momento do crash`}
      />

      <h2>AddressSanitizer — debugger ATIVO em runtime</h2>
      <CodeBlock
        language="bash"
        code={`gcc -g -fsanitize=address -fno-omit-frame-pointer programa.c -o programa
./programa

# Detecta automaticamente:
# - use-after-free
# - heap/stack buffer overflow
# - double free
# - memory leak

# Mensagem detalhada com stack trace de:
# - onde alocou
# - onde liberou
# - onde usou indevidamente

# Combo perfeito: gcc -g -O0 -fsanitize=address,undefined`}
      />

      <h2>UBSan — detecta Undefined Behavior</h2>
      <CodeBlock
        language="bash"
        code={`gcc -g -fsanitize=undefined programa.c -o programa
./programa

# Detecta em runtime:
# - signed integer overflow
# - shift por valor inválido
# - divisão por zero
# - desreferência de NULL
# - acesso desalinhado`}
      />

      <h2>printf debugging — ainda funciona</h2>
      <CodeBlock
        language="c"
        code={`/* Macro de debug condicional */
#ifdef DEBUG
  #define DBG(...) fprintf(stderr, "[%s:%d] " __VA_ARGS__)
#else
  #define DBG(...) ((void)0)
#endif

DBG("x = %d, p = %p\\n", x, p);

/* Compile com -DDEBUG pra ativar */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* Erros — códigos de retorno */
int rc = func();
if (rc < 0) { perror("func"); }

/* errno (sempre zere antes!) */
errno = 0;
strtol(...);
if (errno) { fprintf(stderr, "%s\\n", strerror(errno)); }

/* Cleanup com goto */
if (!ptr) goto cleanup;
cleanup: free(...); fclose(...);

/* assert pra invariantes */
assert(p != NULL);
_Static_assert(sizeof(X) == 16, "...");

/* Compile pra debug */
gcc -g -O0 -fsanitize=address,undefined ...

/* gdb */
gdb ./prog
b main, run, next, print x, bt, continue, quit

/* Ferramentas */
- gdb           (debugger interativo)
- valgrind      (memória pós-execução)
- ASan/UBSan    (sanitizers em runtime)`}
      />
    </PageContainer>
  );
}
