import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AdtModulo() {
  return (
    <PageContainer
      title={"ADT e módulos"}
      subtitle={"Tipos abstratos de dados em C: cada arquivo é um \"objeto\" com interface mínima e implementação privada."}
      difficulty={"intermediario"}
      timeToRead={"8 min"}
    >
      <p>Um módulo bem escrito tem: header pequeno, .c todo <code>static</code> exceto a interface, sem variáveis globais expostas, dependências mínimas.</p>

      <CodeBlock
        language="c"
        title="cache.h"
        code={`typedef struct Cache Cache;
Cache *cache_nova(size_t max);
void   cache_set(Cache *c, const char *k, const void *v, size_t n);
int    cache_get(Cache *c, const char *k, void **v, size_t *n);
void   cache_destruir(Cache *c);`}
      />

      <h2>Regras de ouro</h2>

      <ul>
        <li>Cabeçalho expõe só o necessário.</li>
        <li>Funções públicas levam o handle como primeiro parâmetro.</li>
        <li>Estado interno é <code>static</code> ou dentro do struct opaco — nunca global no .c.</li>
        <li>Documente ownership: quem aloca, quem libera.</li>
      </ul>

      <AlertBox type="info" title={"Convenção de nomes"}>
        <p>Prefixe tudo: <code>cache_*</code>, <code>img_*</code>, <code>net_*</code>. C não tem namespace; o prefixo é o seu namespace.</p>
      </AlertBox>
    </PageContainer>
  );
}
