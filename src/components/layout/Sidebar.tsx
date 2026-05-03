import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, Hash, RefreshCw, Calculator, GitBranch,
  Code2, Layers, Box, Type, Locate, MapPin, Compass, MemoryStick,
  Boxes, Settings, FileCode, Hammer, FileInput, Printer, Library,
  Wrench, Bug, AlertTriangle, Sparkles, Cpu, Rocket, X
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
    title: "Nível profissional",
    items: [
      { path: "/erros", label: "Erros, assert, gdb", icon: Bug },
      { path: "/ub", label: "Undefined Behavior", icon: AlertTriangle },
      { path: "/moderno", label: "C Moderno (C11/17/23)", icon: Sparkles },
      { path: "/threads", label: "Threads & atômicos", icon: Cpu },
      { path: "/projeto", label: "Projeto final", icon: Rocket },
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
