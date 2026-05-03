import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TddEmC() {
  return (
    <PageContainer
      title={"TDD em C na prática"}
      subtitle={"Red-green-refactor funciona em C? Sim — só precisa estruturar o código pra testar (sem globais, com módulos pequenos)."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <h2>O ciclo</h2>

      <ol>
        <li><strong>Red</strong>: escreva o teste; ele falha (a função nem existe).</li>
        <li><strong>Green</strong>: escreva o mínimo de código pra passar.</li>
        <li><strong>Refactor</strong>: limpe sem mudar comportamento; testes continuam verdes.</li>
      </ol>

      <h2>Estrutura de projeto que ajuda</h2>

      <CodeBlock
        language="text"
        code={`meu_proj/
├── src/
│   ├── parser.c
│   ├── parser.h
│   ├── eval.c
│   └── eval.h
├── tests/
│   ├── test_parser.c
│   └── test_eval.c
└── Makefile`}
      />

      <CodeBlock
        language="makefile"
        code={`test: build/test_parser build/test_eval
	@for t in $^; do ./$$t || exit 1; done
build/test_%: tests/test_%.c src/%.c
	$(CC) -I src $^ unity.c -o $@`}
      />

      <AlertBox type="success" title={"Bônus: integração com sanitizers"}>
        <p>Compile a suite com <code>-fsanitize=address,undefined</code>. TDD + ASan = bugs aparecem na hora.</p>
      </AlertBox>
    </PageContainer>
  );
}
