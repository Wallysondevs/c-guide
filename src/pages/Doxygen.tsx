import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Doxygen() {
  return (
    <PageContainer
      title={"Doxygen: gerar documentação"}
      subtitle={"Comentários especiais geram HTML/PDF navegável. Padrão de fato pra projetos C/C++."}
      difficulty={"iniciante"}
      timeToRead={"7 min"}
    >
      <CodeBlock
        language="c"
        code={`/**
 * Soma os elementos de um array.
 * \\param v   Ponteiro para o array.
 * \\param n   Quantidade de elementos.
 * \\return    A soma.
 * \\warning   Não verifica overflow.
 */
int soma(const int *v, size_t n);`}
      />

      <CodeBlock
        language="bash"
        code={`doxygen -g Doxyfile           # gera config inicial
# editar: PROJECT_NAME, INPUT, OUTPUT_DIRECTORY, EXTRACT_ALL = YES
doxygen Doxyfile
# abre html/index.html`}
      />

      <h2>Tags úteis</h2>

      <ul>
        <li><code>\param nome desc</code></li>
        <li><code>\return desc</code></li>
        <li><code>\note</code>, <code>\warning</code>, <code>\bug</code></li>
        <li><code>\code ... \endcode</code></li>
        <li><code>\see funcao_relacionada</code></li>
      </ul>

      <AlertBox type="info" title={"Combine com Graphviz"}>
        <p>Com <code>HAVE_DOT = YES</code>, Doxygen gera diagramas de chamadas, includes e classes. Ótimo pra entender base de código grande.</p>
      </AlertBox>
    </PageContainer>
  );
}
