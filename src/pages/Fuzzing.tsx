import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Fuzzing() {
  return (
    <PageContainer
      title={"Fuzzing com AFL++ e libFuzzer"}
      subtitle={"Bombardear seu programa com input aleatório guiado por cobertura. Como projetos sérios encontram bugs antes do atacante."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <h2>libFuzzer (mais simples)</h2>

      <CodeBlock
        language="c"
        title="fuzz.c"
        code={`#include <stdint.h>
#include <stddef.h>

int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    parse_input(data, size);
    return 0;
}`}
      />

      <CodeBlock
        language="bash"
        code={`clang -g -O1 -fsanitize=fuzzer,address fuzz.c parser.c -o fuzz
./fuzz                # roda até achar crash
./fuzz corpus/        # com seeds iniciais`}
      />

      <h2>AFL++ (genético)</h2>

      <CodeBlock
        language="bash"
        code={`afl-clang-fast -O2 prog.c -o prog
mkdir input
echo "hello" > input/seed1
afl-fuzz -i input -o output -- ./prog @@`}
      />

      <AlertBox type="success" title={"Funciona de verdade"}>
        <p>OSS-Fuzz da Google encontrou &gt;40000 bugs em projetos abertos (libpng, OpenSSL, FFmpeg, Linux kernel). Adicionar fuzzing é talvez o melhor ROI em qualidade pra projeto C.</p>
      </AlertBox>
    </PageContainer>
  );
}
