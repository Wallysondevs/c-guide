import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Dlopen() {
  return (
    <PageContainer
      title={"dlopen: carregar biblioteca em runtime"}
      subtitle={"Plugins e arquitetura modular: abra um .so, pegue ponteiro pra função, chame."}
      difficulty={"avancado"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        title="plugin.c (vira plugin.so)"
        code={`#include <stdio.h>
int somar(int a, int b) { return a + b; }
void hello(void) { puts("oi do plugin"); }`}
      />

      <CodeBlock
        language="bash"
        code={`gcc -shared -fPIC -o plugin.so plugin.c`}
      />

      <CodeBlock
        language="c"
        title="host.c"
        code={`#include <dlfcn.h>

void *h = dlopen("./plugin.so", RTLD_NOW);
if (!h) { fprintf(stderr, "%s\\n", dlerror()); return 1; }

int (*soma)(int,int) = dlsym(h, "somar");
void (*hello)(void)  = dlsym(h, "hello");

printf("%d\\n", soma(2, 3));
hello();

dlclose(h);`}
      />

      <CodeBlock
        language="bash"
        code={`gcc host.c -o host -ldl`}
      />

      <AlertBox type="warning" title={"Cast de void* pra função é UB estrito"}>
        <p>O padrão C separa "objeto" e "função"; <code>dlsym</code> retorna <code>void*</code>. Na prática POSIX garante que funciona, mas o GCC pode reclamar — use <code>(void (*)(void))</code> com cast intermediário.</p>
      </AlertBox>

      <p>Padrão de plugin: cada .so exporta <code>plugin_register</code> que devolve uma struct de ponteiros pra função. O host só conhece a interface.</p>
    </PageContainer>
  );
}
