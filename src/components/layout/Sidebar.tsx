import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Activity, AlertTriangle, Asterisk, BarChart, BellRing, Binary, BookOpen, BookText, Box, Boxes, Braces, Brain, Bug, BugPlay, Calculator, CheckCircle2, Clock, Code2, Compass, Component, CornerDownRight, CornerUpLeft, Cpu, Database, EyeOff, FileCode, FileInput, FileJson, FunctionSquare, Gamepad2, GitBranch, GitFork, GitMerge, Globe, Hammer, HardDrive, Hash, Languages, Layers, Layers3, Library, Link as LinkIcon, ListOrdered, Locate, Lock, MapPin, MemoryStick, Network, Package, PhoneCall, Pilcrow, Plug, Printer, Radio, RefreshCw, Regex, Repeat, Rocket, Ruler, Search, Server, Settings, Share2, Shield, ShieldCheck, Shuffle, Sigma, Skull, Sparkles, Target, Terminal, TestTube, Trees, TrendingUp, Type, Variable, Workflow, Wrench, X, Zap
} from "lucide-react";

const NAVIGATION = [
  {
    title: "Introdução",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "História do C", icon: BookOpen },
      { path: "/hello", label: "Hello World & Compilação", icon: Terminal },
    ]
  },
  {
    title: "Fundamentos",
    items: [
      { path: "/tipos", label: "Tipos & Variáveis", icon: Hash },
      { path: "/conversoes", label: "Conversões e Cast", icon: RefreshCw },
      { path: "/operadores", label: "Operadores", icon: Calculator },
      { path: "/controle", label: "Controle de Fluxo", icon: GitBranch },
    ]
  },
  {
    title: "Estrutura do código",
    items: [
      { path: "/funcoes", label: "Funções", icon: Code2 },
      { path: "/escopo", label: "Escopo & Storage Classes", icon: Layers },
      { path: "/arrays", label: "Arrays", icon: Box },
      { path: "/strings", label: "Strings em C", icon: Type },
    ]
  },
  {
    title: "Ponteiros",
    items: [
      { path: "/ponteiros-1", label: "Ponteiros — o conceito", icon: Locate },
      { path: "/ponteiros-2", label: "Aritmética de ponteiros", icon: MapPin },
      { path: "/ponteiros-3", label: "void*, função, const", icon: Compass },
      { path: "/memoria", label: "Memória dinâmica", icon: MemoryStick },
    ]
  },
  {
    title: "Tipos compostos & build",
    items: [
      { path: "/structs", label: "Structs, Unions, Enums", icon: Boxes },
      { path: "/preprocessador", label: "Pré-processador", icon: Settings },
      { path: "/headers", label: "Headers & include guards", icon: FileCode },
      { path: "/make", label: "Make & build multi-arquivo", icon: Hammer },
    ]
  },
  {
    title: "Standard Library",
    items: [
      { path: "/io", label: "I/O e arquivos", icon: FileInput },
      { path: "/stdio", label: "stdio aprofundado", icon: Printer },
      { path: "/stdlib", label: "stdlib essencial", icon: Library },
      { path: "/libs", label: "math, time, ctype, stdint", icon: Wrench },
    ]
  },
  {
    title: "Tipos & baixo nível",
    items: [
      { path: "/bitwise", label: "Operadores Bitwise", icon: Binary },
      { path: "/enums", label: "Enums a fundo", icon: Sigma },
      { path: "/unions", label: "Unions na prática", icon: Pilcrow },
      { path: "/typedef", label: "Typedef sem dor", icon: Asterisk },
      { path: "/const-volatile", label: "const e volatile", icon: Hash },
      { path: "/static-extern", label: "static e extern", icon: Layers },
      { path: "/stdint-stdbool", label: "stdint.h e stdbool.h", icon: Calculator },
      { path: "/bitfields", label: "Bitfields em structs", icon: CornerDownRight },
      { path: "/endianness", label: "Endianness", icon: Network },
      { path: "/alinhamento", label: "Alinhamento e padding", icon: Package },
      { path: "/packed-structs", label: "Packed structs e protocolos binários", icon: Box },
      { path: "/ponto-flutuante", label: "Ponto flutuante (IEEE 754)", icon: Activity },
    ]
  },
  {
    title: "Stdlib profundo",
    items: [
      { path: "/string-h", label: "string.h em profundidade", icon: BookText },
      { path: "/math-h", label: "math.h: matemática real", icon: FunctionSquare },
      { path: "/time-h", label: "time.h: tempo, datas e cronômetros", icon: Clock },
      { path: "/ctype-h", label: "ctype.h: classificação de caracteres", icon: Type },
      { path: "/assert-h", label: "assert.h: pré-condições e invariantes", icon: CheckCircle2 },
      { path: "/setjmp-h", label: "setjmp/longjmp: o \"goto\" de longa distância", icon: CornerUpLeft },
      { path: "/signal-h", label: "signal.h: lidando com sinais", icon: BellRing },
      { path: "/locale-h", label: "locale.h e internacionalização básica", icon: Languages },
      { path: "/stdarg-h", label: "Funções variádicas (stdarg.h)", icon: Variable },
      { path: "/limits-float", label: "limits.h e float.h", icon: Ruler },
    ]
  },
  {
    title: "Estruturas de dados",
    items: [
      { path: "/lista-ligada", label: "Lista ligada simples", icon: LinkIcon },
      { path: "/lista-dupla", label: "Lista duplamente ligada", icon: GitMerge },
      { path: "/pilha-fila", label: "Pilha e fila", icon: BookOpen },
      { path: "/arvore-binaria", label: "Árvore binária e BST", icon: ListOrdered },
      { path: "/heap-priority", label: "Heap binário (priority queue)", icon: Trees },
      { path: "/hash-table", label: "Hash table", icon: Network },
      { path: "/grafo", label: "Grafos: representação e travessia", icon: TrendingUp },
      { path: "/trie", label: "Trie (árvore de prefixos)", icon: Database },
      { path: "/fila-prioridade-dijkstra", label: "Dijkstra com heap", icon: Share2 },
    ]
  },
  {
    title: "Algoritmos",
    items: [
      { path: "/busca-binaria", label: "Busca binária sem off-by-one", icon: Search },
      { path: "/sorts-basicos", label: "Sorts O(n²)", icon: BarChart },
      { path: "/quicksort", label: "Quicksort", icon: Zap },
      { path: "/mergesort", label: "Mergesort", icon: Shuffle },
      { path: "/heapsort-radix", label: "Heapsort, counting e radix", icon: Layers3 },
      { path: "/recursao", label: "Recursão e backtracking", icon: Repeat },
      { path: "/bfs-dfs", label: "BFS e DFS aplicados", icon: GitFork },
      { path: "/programacao-dinamica", label: "Programação dinâmica", icon: Brain },
    ]
  },
  {
    title: "Sistema & POSIX",
    items: [
      { path: "/fork-exec", label: "fork() e exec()", icon: Cpu },
      { path: "/pipes", label: "Pipes anônimos e nomeados", icon: GitBranch },
      { path: "/mmap", label: "mmap: arquivo como memória", icon: GitMerge },
      { path: "/shared-mem-sem", label: "Shared memory e semáforos POSIX", icon: HardDrive },
      { path: "/sockets-tcp", label: "Sockets TCP", icon: Database },
      { path: "/sockets-udp", label: "Sockets UDP", icon: Network },
      { path: "/epoll-select", label: "select, poll e epoll", icon: Globe },
      { path: "/dlopen", label: "dlopen: carregar biblioteca em runtime", icon: Radio },
      { path: "/syscalls", label: "Syscalls direto", icon: Activity },
      { path: "/proc-fs", label: "/proc e /sys", icon: Plug },
      { path: "/argv-args", label: "argc, argv e getopt", icon: Server },
    ]
  },
  {
    title: "Concorrência avançada",
    items: [
      { path: "/mutex-condvar", label: "Mutex e variáveis de condição", icon: Lock },
      { path: "/atomics-c11", label: "Atomics do C11", icon: BookOpen },
      { path: "/memory-model", label: "Modelo de memória", icon: MemoryStick },
      { path: "/lock-free", label: "Estruturas lock-free", icon: Workflow },
      { path: "/openmp", label: "OpenMP: paralelismo declarativo", icon: Layers },
    ]
  },
  {
    title: "Build & Ferramentas",
    items: [
      { path: "/gdb-basico", label: "GDB: o básico que economiza horas", icon: Bug },
      { path: "/gdb-avancado", label: "GDB avançado", icon: BugPlay },
      { path: "/valgrind", label: "Valgrind: caçador de memória", icon: Search },
      { path: "/sanitizers", label: "Address/Undefined/Thread Sanitizer", icon: ShieldCheck },
      { path: "/profiling-perf", label: "Profiling com perf e gprof", icon: Activity },
      { path: "/cmake", label: "CMake básico", icon: Hammer },
      { path: "/pkgconfig", label: "pkg-config", icon: Package },
      { path: "/doxygen", label: "Doxygen: gerar documentação", icon: BookOpen },
    ]
  },
  {
    title: "Segurança",
    items: [
      { path: "/buffer-overflow", label: "Buffer overflow", icon: Shield },
      { path: "/format-string", label: "Format string vulnerability", icon: AlertTriangle },
      { path: "/integer-overflow", label: "Integer overflow", icon: Calculator },
      { path: "/use-after-free", label: "Use-after-free e double-free", icon: Skull },
      { path: "/hardening", label: "Hardening: flags e práticas", icon: Lock },
      { path: "/fuzzing", label: "Fuzzing com AFL++ e libFuzzer", icon: Target },
    ]
  },
  {
    title: "Padrões & arquitetura",
    items: [
      { path: "/opaque-pointers", label: "Opaque pointers (handles)", icon: EyeOff },
      { path: "/adt-modulo", label: "ADT e módulos", icon: Component },
      { path: "/callbacks-funcptr", label: "Callbacks e ponteiros pra função", icon: PhoneCall },
      { path: "/state-machine", label: "Máquinas de estado em C", icon: Workflow },
      { path: "/module-pattern", label: "Module pattern e singletons", icon: Boxes },
    ]
  },
  {
    title: "Testes",
    items: [
      { path: "/unity-tests", label: "Unity: framework de teste minimalista", icon: CheckCircle2 },
      { path: "/cmocka", label: "cmocka e mocking", icon: TestTube },
      { path: "/tdd-em-c", label: "TDD em C na prática", icon: Repeat },
    ]
  },
  {
    title: "Bibliotecas populares",
    items: [
      { path: "/libcurl", label: "libcurl: HTTP em C", icon: Globe },
      { path: "/sqlite-c", label: "SQLite em C", icon: Database },
      { path: "/json-c", label: "Parsing JSON com cJSON", icon: Braces },
      { path: "/regex-c", label: "Regex POSIX (regex.h)", icon: Regex },
      { path: "/ncurses", label: "ncurses: TUI em C", icon: Terminal },
      { path: "/sdl2", label: "SDL2: gráficos e janela", icon: Gamepad2 },
    ]
  },
  {
    title: "Projetos práticos",
    items: [
      { path: "/projeto-shell-mini", label: "Projeto: mini-shell", icon: Terminal },
      { path: "/projeto-http-server", label: "Projeto: servidor HTTP mínimo", icon: Server },
      { path: "/projeto-game-of-life", label: "Projeto: Game of Life", icon: Sparkles },
      { path: "/projeto-json-parser", label: "Projeto: parser JSON do zero", icon: FileJson },
      { path: "/projeto-allocator", label: "Projeto: allocator próprio", icon: MemoryStick },
    ]
  },
  {
    title: "Nível profissional",
    items: [
      { path: "/erros", label: "Erros, assert, gdb", icon: Bug },
      { path: "/ub", label: "Undefined Behavior", icon: AlertTriangle },
      { path: "/moderno", label: "C Moderno (C11/17/23)", icon: Sparkles },
      { path: "/threads", label: "Threads & atômicos", icon: Cpu },
      { path: "/projeto", label: "Projeto: lista encadeada", icon: Rocket },
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-sm">C Guide</h1>
                <p className="text-xs text-muted-foreground">Livro Completo</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-6">
            {NAVIGATION.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h2>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
