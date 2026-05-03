import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Make() {
  return (
    <PageContainer
      title="Make & build multi-arquivo"
      subtitle="Quando o projeto cresce, compilar manualmente vira insanidade. Make é a ferramenta clássica que sabe quais arquivos mudaram e recompila SÓ o necessário. Em 30 minutos você economiza dias."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <h2>Por que Make existe</h2>
      <CodeBlock
        language="bash"
        code={`# Sem Make, você acaba digitando coisas como:
gcc -Wall -Wextra -O2 -Iinclude src/main.c src/lista.c src/cache.c \\
    src/log.c src/config.c -o build/app -lm -lpthread

# Toda alteração em UM .c → recompila TUDO. Lento.
# Com Make: 1× 'make' compila só o necessário, em paralelo.`}
      />

      <h2>Estrutura básica de Makefile</h2>
      <CodeBlock
        language="makefile"
        title="Makefile"
        code={`# alvo: dependências
#     comando (TAB! NÃO espaços!)

app: main.o lista.o
	gcc main.o lista.o -o app

main.o: main.c lista.h
	gcc -c main.c -o main.o

lista.o: lista.c lista.h
	gcc -c lista.c -o lista.o

clean:
	rm -f *.o app`}
      />

      <AlertBox type="danger" title="TAB obrigatório (não espaços!)">
        A indentação dos comandos em Make TEM que ser <strong>tab</strong>,
        não espaços. Erro mais frequente de quem começa. Configure
        seu editor pra mostrar invisíveis.
      </AlertBox>

      <h2>Como Make decide o que recompilar</h2>
      <CodeBlock
        language="text"
        code={`Pra cada alvo, Make compara MTIME (data de modificação):

  app    ← depende de main.o e lista.o
  main.o ← depende de main.c e lista.h
  lista.o← depende de lista.c e lista.h

Se mudei lista.h:
  - lista.o e main.o ficam "mais antigos" → recompila ambos
  - app fica antigo → relink

Se mudei só main.c:
  - main.o recompila (lista.o NÃO toca)
  - app relink`}
      />

      <h2>Variáveis</h2>
      <CodeBlock
        language="makefile"
        code={`CC      = gcc
CFLAGS  = -Wall -Wextra -std=c11 -O2 -Iinclude
LDFLAGS = -lm

OBJS    = main.o lista.o cache.o
TARGET  = app

$(TARGET): $(OBJS)
	$(CC) $(OBJS) $(LDFLAGS) -o $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)

.PHONY: clean`}
      />

      <h2>Variáveis automáticas</h2>
      <CodeBlock
        language="text"
        code={`$@   nome do alvo atual           (ex: app)
$<   primeira dependência         (ex: main.c)
$^   TODAS as dependências        (ex: main.c lista.h)
$?   dependências mais novas que o alvo
$*   stem (parte coringa do %)`}
      />

      <h2>Pattern rules (regras genéricas)</h2>
      <CodeBlock
        language="makefile"
        code={`# Para CADA arquivo .o, derive de seu .c correspondente
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Sem precisar listar regra pra main.o, lista.o, cache.o, etc.`}
      />

      <h2>.PHONY — alvos que NÃO geram arquivo</h2>
      <CodeBlock
        language="makefile"
        code={`.PHONY: clean install test all

clean:
	rm -f *.o app

install: $(TARGET)
	cp $(TARGET) /usr/local/bin/

test: $(TARGET)
	./$(TARGET) --test

# Sem .PHONY, se existir um arquivo chamado "clean", make não roda o comando!`}
      />

      <h2>Compilação paralela</h2>
      <CodeBlock
        language="bash"
        code={`make -j4         # 4 jobs em paralelo
make -j$(nproc)  # tantos jobs quanto cores

# Make resolve as dependências e roda compilações independentes em paralelo.
# Em projeto grande: 5×-10× mais rápido que -j1.`}
      />

      <h2>Makefile real, com diretórios</h2>
      <CodeBlock
        language="makefile"
        title="Makefile (estrutura típica)"
        code={`CC      = gcc
CFLAGS  = -Wall -Wextra -std=c11 -O2 -Iinclude -g
LDFLAGS = -lm

SRC_DIR = src
OBJ_DIR = build
BIN_DIR = bin

SRCS = $(wildcard $(SRC_DIR)/*.c)             # tudo *.c em src/
OBJS = $(SRCS:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)  # vira build/*.o
TARGET = $(BIN_DIR)/app

all: $(TARGET)

$(TARGET): $(OBJS) | $(BIN_DIR)
	$(CC) $(OBJS) $(LDFLAGS) -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Cria diretório se não existir (order-only prerequisite)
$(OBJ_DIR) $(BIN_DIR):
	mkdir -p $@

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)

.PHONY: all clean`}
      />

      <h2>Dependências de header (auto-geradas pelo gcc)</h2>
      <p>
        Make não sabe sozinho quais <code>.h</code> cada
        <code> .c </code> incluí. Truque: use o gcc pra gerar.
      </p>

      <CodeBlock
        language="makefile"
        code={`CFLAGS += -MMD -MP

OBJS = $(SRCS:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)
DEPS = $(OBJS:.o=.d)

-include $(DEPS)        # inclui *.d se existirem

# Agora se mudar um .h, os .c afetados recompilam automaticamente.`}
      />

      <h2>Debug vs Release</h2>
      <CodeBlock
        language="makefile"
        code={`# make           (release)
# make debug

CFLAGS_RELEASE = -O2 -DNDEBUG
CFLAGS_DEBUG   = -O0 -g -fsanitize=address

CFLAGS = -Wall -Wextra -std=c11 $(CFLAGS_RELEASE)

debug: CFLAGS = -Wall -Wextra -std=c11 $(CFLAGS_DEBUG)
debug: clean all`}
      />

      <h2>Outros sistemas modernos</h2>
      <ul>
        <li><strong>CMake</strong> — gera Makefiles ou Ninja. De facto pra projetos cross-platform. Sintaxe estranha, mas tudo usa.</li>
        <li><strong>Meson + Ninja</strong> — alternativa moderna, sintaxe limpa. Usado pelo systemd, GNOME.</li>
        <li><strong>Bazel</strong> — Google. Reproducível e gigante. Overkill pra hobby.</li>
        <li><strong>Make GNU puro</strong> — perfeito pra projetos pequenos/médios single-platform. Não morreu.</li>
      </ul>

      <h2>Receita prática: novo projeto C em 30 segundos</h2>
      <CodeBlock
        language="bash"
        code={`mkdir meu-projeto && cd meu-projeto
mkdir src include build bin
echo '#include <stdio.h>\\nint main(void) { puts("oi"); }' > src/main.c

# Cole o Makefile da seção anterior

make           # compila
./bin/app      # roda
make clean     # limpa`}
      />

      <h2>Comandos make do dia a dia</h2>
      <CodeBlock
        language="bash"
        code={`make                  # alvo padrão (primeiro do arquivo)
make app              # alvo específico
make clean
make -j8              # 8 jobs paralelos
make -B               # força recompilar tudo
make -n               # DRY-RUN — só mostra o que rodaria
make CFLAGS="-O3"     # sobrescreve variável

make -f outro.mk      # usa outro Makefile`}
      />

      <h2>Resumão</h2>
      <CodeBlock
        language="makefile"
        code={`# Makefile mínimo viável

CC      = gcc
CFLAGS  = -Wall -Wextra -std=c11 -O2 -Iinclude -MMD -MP
LDFLAGS = -lm

SRCS = $(wildcard src/*.c)
OBJS = $(SRCS:src/%.c=build/%.o)
DEPS = $(OBJS:.o=.d)

bin/app: $(OBJS) | bin
	$(CC) $^ $(LDFLAGS) -o $@

build/%.o: src/%.c | build
	$(CC) $(CFLAGS) -c $< -o $@

build bin:
	mkdir -p $@

-include $(DEPS)

clean:
	rm -rf build bin

.PHONY: clean

# Variáveis automáticas:  $@ alvo, $< 1ª dep, $^ todas
# Indentação:  TAB
# .PHONY pra alvos sem arquivo
# make -j$(nproc) pra paralelo`}
      />
    </PageContainer>
  );
}
