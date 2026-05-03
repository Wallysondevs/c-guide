import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Unions() {
  return (
    <PageContainer
      title={"Unions na prática"}
      subtitle={"Memória compartilhada entre membros: o jeito C de fazer \"tagged unions\", inspecionar bits e economizar RAM."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <h2>O conceito</h2>

      <p>Numa <code>union</code>, todos os membros ocupam o <strong>mesmo</strong> espaço de memória. O tamanho é o do maior membro.</p>

      <CodeBlock
        language="c"
        code={`union Valor {
    int   i;
    float f;
    char  bytes[4];
};

union Valor v;
v.f = 1.0f;
printf("bits do float: %02x %02x %02x %02x\\n",
    (unsigned char)v.bytes[0], (unsigned char)v.bytes[1],
    (unsigned char)v.bytes[2], (unsigned char)v.bytes[3]);`}
      />

      <h2>Tagged union (variant)</h2>

      <CodeBlock
        language="c"
        code={`typedef enum { T_INT, T_STR, T_LIST } Tag;
typedef struct {
    Tag tag;
    union {
        int   i;
        char *s;
        struct { int *ptr; size_t n; } list;
    } as;
} Value;

void print(Value v) {
    switch (v.tag) {
        case T_INT:  printf("%d\\n", v.as.i); break;
        case T_STR:  printf("%s\\n", v.as.s); break;
        case T_LIST: printf("lista[%zu]\\n", v.as.list.n); break;
    }
}`}
      />

      <AlertBox type="warning" title={"Type punning é minado"}>
        <p>Ler um membro diferente do que foi escrito é, tecnicamente, indefinido em C++. Em C é permitido (C99+) — mas confira alinhamento e endianness antes de confiar nos bytes.</p>
      </AlertBox>

      <h2>Anonymous union (C11)</h2>

      <CodeBlock
        language="c"
        code={`struct Vec3 {
    union {
        struct { float x, y, z; };
        float v[3];
    };
};

struct Vec3 p = { .x = 1, .y = 2, .z = 3 };
printf("%f\\n", p.v[2]);  // acessa z`}
      />
    </PageContainer>
  );
}
