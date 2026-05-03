import { Link } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    "title": "Introdução",
    "items": [
      {
        "path": "/historia",
        "title": "História do C"
      },
      {
        "path": "/hello",
        "title": "Hello World & Compilação"
      }
    ]
  },
  {
    "title": "Fundamentos",
    "items": [
      {
        "path": "/tipos",
        "title": "Tipos & Variáveis"
      },
      {
        "path": "/conversoes",
        "title": "Conversões e Cast"
      },
      {
        "path": "/operadores",
        "title": "Operadores"
      },
      {
        "path": "/controle",
        "title": "Controle de Fluxo"
      }
    ]
  },
  {
    "title": "Estrutura do código",
    "items": [
      {
        "path": "/funcoes",
        "title": "Funções"
      },
      {
        "path": "/escopo",
        "title": "Escopo & Storage Classes"
      },
      {
        "path": "/arrays",
        "title": "Arrays"
      },
      {
        "path": "/strings",
        "title": "Strings em C"
      }
    ]
  },
  {
    "title": "Ponteiros",
    "items": [
      {
        "path": "/ponteiros-1",
        "title": "Ponteiros — o conceito"
      },
      {
        "path": "/ponteiros-2",
        "title": "Aritmética de ponteiros"
      },
      {
        "path": "/ponteiros-3",
        "title": "void*, função, const"
      },
      {
        "path": "/memoria",
        "title": "Memória dinâmica"
      }
    ]
  },
  {
    "title": "Tipos compostos & build",
    "items": [
      {
        "path": "/structs",
        "title": "Structs, Unions, Enums"
      },
      {
        "path": "/preprocessador",
        "title": "Pré-processador"
      },
      {
        "path": "/headers",
        "title": "Headers & include guards"
      },
      {
        "path": "/make",
        "title": "Make & build multi-arquivo"
      }
    ]
  },
  {
    "title": "Standard Library",
    "items": [
      {
        "path": "/io",
        "title": "I/O e arquivos"
      },
      {
        "path": "/stdio",
        "title": "stdio aprofundado"
      },
      {
        "path": "/stdlib",
        "title": "stdlib essencial"
      },
      {
        "path": "/libs",
        "title": "math, time, ctype, stdint"
      }
    ]
  },
  {
    "title": "Tipos & baixo nível",
    "items": [
      {
        "path": "/bitwise",
        "title": "Operadores Bitwise"
      },
      {
        "path": "/enums",
        "title": "Enums a fundo"
      },
      {
        "path": "/unions",
        "title": "Unions na prática"
      },
      {
        "path": "/typedef",
        "title": "Typedef sem dor"
      },
      {
        "path": "/const-volatile",
        "title": "const e volatile"
      },
      {
        "path": "/static-extern",
        "title": "static e extern"
      },
      {
        "path": "/stdint-stdbool",
        "title": "stdint.h e stdbool.h"
      },
      {
        "path": "/bitfields",
        "title": "Bitfields em structs"
      },
      {
        "path": "/endianness",
        "title": "Endianness"
      },
      {
        "path": "/alinhamento",
        "title": "Alinhamento e padding"
      },
      {
        "path": "/packed-structs",
        "title": "Packed structs e protocolos binários"
      },
      {
        "path": "/ponto-flutuante",
        "title": "Ponto flutuante (IEEE 754)"
      }
    ]
  },
  {
    "title": "Stdlib profundo",
    "items": [
      {
        "path": "/string-h",
        "title": "string.h em profundidade"
      },
      {
        "path": "/math-h",
        "title": "math.h: matemática real"
      },
      {
        "path": "/time-h",
        "title": "time.h: tempo, datas e cronômetros"
      },
      {
        "path": "/ctype-h",
        "title": "ctype.h: classificação de caracteres"
      },
      {
        "path": "/assert-h",
        "title": "assert.h: pré-condições e invariantes"
      },
      {
        "path": "/setjmp-h",
        "title": "setjmp/longjmp: o \"goto\" de longa distância"
      },
      {
        "path": "/signal-h",
        "title": "signal.h: lidando com sinais"
      },
      {
        "path": "/locale-h",
        "title": "locale.h e internacionalização básica"
      },
      {
        "path": "/stdarg-h",
        "title": "Funções variádicas (stdarg.h)"
      },
      {
        "path": "/limits-float",
        "title": "limits.h e float.h"
      }
    ]
  },
  {
    "title": "Estruturas de dados",
    "items": [
      {
        "path": "/lista-ligada",
        "title": "Lista ligada simples"
      },
      {
        "path": "/lista-dupla",
        "title": "Lista duplamente ligada"
      },
      {
        "path": "/pilha-fila",
        "title": "Pilha e fila"
      },
      {
        "path": "/arvore-binaria",
        "title": "Árvore binária e BST"
      },
      {
        "path": "/heap-priority",
        "title": "Heap binário (priority queue)"
      },
      {
        "path": "/hash-table",
        "title": "Hash table"
      },
      {
        "path": "/grafo",
        "title": "Grafos: representação e travessia"
      },
      {
        "path": "/trie",
        "title": "Trie (árvore de prefixos)"
      },
      {
        "path": "/fila-prioridade-dijkstra",
        "title": "Dijkstra com heap"
      }
    ]
  },
  {
    "title": "Algoritmos",
    "items": [
      {
        "path": "/busca-binaria",
        "title": "Busca binária sem off-by-one"
      },
      {
        "path": "/sorts-basicos",
        "title": "Sorts O(n²)"
      },
      {
        "path": "/quicksort",
        "title": "Quicksort"
      },
      {
        "path": "/mergesort",
        "title": "Mergesort"
      },
      {
        "path": "/heapsort-radix",
        "title": "Heapsort, counting e radix"
      },
      {
        "path": "/recursao",
        "title": "Recursão e backtracking"
      },
      {
        "path": "/bfs-dfs",
        "title": "BFS e DFS aplicados"
      },
      {
        "path": "/programacao-dinamica",
        "title": "Programação dinâmica"
      }
    ]
  },
  {
    "title": "Sistema & POSIX",
    "items": [
      {
        "path": "/fork-exec",
        "title": "fork() e exec()"
      },
      {
        "path": "/pipes",
        "title": "Pipes anônimos e nomeados"
      },
      {
        "path": "/mmap",
        "title": "mmap: arquivo como memória"
      },
      {
        "path": "/shared-mem-sem",
        "title": "Shared memory e semáforos POSIX"
      },
      {
        "path": "/sockets-tcp",
        "title": "Sockets TCP"
      },
      {
        "path": "/sockets-udp",
        "title": "Sockets UDP"
      },
      {
        "path": "/epoll-select",
        "title": "select, poll e epoll"
      },
      {
        "path": "/dlopen",
        "title": "dlopen: carregar biblioteca em runtime"
      },
      {
        "path": "/syscalls",
        "title": "Syscalls direto"
      },
      {
        "path": "/proc-fs",
        "title": "/proc e /sys"
      },
      {
        "path": "/argv-args",
        "title": "argc, argv e getopt"
      }
    ]
  },
  {
    "title": "Concorrência avançada",
    "items": [
      {
        "path": "/mutex-condvar",
        "title": "Mutex e variáveis de condição"
      },
      {
        "path": "/atomics-c11",
        "title": "Atomics do C11"
      },
      {
        "path": "/memory-model",
        "title": "Modelo de memória"
      },
      {
        "path": "/lock-free",
        "title": "Estruturas lock-free"
      },
      {
        "path": "/openmp",
        "title": "OpenMP: paralelismo declarativo"
      }
    ]
  },
  {
    "title": "Build & Ferramentas",
    "items": [
      {
        "path": "/gdb-basico",
        "title": "GDB: o básico que economiza horas"
      },
      {
        "path": "/gdb-avancado",
        "title": "GDB avançado"
      },
      {
        "path": "/valgrind",
        "title": "Valgrind: caçador de memória"
      },
      {
        "path": "/sanitizers",
        "title": "Address/Undefined/Thread Sanitizer"
      },
      {
        "path": "/profiling-perf",
        "title": "Profiling com perf e gprof"
      },
      {
        "path": "/cmake",
        "title": "CMake básico"
      },
      {
        "path": "/pkgconfig",
        "title": "pkg-config"
      },
      {
        "path": "/doxygen",
        "title": "Doxygen: gerar documentação"
      }
    ]
  },
  {
    "title": "Segurança",
    "items": [
      {
        "path": "/buffer-overflow",
        "title": "Buffer overflow"
      },
      {
        "path": "/format-string",
        "title": "Format string vulnerability"
      },
      {
        "path": "/integer-overflow",
        "title": "Integer overflow"
      },
      {
        "path": "/use-after-free",
        "title": "Use-after-free e double-free"
      },
      {
        "path": "/hardening",
        "title": "Hardening: flags e práticas"
      },
      {
        "path": "/fuzzing",
        "title": "Fuzzing com AFL++ e libFuzzer"
      }
    ]
  },
  {
    "title": "Padrões & arquitetura",
    "items": [
      {
        "path": "/opaque-pointers",
        "title": "Opaque pointers (handles)"
      },
      {
        "path": "/adt-modulo",
        "title": "ADT e módulos"
      },
      {
        "path": "/callbacks-funcptr",
        "title": "Callbacks e ponteiros pra função"
      },
      {
        "path": "/state-machine",
        "title": "Máquinas de estado em C"
      },
      {
        "path": "/module-pattern",
        "title": "Module pattern e singletons"
      }
    ]
  },
  {
    "title": "Testes",
    "items": [
      {
        "path": "/unity-tests",
        "title": "Unity: framework de teste minimalista"
      },
      {
        "path": "/cmocka",
        "title": "cmocka e mocking"
      },
      {
        "path": "/tdd-em-c",
        "title": "TDD em C na prática"
      }
    ]
  },
  {
    "title": "Bibliotecas populares",
    "items": [
      {
        "path": "/libcurl",
        "title": "libcurl: HTTP em C"
      },
      {
        "path": "/sqlite-c",
        "title": "SQLite em C"
      },
      {
        "path": "/json-c",
        "title": "Parsing JSON com cJSON"
      },
      {
        "path": "/regex-c",
        "title": "Regex POSIX (regex.h)"
      },
      {
        "path": "/ncurses",
        "title": "ncurses: TUI em C"
      },
      {
        "path": "/sdl2",
        "title": "SDL2: gráficos e janela"
      }
    ]
  },
  {
    "title": "Projetos práticos",
    "items": [
      {
        "path": "/projeto-shell-mini",
        "title": "Projeto: mini-shell"
      },
      {
        "path": "/projeto-http-server",
        "title": "Projeto: servidor HTTP mínimo"
      },
      {
        "path": "/projeto-game-of-life",
        "title": "Projeto: Game of Life"
      },
      {
        "path": "/projeto-json-parser",
        "title": "Projeto: parser JSON do zero"
      },
      {
        "path": "/projeto-allocator",
        "title": "Projeto: allocator próprio"
      }
    ]
  },
  {
    "title": "Nível profissional",
    "items": [
      {
        "path": "/erros",
        "title": "Erros, assert, gdb"
      },
      {
        "path": "/ub",
        "title": "Undefined Behavior"
      },
      {
        "path": "/moderno",
        "title": "C Moderno (C11/17/23)"
      },
      {
        "path": "/threads",
        "title": "Threads & atômicos"
      },
      {
        "path": "/projeto",
        "title": "Projeto: lista encadeada"
      }
    ]
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-24">
      <header className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
          Linguagem C — Livro Completo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          116 capítulos do "Hello World" até estruturas de dados, sistemas POSIX,
          concorrência, segurança e projetos reais. Em pt-BR, sem rodeios.
        </p>
      </header>

      <div className="space-y-12">
        {SECTIONS.map(sec => (
          <section key={sec.title}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {sec.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sec.items.map(item => (
                <Link key={item.path} href={item.path}>
                  <a className="group block p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
