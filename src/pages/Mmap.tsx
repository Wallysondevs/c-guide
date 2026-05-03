import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mmap() {
  return (
    <PageContainer
      title={"mmap: arquivo como memória"}
      subtitle={"Mapeie um arquivo direto na sua memória virtual e leia/escreva como se fosse array. Mais rápido que read/write."}
      difficulty={"avancado"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int fd = open("dados.bin", O_RDONLY);
struct stat st; fstat(fd, &st);

void *p = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
if (p == MAP_FAILED) { perror("mmap"); return 1; }

// usar como array:
uint32_t *u = p;
for (size_t i = 0; i < st.st_size / 4; i++) ...

munmap(p, st.st_size);
close(fd);`}
      />

      <h2>Vantagens</h2>

      <ul>
        <li>Sem cópia entre kernel e userspace: o cache do SO é a sua memória.</li>
        <li>Random access em arquivos grandes sem <code>fseek</code>.</li>
        <li>Compartilhamento entre processos via <code>MAP_SHARED</code>.</li>
      </ul>

      <h2>Memória anônima (alternativa a malloc grande)</h2>

      <CodeBlock
        language="c"
        code={`void *buf = mmap(NULL, 1ul << 30, PROT_READ | PROT_WRITE,
                 MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
// 1 GiB de memória virtual; só páginas tocadas viram RAM real.`}
      />

      <AlertBox type="warning" title={"SIGBUS se arquivo encolhe"}>
        <p>Se outro processo trunca o arquivo enquanto você tem mmap, acessar a região cortada gera SIGBUS. Em arquivos compartilháveis, use <code>flock</code> ou tenha cuidado.</p>
      </AlertBox>
    </PageContainer>
  );
}
