import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Typedef() {
  return (
    <PageContainer
      title={"Typedef sem dor"}
      subtitle={"Apelidos de tipo bem usados deixam o código legível; mal usados, escondem bugs. As regras práticas."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <h2>Sintaxe</h2>

      <CodeBlock
        language="c"
        code={`typedef unsigned long long u64;
typedef struct ponto { int x, y; } Ponto;
typedef int (*Comparador)(const void *, const void *);

u64 contador = 0;
Ponto p = { 3, 4 };
Comparador c = strcmp_wrapper;`}
      />

      <h2>Quando usar</h2>

      <ul>
        <li>Tipos longos/complicados: ponteiros pra função, structs gigantes.</li>
        <li>Padronizar tamanhos: <code>uint32_t</code>, <code>size_t</code>, <code>off_t</code>.</li>
        <li>Encapsular detalhes: <code>typedef struct File File;</code> em header expõe handle opaco.</li>
      </ul>

      <h2>Quando NÃO usar</h2>

      <ul>
        <li>Esconder ponteiro: <code>typedef Foo* FooPtr;</code> faz o leitor procurar onde é ponteiro. Prefira deixar o <code>*</code> visível.</li>
        <li>Renomear tipos primitivos sem motivo: <code>typedef int Inteiro;</code> não ajuda ninguém.</li>
      </ul>

      <AlertBox type="info" title={"Convenção do kernel Linux"}>
        <p>O Linux evita typedef de struct propositadamente — quer que você leia <code>struct task_struct</code> e saiba que é struct. É um estilo defensável; siga o estilo do projeto onde está.</p>
      </AlertBox>
    </PageContainer>
  );
}
