import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ArgvArgs() {
  return (
    <PageContainer
      title={"argc, argv e getopt"}
      subtitle={"Receber argumentos da linha de comando e parsear flags como uma ferramenta de verdade."}
      difficulty={"iniciante"}
      timeToRead={"8 min"}
    >
      <CodeBlock
        language="c"
        code={`int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++)
        printf("argv[%d] = %s\\n", i, argv[i]);
}`}
      />

      <h2>Parsing com getopt</h2>

      <CodeBlock
        language="c"
        code={`#include <unistd.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    int verbose = 0;
    char *out = "saida.txt";
    int opt;
    while ((opt = getopt(argc, argv, "vo:h")) != -1) {
        switch (opt) {
            case 'v': verbose = 1; break;
            case 'o': out = optarg; break;
            case 'h': puts("uso: prog [-v] [-o arquivo]"); return 0;
            default:  return 1;
        }
    }
    for (int i = optind; i < argc; i++)
        printf("arg posicional: %s\\n", argv[i]);
}`}
      />

      <h2>Long options (GNU)</h2>

      <CodeBlock
        language="c"
        code={`#include <getopt.h>
struct option longopts[] = {
    { "verbose", no_argument,       0, 'v' },
    { "output",  required_argument, 0, 'o' },
    { 0,0,0,0 }
};
int opt = getopt_long(argc, argv, "vo:", longopts, NULL);`}
      />
    </PageContainer>
  );
}
