import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Cmocka() {
  return (
    <PageContainer
      title={"cmocka e mocking"}
      subtitle={"Framework com suporte nativo a mocks, fixtures e testes de morte. Padrão em projetos GNOME."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <stdarg.h>
#include <stddef.h>
#include <setjmp.h>
#include <cmocka.h>

static void test_string(void **state) {
    (void)state;
    assert_string_equal("ola", "ola");
}

int main(void) {
    const struct CMUnitTest tests[] = {
        cmocka_unit_test(test_string),
    };
    return cmocka_run_group_tests(tests, NULL, NULL);
}`}
      />

      <h2>Mock de função</h2>

      <CodeBlock
        language="c"
        code={`// função real
int le_arquivo(const char *p, char *buf, size_t n);

// mock no teste
int __wrap_le_arquivo(const char *p, char *buf, size_t n) {
    check_expected(p);
    strcpy(buf, mock_ptr_type(char *));
    return mock_type(int);
}

// no teste:
expect_string(__wrap_le_arquivo, p, "/etc/conf");
will_return(__wrap_le_arquivo, "linha = valor");
will_return(__wrap_le_arquivo, 13);`}
      />

      <CodeBlock
        language="bash"
        code={`gcc test.c -lcmocka -Wl,--wrap=le_arquivo -o tests`}
      />
    </PageContainer>
  );
}
