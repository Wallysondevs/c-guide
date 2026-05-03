import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Openmp() {
  return (
    <PageContainer
      title={"OpenMP: paralelismo declarativo"}
      subtitle={"Adicione `#pragma omp parallel for` e veja seu loop usar todos os cores. Rapidíssimo de adotar."}
      difficulty={"intermediario"}
      timeToRead={"9 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <omp.h>

#pragma omp parallel for
for (int i = 0; i < N; i++)
    saida[i] = funcao(entrada[i]);

// reduction:
double soma = 0;
#pragma omp parallel for reduction(+:soma)
for (int i = 0; i < N; i++) soma += v[i];`}
      />

      <CodeBlock
        language="bash"
        code={`gcc -fopenmp prog.c -o prog
OMP_NUM_THREADS=8 ./prog`}
      />

      <h2>Sections (paralelismo de tarefa)</h2>

      <CodeBlock
        language="c"
        code={`#pragma omp parallel sections
{
    #pragma omp section
    parte_a();
    #pragma omp section
    parte_b();
}`}
      />

      <AlertBox type="info" title={"Quando OpenMP brilha"}>
        <p>Loops independentes em arrays grandes (computação científica, processamento de imagem). Pra pipelines complexos ou IO assíncrono, pthreads ou bibliotecas como <code>libuv</code> são melhores.</p>
      </AlertBox>
    </PageContainer>
  );
}
