import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { BeforeAfter } from "@/components/ui/BeforeAfter";

export default function Stdio() {
  return (
    <PageContainer
      title="stdio aprofundado"
      subtitle="Você usa printf desde o primeiro hello world. Mas conhece TODOS os format specifiers? E sabe por que scanf é uma armadilha? Esse capítulo vai resolver."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <h2>printf — anatomia do format string</h2>
      <CodeBlock
        language="text"
        code={`%[flags][width][.precision][length]specifier

Exemplo:  %-10.3f
          ↑   ↑↑
          flag width.precision specifier`}
      />

      <h2>Specifiers (o que printar)</h2>
      <CodeBlock
        language="c"
        code={`%d  %i    int decimal             printf("%d\\n", 42)
%u        unsigned int            printf("%u\\n", 42u)
%o        octal                   printf("%o\\n", 8)     → 10
%x  %X    hex (min/maiusc)        printf("%x\\n", 255)   → ff
%b        binário (C23)           printf("%b\\n", 10)    → 1010

%f        float/double            printf("%f\\n", 3.14)  → 3.140000
%e  %E    notação científica      printf("%e\\n", 0.001) → 1.000000e-03
%g  %G    %f ou %e (mais curto)
%a  %A    hex float (raro)

%c        char                    printf("%c\\n", 'A')
%s        string (char*)          printf("%s\\n", "oi")
%p        pointer                 printf("%p\\n", &x)
%%        literal '%'             printf("%%\\n")
%n        ⚠ EVITE — escreve em ptr (vetor de exploits)`}
      />

      <h2>Length modifiers (qual tamanho do tipo)</h2>
      <CodeBlock
        language="c"
        code={`hh   char                printf("%hhd", (signed char)x)
h    short
l    long                printf("%ld", l)
ll   long long           printf("%lld", ll)
z    size_t              printf("%zu", sizeof(x))     ← sempre com sizeof!
j    intmax_t
t    ptrdiff_t
L    long double

/* CUIDADO: passar tipo errado = UB */
size_t n = 10;
printf("%d\\n", n);     // ❌ — em sistemas 64 bits, n é 64-bit; %d espera 32
printf("%zu\\n", n);    // ✅`}
      />

      <h2>Width e precision</h2>
      <CodeBlock
        language="c"
        code={`/* WIDTH — largura mínima (preenche com espaço) */
printf("[%10d]\\n", 42);      // [        42]
printf("[%-10d]\\n", 42);     // [42        ]   — '-' alinha à esq
printf("[%010d]\\n", 42);     // [0000000042]   — '0' preenche com zero

/* PRECISION */
/* Em float: casas decimais */
printf("%.2f\\n", 3.14159);   // 3.14
printf("%.0f\\n", 3.7);       // 4

/* Em string: limita tamanho */
printf("%.5s\\n", "abcdefghi");  // abcde

/* Em int: zeros à esquerda */
printf("%.5d\\n", 42);        // 00042

/* width + precision */
printf("%10.3f\\n", 3.14159); // "     3.142"

/* Width/precision dinâmica via * */
printf("%*d\\n", 10, 42);     // width = 10
printf("%.*f\\n", 2, 3.14159);// precision = 2`}
      />

      <h2>Flags úteis</h2>
      <CodeBlock
        language="c"
        code={`-     alinha à esquerda           %-10s
+     mostra sinal sempre         %+d  → +42  ou  -42
espaço espaço pra positivo        % d  → " 42" ou "-42"
0     preenche com zero           %05d → 00042
#     forma alternativa           %#x  → 0xff  /  %#o → 0755`}
      />

      <h2>Família printf</h2>
      <CodeBlock
        language="c"
        code={`printf (fmt, ...)                   /* stdout */
fprintf(f, fmt, ...)                /* arquivo / stderr */
sprintf(buf, fmt, ...)              /* ❌ INSEGURO — sem limite */
snprintf(buf, n, fmt, ...)          /* ✅ seguro — trunca em n-1 */
asprintf(&ptr, fmt, ...)            /* GNU — aloca e devolve em ptr (precisa free) */

dprintf(fd, fmt, ...)               /* POSIX — escreve em file descriptor */
vfprintf(f, fmt, va_list)           /* pra wrapper customizado */`}
      />

      <h2>snprintf é o seu novo melhor amigo</h2>
      <BeforeAfter
        beforeLabel="❌ sprintf — sem limite"
        afterLabel="✅ snprintf — sempre seguro"
        before={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char buf[20];
sprintf(buf,
        "%s tem %d anos",
        nome, idade);
// se nome é grande
// → buffer overflow`}
          </pre>
        }
        after={
          <pre className="text-xs text-slate-700 leading-relaxed">
            {`char buf[20];
snprintf(buf, sizeof(buf),
        "%s tem %d anos",
        nome, idade);
// trunca seguro,
// sempre termina '\\0'`}
          </pre>
        }
      />

      <h2>Por que scanf é uma armadilha</h2>
      <CodeBlock
        language="c"
        code={`/* PROBLEMAS de scanf("%s"): */
char nome[10];
scanf("%s", nome);        // ❌ sem limite de tamanho — overflow garantido

/* Solução parcial: limite explícito */
scanf("%9s", nome);       // ✅ ok — limita a 9 chars + '\\0'

/* Outro problema: deixa '\\n' no buffer */
int n;
char c;
scanf("%d", &n);          // lê 42
scanf("%c", &c);          // lê o '\\n' que sobrou — não o que o usuário quer!

/* Solução: " %c" (espaço pula whitespace) */
scanf(" %c", &c);

/* Outro problema: scanf retorna QUANTOS itens leu */
int x, y;
if (scanf("%d %d", &x, &y) != 2) {
    /* falhou */
}`}
      />

      <AlertBox type="success" title="Padrão moderno: fgets + parsing">
        <CodeBlock
          language="c"
          code={`/* Leia linha completa, depois faça parsing */
char linha[256];
if (fgets(linha, sizeof(linha), stdin)) {
    int x, y;
    if (sscanf(linha, "%d %d", &x, &y) == 2) {
        /* ok */
    }
}

/* OU use strtol pra integer (detecta erros melhor) */
char *fim;
long n = strtol(linha, &fim, 10);
if (fim == linha) { /* nada parseado */ }
if (*fim != '\\0' && *fim != '\\n') { /* lixo no fim */ }`}
        />
      </AlertBox>

      <h2>Format specifiers úteis em scanf</h2>
      <CodeBlock
        language="c"
        code={`%d  %i  %u  %o  %x      /* inteiros */
%lf  (não %f!)            /* double — diferente de printf! */
%c                        /* char — sem pular whitespace */
" %c"                     /* char — pulando whitespace */
%[abc]                    /* só caracteres a, b ou c */
%[^\\n]                   /* tudo até '\\n' (= ler linha sem \\n) */
%19s                      /* string com limite */
%*d                       /* lê e DESCARTA (não atribui) */`}
      />

      <h2>Formatos especiais úteis</h2>
      <CodeBlock
        language="c"
        code={`/* Tabelas alinhadas */
printf("%-15s %5d %10.2f\\n", "café", 3, 4.50);
printf("%-15s %5d %10.2f\\n", "leite", 2, 3.20);
//   café             3       4.50
//   leite            2       3.20

/* Hexdump */
unsigned char b[] = { 0x48, 0x65, 0x6c, 0x6c, 0x6f };
for (int i = 0; i < 5; i++) printf("%02X ", b[i]);
// 48 65 6C 6C 6F

/* Mostrar ponteiro */
int x;
printf("%p\\n", (void*)&x);    // 0x7ffd...

/* Notação científica */
printf("%.3e\\n", 1234567.0);  // 1.235e+06`}
      />

      <h2>Caracteres avulsos</h2>
      <CodeBlock
        language="c"
        code={`putchar('A');        // imprime UM char em stdout
putc('A', f);        // mesmo, em arquivo
fputc('A', f);       // alternativa

int c = getchar();   // lê UM char de stdin
int c = getc(f);     // de arquivo
int c = fgetc(f);    // alternativa

puts("oi");          // stdout + '\\n' automático
fputs("oi", f);      // SEM '\\n'`}
      />

      <h2>Linhas estilo POSIX getline</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>

char *linha = NULL;
size_t cap = 0;
ssize_t len;

while ((len = getline(&linha, &cap, stdin)) != -1) {
    /* getline ALOCA / REALOCA conforme necessário */
    printf("Linha (%zd chars): %s", len, linha);
}

free(linha);

/* Vantagem: aceita qualquer tamanho de linha sem você definir limite.
   POSIX (não C standard), mas disponível em Linux/Mac. */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* printf */
%d %u %x %o          /* inteiros */
%f %e %g             /* float */
%c %s                /* char/string */
%p                   /* pointer */
%zu                  /* size_t — sempre com sizeof */
%ld %lld             /* long, long long */

/* Width.precision */
%10.3f               /* 10 chars, 3 decimais */
%-10s                /* esquerda */
%05d                 /* zero-padded */

/* Família */
printf, fprintf, snprintf, sprintf(EVITE)
fprintf(stderr, ...)

/* Leitura — prefira fgets+sscanf a scanf direto */
fgets(buf, sizeof(buf), stdin);
sscanf(buf, "%d %d", &x, &y);

/* getline (POSIX) — sem limite de tamanho */`}
      />
    </PageContainer>
  );
}
