import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoJsonParser() {
  return (
    <PageContainer
      title={"Projeto: parser JSON do zero"}
      subtitle={"Tokenizer + parser recursivo descendente. Entenda como bibliotecas que você usa funcionam."}
      difficulty={"avancado"}
      timeToRead={"20 min"}
    >
      <CodeBlock
        language="c"
        title="json.c (esqueleto)"
        code={`typedef enum { J_NULL, J_BOOL, J_NUM, J_STR, J_ARR, J_OBJ } JType;

typedef struct JNode {
    JType tipo;
    union {
        int    b;
        double n;
        char  *s;
        struct { struct JNode **itens; size_t n; } arr;
        struct { char **chaves; struct JNode **valores; size_t n; } obj;
    } v;
} JNode;

typedef struct {
    const char *src;
    size_t pos;
} Parser;

static void pular_ws(Parser *p) {
    while (p->src[p->pos] && strchr(" \\t\\n\\r", p->src[p->pos])) p->pos++;
}

static JNode *parse_valor(Parser *p);

static JNode *parse_string(Parser *p) {
    p->pos++;   // pula "
    size_t inicio = p->pos;
    while (p->src[p->pos] && p->src[p->pos] != '"') p->pos++;
    size_t len = p->pos - inicio;
    char *s = malloc(len + 1);
    memcpy(s, p->src + inicio, len);
    s[len] = 0;
    p->pos++;   // pula "
    JNode *n = calloc(1, sizeof *n);
    n->tipo = J_STR; n->v.s = s;
    return n;
}

static JNode *parse_numero(Parser *p) {
    char *fim;
    double d = strtod(p->src + p->pos, &fim);
    p->pos = fim - p->src;
    JNode *n = calloc(1, sizeof *n);
    n->tipo = J_NUM; n->v.n = d;
    return n;
}

// parse_array, parse_object e parse_valor: similar`}
      />

      <h2>Por que vale a pena</h2>

      <ul>
        <li>Recursão descendente é a técnica de parser mais usada (compiladores incluso).</li>
        <li>Treina ownership: cada nó precisa ser liberado.</li>
        <li>Lapida tratamento de erros e recovery.</li>
        <li>Vira base pra parser de YAML, TOML, query DSL...</li>
      </ul>

      <AlertBox type="info" title={"Próximo nível"}>
        <p>Implemente unicode escape (<code>\u00e1</code>), números com expoente, validação rigorosa contra RFC 8259, e teste contra <a href="https://github.com/nst/JSONTestSuite">JSONTestSuite</a>.</p>
      </AlertBox>
    </PageContainer>
  );
}
