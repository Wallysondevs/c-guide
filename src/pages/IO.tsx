import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IO() {
  return (
    <PageContainer
      title="I/O e Arquivos"
      subtitle="A biblioteca <stdio.h> trabalha com FILE* — abstração que cobre arquivos no disco, stdin, stdout, pipes, sockets. Vamos ver o ciclo abrir → ler/escrever → fechar."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>FILE* — abstração geral</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>

FILE *f = fopen("dados.txt", "r");
if (!f) { perror("fopen"); return 1; }

/* ... ler/escrever ... */

fclose(f);

/* 3 streams pré-abertos sempre disponíveis: */
stdin    /* entrada padrão  (teclado / pipe) */
stdout   /* saída padrão     (terminal / pipe) — buffered */
stderr   /* saída de erros   (terminal) — sem buffer */`}
      />

      <h2>Modos de fopen</h2>
      <CodeBlock
        language="text"
        code={`"r"    leitura      — falha se não existe
"w"    escrita      — TRUNCA (apaga conteúdo) ou cria
"a"    append       — escreve no FIM, ou cria
"r+"   leitura+escrita — falha se não existe
"w+"   leitura+escrita — TRUNCA ou cria
"a+"   leitura+append  — leitura em qq lugar, escrita só no fim

Adicione "b" pra modo BINÁRIO (importante no Windows):
"rb", "wb", "rb+", "wb+", "ab+"`}
      />

      <AlertBox type="warning" title='"text" vs "binary" — só importa no Windows'>
        Em Linux/Mac, modo texto e binário são iguais. Em Windows,
        modo texto converte <code>\n</code> ↔ <code>\r\n</code>{" "}
        automaticamente — ÓTIMO pra texto, mas <strong>destruidor</strong>{" "}
        pra binário. Por garantia: pra texto use <code>"r"</code>/<code>"w"</code>;
        pra binário SEMPRE <code>"rb"</code>/<code>"wb"</code>.
      </AlertBox>

      <h2>Lendo arquivo TEXTO</h2>
      <CodeBlock
        language="c"
        code={`/* Por linha — fgets */
char linha[1024];
FILE *f = fopen("arq.txt", "r");
if (!f) { perror("fopen"); return 1; }

while (fgets(linha, sizeof(linha), f)) {
    /* linha inclui o '\\n' final (se couber) */
    linha[strcspn(linha, "\\n")] = '\\0';   // remove \\n
    printf(">> %s\\n", linha);
}

fclose(f);

/* Por caractere — fgetc / EOF */
int c;
while ((c = fgetc(f)) != EOF) {
    putchar(c);
}`}
      />

      <h2>Escrevendo</h2>
      <CodeBlock
        language="c"
        code={`FILE *f = fopen("saida.txt", "w");
if (!f) return 1;

fprintf(f, "Olá, %s! Você tem %d anos.\\n", nome, idade);
fputs("linha simples\\n", f);
fputc('A', f);

fclose(f);`}
      />

      <h2>Lendo/escrevendo BINÁRIO</h2>
      <CodeBlock
        language="c"
        code={`size_t fread (void *ptr, size_t tam, size_t n, FILE *f);
size_t fwrite(const void *ptr, size_t tam, size_t n, FILE *f);

/* Salvar struct em arquivo */
typedef struct { int id; char nome[32]; double saldo; } Cliente;

Cliente c = { 1, "Ana", 100.50 };
FILE *f = fopen("clientes.bin", "wb");
fwrite(&c, sizeof(c), 1, f);
fclose(f);

/* Ler de volta */
Cliente lido;
f = fopen("clientes.bin", "rb");
fread(&lido, sizeof(lido), 1, f);
printf("%d %s %.2f\\n", lido.id, lido.nome, lido.saldo);
fclose(f);`}
      />

      <AlertBox type="warning" title="Cuidado com portabilidade do binário">
        Salvar struct via <code>fwrite</code> grava bytes brutos —
        que dependem de <strong>endianness</strong>, <strong>padding</strong>,
        e tamanho de tipos. Salvo entre máquinas iguais é OK; entre
        ARM e x86, ou 32 e 64 bits, pode quebrar. Pra portabilidade
        real, use formato definido (JSON, MessagePack, ou
        serialização campo a campo com tipos fixos).
      </AlertBox>

      <h2>fseek / ftell / rewind — navegar pelo arquivo</h2>
      <CodeBlock
        language="c"
        code={`int fseek(FILE *f, long offset, int origem);
/* origens: SEEK_SET (início), SEEK_CUR (atual), SEEK_END (fim) */

/* Pra descobrir tamanho do arquivo: */
fseek(f, 0, SEEK_END);
long tam = ftell(f);
fseek(f, 0, SEEK_SET);    // ou rewind(f);

/* Pular pra posição N */
fseek(f, 100, SEEK_SET);   // posição 100 (0-indexed)`}
      />

      <h2>EOF e detecção de fim</h2>
      <CodeBlock
        language="c"
        code={`/* fgetc retorna int (NÃO char!) — porque EOF é -1 */
int c;
while ((c = fgetc(f)) != EOF) { ... }

/* Saber se foi EOF de verdade ou erro */
if (feof(f))   { /* fim do arquivo */ }
if (ferror(f)) { /* erro de I/O */ }`}
      />

      <h2>Exemplo prático: copiar arquivo</h2>
      <CodeBlock
        language="c"
        title="copiar.c"
        code={`#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "uso: %s origem destino\\n", argv[0]);
        return 1;
    }

    FILE *in  = fopen(argv[1], "rb");
    if (!in) { perror(argv[1]); return 1; }

    FILE *out = fopen(argv[2], "wb");
    if (!out) { perror(argv[2]); fclose(in); return 1; }

    char buf[4096];
    size_t n;
    while ((n = fread(buf, 1, sizeof(buf), in)) > 0) {
        if (fwrite(buf, 1, n, out) != n) {
            perror("fwrite");
            fclose(in); fclose(out);
            return 1;
        }
    }

    fclose(in);
    fclose(out);
    return 0;
}`}
      />

      <h2>Buffering</h2>
      <CodeBlock
        language="c"
        code={`/* stdout no terminal: line-buffered (descarrega no \\n)
   stdout em pipe: fully-buffered (acumula até 4KB)
   stderr: SEM buffer (escreve na hora) — por isso erros aparecem antes */

/* Forçar descarga */
fflush(stdout);

/* Mudar buffer */
setvbuf(f, NULL, _IONBF, 0);     // desligar buffer
setvbuf(f, NULL, _IOLBF, 0);     // line-buffered
setvbuf(f, buf, _IOFBF, 8192);   // full-buffered customizado`}
      />

      <h2>Redirecionar stdin/stdout (truque do shell)</h2>
      <CodeBlock
        language="bash"
        code={`./prog < entrada.txt        # stdin vem de arquivo
./prog > saida.txt          # stdout vai pra arquivo
./prog > saida.txt 2>&1     # stdout E stderr no mesmo arquivo
./prog 2> erros.txt         # só stderr no arquivo
./prog | grep ERRO          # stdout vira stdin do próximo processo`}
      />

      <p>
        Seu código nem precisa saber. <code>printf</code> sempre
        escreve em <code>stdout</code>; quem manda pra onde vai é o
        sistema operacional.
      </p>

      <h2>remove e rename</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>

remove("velho.txt");                       // apaga
rename("temp.txt", "final.txt");           // renomeia/move`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>

/* Abrir/Fechar */
FILE *f = fopen("path", "r"|"w"|"a"+"b"|"r+");
if (!f) { perror("fopen"); }
fclose(f);

/* Texto */
fgets(buf, sizeof(buf), f);
fprintf(f, "%d\\n", x);
fputs(s, f);
fputc(c, f);  fgetc(f);

/* Binário */
fread (ptr, sizeof(*ptr), n, f);
fwrite(ptr, sizeof(*ptr), n, f);

/* Navegar */
fseek(f, off, SEEK_SET|SEEK_CUR|SEEK_END);
long pos = ftell(f);
rewind(f);

/* Detectar fim */
while ((c = fgetc(f)) != EOF) {}
feof(f);  ferror(f);

/* Streams pré-abertos */
stdin, stdout, stderr

/* Buffer */
fflush(stdout);
setvbuf(...)

/* Sempre cheque retorno de fopen, fread, fwrite, fclose */`}
      />
    </PageContainer>
  );
}
