import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Structs() {
  return (
    <PageContainer
      title="Structs, Unions, Enums e Bitfields"
      subtitle="As 4 formas de C dizer 'modele seus dados'. Struct é o básico (e mais usado), enum dá nomes a constantes, union compartilha memória, e bitfields espremem campos em bits."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <h2>struct — agrupar dados relacionados</h2>
      <CodeBlock
        language="c"
        code={`struct Pessoa {
    char  nome[64];
    int   idade;
    float altura;
};

/* Declarar variável */
struct Pessoa p;
p.idade = 30;
strcpy(p.nome, "Wallyson");

/* Inicializar tudo */
struct Pessoa p = { "Ana", 25, 1.65 };

/* Designated initializers (C99) — RECOMENDADO */
struct Pessoa p = {
    .nome   = "Ana",
    .idade  = 25,
    .altura = 1.65
};`}
      />

      <h2>typedef — apaga o "struct"</h2>
      <CodeBlock
        language="c"
        code={`/* Forma verbose */
struct Pessoa { ... };
struct Pessoa p;       // sempre 'struct Pessoa'

/* Com typedef */
typedef struct {
    char nome[64];
    int  idade;
} Pessoa;

Pessoa p;              // 'struct' some

/* Combinando (auto-referência precisa do nome 'tag') */
typedef struct No {
    int valor;
    struct No *prox;   // tem que usar 'struct No' aqui (typedef ainda não existe)
} No;`}
      />

      <h2>Struct via ponteiro: . vs -&gt;</h2>
      <CodeBlock
        language="c"
        code={`Pessoa  p = { "Ana", 25, 1.65 };
Pessoa *pp = &p;

p.idade           // direto: ponto
(*pp).idade       // deref + ponto (chato)
pp->idade         // ↑ açúcar pra (*pp).idade — SEMPRE use isto`}
      />

      <h2>Passar struct pra função</h2>
      <CodeBlock
        language="c"
        code={`/* Passa CÓPIA — caro pra structs grandes */
void imprimir(Pessoa p) {
    printf("%s\\n", p.nome);
}

/* Passa PONTEIRO — barato + permite modificar */
void modificar(Pessoa *p) {
    p->idade++;
}

/* Passa const ptr — barato + protegido */
void imprimir(const Pessoa *p) {
    printf("%s\\n", p->nome);
}

/* IDIOM: pra struct > 16 bytes, sempre passe const T* */`}
      />

      <h2>Struct dentro de struct</h2>
      <CodeBlock
        language="c"
        code={`typedef struct {
    int dia, mes, ano;
} Data;

typedef struct {
    char nome[64];
    Data nascimento;        // struct ANINHADA
    Data ultimo_login;
} Usuario;

Usuario u = {
    .nome = "Ana",
    .nascimento = { .dia = 15, .mes = 7, .ano = 2000 }
};

printf("%d\\n", u.nascimento.ano);`}
      />

      <h2>Padding e alinhamento — onde estão os bytes "perdidos"</h2>
      <CodeBlock
        language="c"
        code={`struct Ruim {
    char  c;       // 1 byte
    int   n;       // 4 bytes
    char  c2;      // 1 byte
    double d;      // 8 bytes
};

printf("%zu\\n", sizeof(struct Ruim));    // 24 (não 14!)

/* Por quê? CPU acessa int em endereços múltiplos de 4, double de 8.
   Compilador insere PADDING pra alinhar: */

//  c    [pad pad pad]   n   n   n   n
//  c2   [pad pad pad pad pad pad pad]
//  d    d    d   d   d   d   d   d`}
      />

      <h2>Reordene pra economizar bytes</h2>
      <CodeBlock
        language="c"
        code={`struct Bom {
    double d;      // 8
    int    n;      // 4
    char   c;      // 1
    char   c2;     // 1
    /* 2 bytes de padding final pra próximo elemento alinhar */
};

printf("%zu\\n", sizeof(struct Bom));    // 16 (economizou 8 bytes!)

/* Regra prática: campos do MAIOR pro MENOR.
   Em arrays grandes, isso vira muita memória economizada. */`}
      />

      <h2>enum — constantes com nome</h2>
      <CodeBlock
        language="c"
        code={`enum Cor {
    VERMELHO,         // 0
    VERDE,            // 1
    AZUL              // 2
};

enum Cor c = VERDE;

/* Valores customizados */
enum Status {
    OK = 0,
    NAO_ENCONTRADO = 404,
    ERRO_INTERNO  = 500,
    TIMEOUT       = 408
};

/* typedef + enum */
typedef enum { N, S, L, O } Direcao;

Direcao d = N;`}
      />

      <h2>Enum pra flags (potências de 2)</h2>
      <CodeBlock
        language="c"
        code={`typedef enum {
    PERM_READ  = 1 << 0,    // 001
    PERM_WRITE = 1 << 1,    // 010
    PERM_EXEC  = 1 << 2,    // 100
} Perm;

int p = PERM_READ | PERM_WRITE;

if (p & PERM_WRITE) { ... }`}
      />

      <h2>union — campos que COMPARTILHAM memória</h2>
      <CodeBlock
        language="c"
        code={`/* Todos os campos vivem no MESMO espaço.
   Tamanho da union = tamanho do MAIOR campo. */

typedef union {
    int    i;
    float  f;
    char   bytes[4];
} Numero;

Numero n;
n.i = 0x41200000;
printf("%f\\n", n.f);          // 10.0 (lê os mesmos bytes como float)
printf("%02x %02x %02x %02x\\n",
       (unsigned char)n.bytes[0], (unsigned char)n.bytes[1],
       (unsigned char)n.bytes[2], (unsigned char)n.bytes[3]);`}
      />

      <h2>"Tagged union" — pattern comum</h2>
      <CodeBlock
        language="c"
        code={`typedef enum { TIPO_INT, TIPO_FLT, TIPO_STR } TipoValor;

typedef struct {
    TipoValor tipo;
    union {
        int    i;
        float  f;
        char  *s;
    };       /* anonymous union (C11) */
} Valor;

Valor v;
v.tipo = TIPO_STR;
v.s = "olá";

switch (v.tipo) {
    case TIPO_INT: printf("%d\\n", v.i); break;
    case TIPO_FLT: printf("%f\\n", v.f); break;
    case TIPO_STR: printf("%s\\n", v.s); break;
}

/* É a versão C de "sum type"/Variant. */`}
      />

      <h2>Bitfields — espremer campos em bits</h2>
      <CodeBlock
        language="c"
        code={`typedef struct {
    unsigned int leitura  : 1;     // 1 bit
    unsigned int escrita  : 1;     // 1 bit
    unsigned int execucao : 1;     // 1 bit
    unsigned int reservado: 5;     // 5 bits
} Permissoes;

printf("%zu\\n", sizeof(Permissoes));    // 4 (em 1 int) — não 4 ints!

Permissoes p = { .leitura = 1, .escrita = 0, .execucao = 1 };

/* Usado em: protocolos de rede, hardware mapping, drivers. */`}
      />

      <h2>Arrays de struct — caso comum</h2>
      <CodeBlock
        language="c"
        code={`Pessoa pessoas[100];

for (int i = 0; i < 100; i++) {
    pessoas[i].idade = 0;
    strcpy(pessoas[i].nome, "novo");
}

/* Inicializar parcial */
Pessoa pessoas[3] = {
    { .nome = "Ana",   .idade = 25 },
    { .nome = "Bruno", .idade = 30 },
    { .nome = "Cris",  .idade = 35 }
};`}
      />

      <h2>Struct com array de tamanho variável (FAM — C99)</h2>
      <CodeBlock
        language="c"
        code={`typedef struct {
    size_t len;
    char   data[];          // tamanho 0 — "Flexible Array Member"
} String;

/* Aloca header + n bytes em UMA chamada de malloc */
String *s = malloc(sizeof(String) + 100);
s->len = 100;
strcpy(s->data, "olá");

free(s);

/* Vantagem: 1 alocação só, melhor cache locality */`}
      />

      <h2>Comparar structs — não tem "=="</h2>
      <CodeBlock
        language="c"
        code={`struct A a1 = ..., a2 = ...;

if (a1 == a2) { ... }     // ❌ não compila

/* Use memcmp se a struct não tem padding/ponteiros: */
if (memcmp(&a1, &a2, sizeof(struct A)) == 0) { ... }

/* CUIDADO: padding entre campos pode conter LIXO.
   Pra ser seguro, faça uma função compara() campo a campo. */`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`/* struct */
typedef struct { int x, y; } Ponto;
Ponto p = { .x = 1, .y = 2 };
p.x;  pp->x;

/* Padding — campos do MAIOR pro MENOR */

/* enum */
typedef enum { A, B, C } E;
typedef enum { F1 = 1<<0, F2 = 1<<1 } Flag;   // pra flags

/* union — compartilha memória */
typedef union { int i; float f; } Numero;

/* Tagged union (sum type) */
struct { TipoTag t; union { int i; char *s; }; }

/* Bitfields — economiza bits */
struct { unsigned a:1, b:3, c:4; };

/* FAM — Flexible Array Member (C99) */
struct { size_t n; char data[]; };

/* Comparar struct — sem '=='; use compare campo a campo */`}
      />
    </PageContainer>
  );
}
