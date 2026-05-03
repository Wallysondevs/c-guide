import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hello() {
  return (
    <PageContainer
      title="Hello World & Compilação"
      subtitle="Antes de qualquer linha de C, você precisa entender o que acontece quando você compila. Spoiler: o seu .c passa por 4 etapas até virar um executável. Vamos ver cada uma."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <h2>O ritual: hello.c</h2>
      <CodeBlock
        language="c"
        title="hello.c"
        code={`#include <stdio.h>

int main(void) {
    printf("Olá, mundo!\\n");
    return 0;
}`}
      />
      <p>
        Linha por linha, sem mistério:
      </p>
      <ul>
        <li><code>#include &lt;stdio.h&gt;</code> — pede ao pré-processador pra "colar" aqui o cabeçalho da biblioteca padrão de I/O (que define <code>printf</code>).</li>
        <li><code>int main(void)</code> — toda execução começa em <code>main</code>. Retorna <code>int</code> (código de saída) e recebe nada (<code>void</code>).</li>
        <li><code>printf(...)</code> — escreve no stdout. <code>\n</code> é quebra de linha.</li>
        <li><code>return 0</code> — 0 = "deu certo". Qualquer outro número = erro.</li>
      </ul>

      <h2>Compilando</h2>
      <CodeBlock
        language="bash"
        code={`# Linux/Mac (gcc ou clang — escolha um)
gcc hello.c -o hello

# Rodar
./hello
# → Olá, mundo!

# Windows com MinGW
gcc hello.c -o hello.exe
hello.exe`}
      />

      <AlertBox type="info" title="Não tem compilador? Instale assim:">
        <ul>
          <li><strong>Ubuntu/Debian:</strong> <code>sudo apt install build-essential</code></li>
          <li><strong>Mac:</strong> <code>xcode-select --install</code></li>
          <li><strong>Windows:</strong> instale <a href="https://www.msys2.org/" className="text-primary hover:underline">MSYS2</a> e use <code>pacman -S mingw-w64-ucrt-x86_64-gcc</code></li>
          <li><strong>Online (sem instalar nada):</strong> <a href="https://godbolt.org" className="text-primary hover:underline">godbolt.org</a> ou <a href="https://replit.com" className="text-primary hover:underline">replit.com</a></li>
        </ul>
      </AlertBox>

      <h2>Flags que você vai usar TODOS os dias</h2>
      <CodeBlock
        language="bash"
        code={`# AVISOS — sempre ligue. Detecta 80% dos bugs antes de rodar.
gcc -Wall -Wextra -Wpedantic hello.c -o hello

# Otimização
gcc -O0 ...   # sem otimização (debug — variáveis preservadas)
gcc -O2 ...   # otimização forte (release)
gcc -O3 ...   # ainda mais (pode trocar tamanho por velocidade)
gcc -Os ...   # otimiza pra TAMANHO (embarcados)

# Símbolos de debug — necessário pro gdb
gcc -g hello.c -o hello

# Padrão da linguagem
gcc -std=c99 ...
gcc -std=c11 ...
gcc -std=c17 ...
gcc -std=c2x ...    # ou c23 em versões recentes

# Linkar uma lib externa (math)
gcc app.c -o app -lm   # -l (lower-L) "ele" de library`}
      />

      <p>O combo que eu recomendo pra desenvolvimento:</p>
      <CodeBlock
        language="bash"
        code={`gcc -std=c11 -Wall -Wextra -Wpedantic -g -O0 hello.c -o hello`}
      />

      <h2>As 4 etapas da compilação</h2>
      <p>
        Quando você roda <code>gcc hello.c -o hello</code>, parece uma
        coisa só, mas são 4 fases distintas. Saber disso vai te
        salvar quando der erro.
      </p>

      <CodeBlock
        language="text"
        code={`hello.c
   │
   │  1. PRÉ-PROCESSADOR (cpp)
   │     - resolve #include, #define, #if
   │     - remove comentários
   ▼
hello.i      (código C "puro" expandido)
   │
   │  2. COMPILADOR (cc1)
   │     - C → Assembly da arquitetura alvo
   ▼
hello.s      (assembly)
   │
   │  3. ASSEMBLER (as)
   │     - Assembly → código de máquina + tabela de símbolos
   ▼
hello.o      (object file — ainda não executável)
   │
   │  4. LINKER (ld)
   │     - liga seu .o + libc + outros .o
   │     - resolve referências (printf vem da libc)
   ▼
hello        (executável final)`}
      />

      <p>Pra ver cada etapa rodando separada:</p>
      <CodeBlock
        language="bash"
        code={`gcc -E hello.c -o hello.i      # 1. só pré-processar (gera ~800 linhas!)
gcc -S hello.c -o hello.s      # 2. parar no assembly
gcc -c hello.c -o hello.o      # 3. parar no object
gcc hello.o -o hello           # 4. linkar`}
      />

      <h2>Tipos de erro — em qual etapa cada um aparece?</h2>
      <CodeBlock
        language="text"
        code={`Erro do PRÉ-PROCESSADOR
   "fatal error: stdio.h: No such file or directory"
   → faltou instalar build-essential / pacote de cabeçalhos.

Erro do COMPILADOR (sintaxe / tipo)
   "error: expected ';' before ..."
   "warning: implicit declaration of function 'printf'"
   → bug no seu código C.

Erro do LINKER
   "undefined reference to 'sqrt'"
   → função existe, mas falta a lib (-lm para math).
   → ou você esqueceu de linkar outro .o do projeto.

Erro de RUNTIME (depois de compilar com sucesso)
   "Segmentation fault (core dumped)"
   → quase sempre: ponteiro inválido, buffer overflow.
   → use gdb pra investigar.`}
      />

      <h2>Diferença prática: gcc vs clang</h2>
      <p>
        São dois compiladores. Ambos seguem o mesmo padrão. Sintaxe
        de linha de comando praticamente idêntica.
      </p>
      <ul>
        <li><strong>gcc</strong> — GNU Compiler Collection. Padrão no Linux.</li>
        <li><strong>clang</strong> — do projeto LLVM. Mensagens de erro muito mais legíveis. Padrão no Mac e em projetos Apple.</li>
        <li>Pra aprender, qualquer um serve. Em produção, são intercambiáveis pra 99% dos casos.</li>
      </ul>

      <h2>Compilando vários arquivos (preview)</h2>
      <CodeBlock
        language="bash"
        code={`# Compila cada .c em um .o, depois linka tudo
gcc -c utils.c -o utils.o
gcc -c main.c  -o main.o
gcc utils.o main.o -o app

# Ou em uma linha (gcc compila e linka)
gcc utils.c main.c -o app`}
      />
      <p>
        Quando o projeto cresce, isso vira um <strong>Makefile</strong>{" "}
        — vamos cobrir no capítulo 19.
      </p>

      <h2>Armadilhas comuns</h2>
      <AlertBox type="danger" title="Esqueceu o -lm">
        Se usa <code>sqrt</code>, <code>sin</code>, <code>pow</code>{" "}
        de <code>&lt;math.h&gt;</code>, precisa adicionar
        <code> -lm </code> no final do comando — senão o linker
        reclama "undefined reference".
      </AlertBox>

      <AlertBox type="warning" title="Sem -Wall, você fica cego">
        Por padrão, gcc é silencioso demais. <code>-Wall -Wextra</code>{" "}
        liga avisos importantes (variável não usada, comparação
        sem sinal vs com sinal, função sem retorno, etc.). Trate
        warnings como erros: <code>-Werror</code>.
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="bash"
        code={`# Mínimo
gcc hello.c -o hello && ./hello

# Recomendado pra dev
gcc -std=c11 -Wall -Wextra -Wpedantic -g -O0 hello.c -o hello

# Release
gcc -std=c11 -O2 -DNDEBUG hello.c -o hello

# Ver etapas
gcc -E .c → preprocessado
gcc -S .c → assembly
gcc -c .c → object (.o)
gcc *.o   → executável

# Linkar lib
-lm   (math)  -lpthread  (threads pthread)  -lncurses  (TUI)`}
      />
    </PageContainer>
  );
}
