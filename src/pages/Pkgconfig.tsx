import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pkgconfig() {
  return (
    <PageContainer
      title={"pkg-config"}
      subtitle={"A ferramenta universal pra descobrir flags de compilação e linkagem de bibliotecas instaladas."}
      difficulty={"iniciante"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="bash"
        code={`pkg-config --cflags glib-2.0
# -I/usr/include/glib-2.0 -I/usr/lib/x86_64-linux-gnu/glib-2.0/include

pkg-config --libs glib-2.0
# -lglib-2.0

gcc app.c $(pkg-config --cflags --libs glib-2.0) -o app`}
      />

      <h2>Em Makefile</h2>

      <CodeBlock
        language="makefile"
        code={`CFLAGS  += $(shell pkg-config --cflags glib-2.0 libcurl)
LDFLAGS += $(shell pkg-config --libs   glib-2.0 libcurl)`}
      />

      <h2>Criar seu próprio .pc</h2>

      <CodeBlock
        language="text"
        title="mlib.pc"
        code={`prefix=/usr/local
exec_prefix=\${prefix}
libdir=\${exec_prefix}/lib
includedir=\${prefix}/include

Name: mlib
Description: Minha lib
Version: 1.0
Libs: -L\${libdir} -lmlib
Cflags: -I\${includedir}`}
      />

      <AlertBox type="info" title={"Por que existe"}>
        <p>Sem pkg-config, todo Makefile vira "tente <code>-I/usr/include/X</code>... agora <code>/usr/local/include/X</code>... agora MacPorts...". O .pc resolve em uma linha.</p>
      </AlertBox>
    </PageContainer>
  );
}
