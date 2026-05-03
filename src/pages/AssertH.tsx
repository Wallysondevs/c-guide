import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AssertH() {
  return (
    <PageContainer
      title={"assert.h: pré-condições e invariantes"}
      subtitle={"A diferença entre `assert` e tratamento de erro, e quando habilitar/desabilitar com NDEBUG."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <assert.h>

void set_pixel(Img *img, int x, int y, uint32_t cor) {
    assert(img != NULL);
    assert(x >= 0 && x < img->w);
    assert(y >= 0 && y < img->h);
    img->pixels[y * img->w + x] = cor;
}`}
      />

      <h2>Quando usar</h2>

      <ul>
        <li><strong>Pré-condições</strong>: argumentos que o chamador prometeu garantir.</li>
        <li><strong>Invariantes</strong>: estados internos que devem ser sempre verdadeiros.</li>
        <li><strong>Bugs do programador</strong>, não erros de usuário.</li>
      </ul>

      <h2>Quando NÃO usar</h2>

      <ul>
        <li>Validar input do usuário ou rede (use <code>if + return -1</code>).</li>
        <li>Verificar resultado de <code>malloc</code> em produção (assert some com NDEBUG).</li>
      </ul>

      <AlertBox type="warning" title={"NDEBUG remove tudo"}>
        <p>Compilar com <code>-DNDEBUG</code> faz <code>assert(x)</code> virar nada. Cuidado: <code>assert(x = malloc(...))</code> some o efeito colateral em release. Nunca coloque lógica importante dentro de <code>assert</code>.</p>
      </AlertBox>

      <h2>static_assert (C11)</h2>

      <CodeBlock
        language="c"
        code={`#include <assert.h>
static_assert(sizeof(int) >= 4, "preciso int de 32 bits");
static_assert(sizeof(struct pkt) == 64, "layout quebrado");`}
      />
    </PageContainer>
  );
}
