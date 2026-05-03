import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function UnityTests() {
  return (
    <PageContainer
      title={"Unity: framework de teste minimalista"}
      subtitle={"Single header, sem dependências, perfeito pra embarcado e projetos C puros."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        title="test_calc.c"
        code={`#include "unity.h"
#include "calc.h"

void setUp(void)    {}
void tearDown(void) {}

void test_soma_basica(void) {
    TEST_ASSERT_EQUAL_INT(5, soma(2, 3));
    TEST_ASSERT_EQUAL_INT(0, soma(-1, 1));
}

void test_divisao_zero(void) {
    int r;
    TEST_ASSERT_EQUAL_INT(-1, dividir(10, 0, &r));
}

int main(void) {
    UNITY_BEGIN();
    RUN_TEST(test_soma_basica);
    RUN_TEST(test_divisao_zero);
    return UNITY_END();
}`}
      />

      <CodeBlock
        language="bash"
        code={`gcc -I unity/src test_calc.c calc.c unity/src/unity.c -o tests
./tests`}
      />

      <h2>Asserts úteis</h2>

      <ul>
        <li><code>TEST_ASSERT_EQUAL_INT/STRING/MEMORY</code></li>
        <li><code>TEST_ASSERT_FLOAT_WITHIN(eps, esp, real)</code></li>
        <li><code>TEST_ASSERT_NULL</code>, <code>NOT_NULL</code></li>
        <li><code>TEST_ASSERT_EACH_EQUAL_INT(esp, arr, n)</code></li>
      </ul>

      <AlertBox type="info" title={"Ceedling"}>
        <p>Quer roda uma estrutura de projeto com Unity, CMock e build automático? <code>ceedling new meu_proj</code> e tudo está pronto.</p>
      </AlertBox>
    </PageContainer>
  );
}
