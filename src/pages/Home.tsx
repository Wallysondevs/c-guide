import { Link } from "wouter";
import {
  BookOpen, Terminal, Hash, RefreshCw, Calculator, GitBranch,
  Code2, Layers, Box, Type, Locate, MapPin, Compass, MemoryStick,
  Boxes, Settings, FileCode, Hammer, FileInput, Printer, Library,
  Wrench, Bug, AlertTriangle, Sparkles, Cpu, Rocket
} from "lucide-react";

const SECTIONS = [
  { path: "/historia", icon: BookOpen, title: "História do C", desc: "De 1972 ao C23: como uma linguagem de 50+ anos virou base de quase TUDO." },
  { path: "/hello", icon: Terminal, title: "Hello World & Compilação", desc: "gcc, clang, .c → .o → executável. O ciclo de compilação que você precisa entender." },
  { path: "/tipos", icon: Hash, title: "Tipos & Variáveis", desc: "int, char, float, double, signed/unsigned. O que cabe em cada um e por que sizeof importa." },
  { path: "/conversoes", icon: RefreshCw, title: "Conversões e Cast", desc: "Promoções implícitas, cast explícito e os bugs de overflow/precisão que isso causa." },
  { path: "/operadores", icon: Calculator, title: "Operadores", desc: "Aritméticos, lógicos, bitwise, ternário. A precedência que confunde até veterano." },
  { path: "/controle", icon: GitBranch, title: "Controle de Fluxo", desc: "if/switch, while/do/for, break/continue/goto (sim, ainda existe — e tem uso legítimo)." },
  { path: "/funcoes", icon: Code2, title: "Funções", desc: "Protótipos, recursão, passagem por valor, retornos múltiplos via ponteiro." },
  { path: "/escopo", icon: Layers, title: "Escopo & Storage Classes", desc: "static, extern, auto, register — onde a variável vive e quem a enxerga." },
  { path: "/arrays", icon: Box, title: "Arrays", desc: "Onde vivem na memória, por que decay para ponteiro, multidimensionais e VLAs." },
  { path: "/strings", icon: Type, title: "Strings em C", desc: "Strings são char[] terminadas em \\0. strlen, strcpy, strcat e por que metade é insegura." },
  { path: "/ponteiros-1", icon: Locate, title: "Ponteiros — o conceito", desc: "O assunto que assusta. Com analogias do mundo real e diagramas de memória, fica simples." },
  { path: "/ponteiros-2", icon: MapPin, title: "Aritmética de ponteiros", desc: "p+1, p-q, p[i], duplo ponteiro. Como percorrer arrays e estruturas linkadas." },
  { path: "/ponteiros-3", icon: Compass, title: "void*, função e const", desc: "Ponteiros genéricos, callbacks (qsort), e o segredo do const correctness." },
  { path: "/memoria", icon: MemoryStick, title: "Memória Dinâmica", desc: "malloc, calloc, realloc, free. Stack vs heap. Vazamentos, valgrind, double free." },
  { path: "/structs", icon: Boxes, title: "Structs, Unions, Enums", desc: "Modelando dados. Padding, alinhamento, bitfields, typedef e o pacote de bits." },
  { path: "/preprocessador", icon: Settings, title: "Pré-processador", desc: "#define, macros, condicionais. Quando ajuda e quando vira pesadelo." },
  { path: "/headers", icon: FileCode, title: "Headers & include guards", desc: "O que vai no .h, o que fica no .c, como evitar redefinição e símbolos duplicados." },
  { path: "/make", icon: Hammer, title: "Make & build multi-arquivo", desc: "Compilação separada, linker, Makefile mínimo que economiza horas." },
  { path: "/io", icon: FileInput, title: "I/O e Arquivos", desc: "fopen/fread/fwrite, modos, fseek, EOF e buffer de leitura." },
  { path: "/stdio", icon: Printer, title: "stdio aprofundado", desc: "Format specifiers de printf/scanf, fgets correto, snprintf vs sprintf." },
  { path: "/stdlib", icon: Library, title: "stdlib essencial", desc: "qsort, bsearch, atoi/strtol, getenv, exit, abort." },
  { path: "/libs", icon: Wrench, title: "math, time, ctype, stdint", desc: "Bibliotecas que você usa em quase todo projeto." },
  { path: "/erros", icon: Bug, title: "Erros, assert, gdb", desc: "errno, perror, assert.h e o básico do gdb pra debug que economiza dias." },
  { path: "/ub", icon: AlertTriangle, title: "Undefined Behavior", desc: "O capítulo mais importante do livro. O que UB é, por que destrói programas e como evitar." },
  { path: "/moderno", icon: Sparkles, title: "C Moderno (C11/17/23)", desc: "_Generic, _Static_assert, nullptr, [[attributes]] — o que mudou nas últimas décadas." },
  { path: "/threads", icon: Cpu, title: "Threads & atômicos", desc: "<threads.h>, mutex, condition variables, <stdatomic.h> — concorrência sem libs externas." },
  { path: "/projeto", icon: Rocket, title: "Projeto final", desc: "Implementar uma lista encadeada genérica do zero, com testes e Makefile." },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
          <Terminal className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">C Guide</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Livro completo de <strong>Linguagem C</strong> em pt-BR — do
          primeiro <code>printf</code> ao C23. Cada capítulo tem
          <strong> exemplos do mundo real</strong>, comparações
          <strong> antes/depois</strong>, <strong>diagramas de memória</strong>
          e as <strong>armadilhas</strong> que travaram seu programa.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {SECTIONS.length} capítulos
          </span>
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Linguagem simples</span>
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Diagramas de memória</span>
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">Foco em UB</span>
        </div>
      </header>

      <section className="mb-10 p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent">
        <h2 className="text-lg font-bold mb-2">Por que aprender C em 2025?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Linux, Windows, macOS, navegadores, bancos de dados, libs de
          IA, compiladores, sistemas embarcados, jogos AAA — é
          <strong> tudo C </strong> ou linguagens que falam com C.
          Aprender C te ensina como o computador realmente funciona:
          memória, ponteiros, alinhamento, undefined behavior. Depois
          disso, qualquer outra linguagem fica mais simples.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ path, icon: Icon, title, desc }) => (
          <Link
            key={path}
            href={path}
            className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>
          Mantido por <a href="https://github.com/Wallysondevs" className="text-primary hover:underline">Wallysondevs</a>
          {" · "}
          <a href="https://github.com/Wallysondevs/c-guide" className="text-primary hover:underline">Código no GitHub</a>
        </p>
      </footer>
    </div>
  );
}
