import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
import Historia from "@/pages/Historia";
import Hello from "@/pages/Hello";
import Tipos from "@/pages/Tipos";
import Conversoes from "@/pages/Conversoes";
import Operadores from "@/pages/Operadores";
import Controle from "@/pages/Controle";
import Funcoes from "@/pages/Funcoes";
import Escopo from "@/pages/Escopo";
import Arrays from "@/pages/Arrays";
import Strings from "@/pages/Strings";
import Ponteiros1 from "@/pages/Ponteiros1";
import Ponteiros2 from "@/pages/Ponteiros2";
import Ponteiros3 from "@/pages/Ponteiros3";
import Memoria from "@/pages/Memoria";
import Structs from "@/pages/Structs";
import Preprocessador from "@/pages/Preprocessador";
import Headers from "@/pages/Headers";
import Make from "@/pages/Make";
import IO from "@/pages/IO";
import Stdio from "@/pages/Stdio";
import Stdlib from "@/pages/Stdlib";
import Libs from "@/pages/Libs";
import Erros from "@/pages/Erros";
import UB from "@/pages/UB";
import Moderno from "@/pages/Moderno";
import Threads from "@/pages/Threads";
import Projeto from "@/pages/Projeto";
import Bitwise from "@/pages/Bitwise";
import Enums from "@/pages/Enums";
import Unions from "@/pages/Unions";
import Typedef from "@/pages/Typedef";
import ConstVolatile from "@/pages/ConstVolatile";
import StaticExtern from "@/pages/StaticExtern";
import StdintStdbool from "@/pages/StdintStdbool";
import Bitfields from "@/pages/Bitfields";
import Endianness from "@/pages/Endianness";
import Alinhamento from "@/pages/Alinhamento";
import PackedStructs from "@/pages/PackedStructs";
import PontoFlutuante from "@/pages/PontoFlutuante";
import StringH from "@/pages/StringH";
import MathH from "@/pages/MathH";
import TimeH from "@/pages/TimeH";
import CtypeH from "@/pages/CtypeH";
import AssertH from "@/pages/AssertH";
import SetjmpH from "@/pages/SetjmpH";
import SignalH from "@/pages/SignalH";
import LocaleH from "@/pages/LocaleH";
import StdargH from "@/pages/StdargH";
import LimitsFloat from "@/pages/LimitsFloat";
import ListaLigada from "@/pages/ListaLigada";
import ListaDupla from "@/pages/ListaDupla";
import PilhaFila from "@/pages/PilhaFila";
import ArvoreBinaria from "@/pages/ArvoreBinaria";
import HeapPriority from "@/pages/HeapPriority";
import HashTable from "@/pages/HashTable";
import Grafo from "@/pages/Grafo";
import Trie from "@/pages/Trie";
import FilaPrioridadeDijkstra from "@/pages/FilaPrioridadeDijkstra";
import BuscaBinaria from "@/pages/BuscaBinaria";
import SortsBasicos from "@/pages/SortsBasicos";
import Quicksort from "@/pages/Quicksort";
import Mergesort from "@/pages/Mergesort";
import HeapsortRadix from "@/pages/HeapsortRadix";
import Recursao from "@/pages/Recursao";
import BfsDfs from "@/pages/BfsDfs";
import ProgramacaoDinamica from "@/pages/ProgramacaoDinamica";
import ForkExec from "@/pages/ForkExec";
import Pipes from "@/pages/Pipes";
import Mmap from "@/pages/Mmap";
import SharedMemSem from "@/pages/SharedMemSem";
import SocketsTcp from "@/pages/SocketsTcp";
import SocketsUdp from "@/pages/SocketsUdp";
import EpollSelect from "@/pages/EpollSelect";
import Dlopen from "@/pages/Dlopen";
import Syscalls from "@/pages/Syscalls";
import ProcFs from "@/pages/ProcFs";
import ArgvArgs from "@/pages/ArgvArgs";
import MutexCondvar from "@/pages/MutexCondvar";
import AtomicsC11 from "@/pages/AtomicsC11";
import MemoryModel from "@/pages/MemoryModel";
import LockFree from "@/pages/LockFree";
import Openmp from "@/pages/Openmp";
import GdbBasico from "@/pages/GdbBasico";
import GdbAvancado from "@/pages/GdbAvancado";
import Valgrind from "@/pages/Valgrind";
import Sanitizers from "@/pages/Sanitizers";
import ProfilingPerf from "@/pages/ProfilingPerf";
import Cmake from "@/pages/Cmake";
import Pkgconfig from "@/pages/Pkgconfig";
import Doxygen from "@/pages/Doxygen";
import BufferOverflow from "@/pages/BufferOverflow";
import FormatString from "@/pages/FormatString";
import IntegerOverflow from "@/pages/IntegerOverflow";
import UseAfterFree from "@/pages/UseAfterFree";
import Hardening from "@/pages/Hardening";
import Fuzzing from "@/pages/Fuzzing";
import OpaquePointers from "@/pages/OpaquePointers";
import AdtModulo from "@/pages/AdtModulo";
import CallbacksFuncptr from "@/pages/CallbacksFuncptr";
import StateMachine from "@/pages/StateMachine";
import ModulePattern from "@/pages/ModulePattern";
import UnityTests from "@/pages/UnityTests";
import Cmocka from "@/pages/Cmocka";
import TddEmC from "@/pages/TddEmC";
import Libcurl from "@/pages/Libcurl";
import SqliteC from "@/pages/SqliteC";
import JsonC from "@/pages/JsonC";
import RegexC from "@/pages/RegexC";
import Ncurses from "@/pages/Ncurses";
import Sdl2 from "@/pages/Sdl2";
import ProjetoShellMini from "@/pages/ProjetoShellMini";
import ProjetoHttpServer from "@/pages/ProjetoHttpServer";
import ProjetoGameOfLife from "@/pages/ProjetoGameOfLife";
import ProjetoJsonParser from "@/pages/ProjetoJsonParser";
import ProjetoAllocator from "@/pages/ProjetoAllocator";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-72">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
        <Route path="/historia" component={Historia} />
        <Route path="/hello" component={Hello} />
        <Route path="/tipos" component={Tipos} />
        <Route path="/conversoes" component={Conversoes} />
        <Route path="/operadores" component={Operadores} />
        <Route path="/controle" component={Controle} />
        <Route path="/funcoes" component={Funcoes} />
        <Route path="/escopo" component={Escopo} />
        <Route path="/arrays" component={Arrays} />
        <Route path="/strings" component={Strings} />
        <Route path="/ponteiros-1" component={Ponteiros1} />
        <Route path="/ponteiros-2" component={Ponteiros2} />
        <Route path="/ponteiros-3" component={Ponteiros3} />
        <Route path="/memoria" component={Memoria} />
        <Route path="/structs" component={Structs} />
        <Route path="/preprocessador" component={Preprocessador} />
        <Route path="/headers" component={Headers} />
        <Route path="/make" component={Make} />
        <Route path="/io" component={IO} />
        <Route path="/stdio" component={Stdio} />
        <Route path="/stdlib" component={Stdlib} />
        <Route path="/libs" component={Libs} />
        <Route path="/erros" component={Erros} />
        <Route path="/ub" component={UB} />
        <Route path="/moderno" component={Moderno} />
        <Route path="/threads" component={Threads} />
        <Route path="/projeto" component={Projeto} />
        <Route path="/bitwise" component={Bitwise} />
        <Route path="/enums" component={Enums} />
        <Route path="/unions" component={Unions} />
        <Route path="/typedef" component={Typedef} />
        <Route path="/const-volatile" component={ConstVolatile} />
        <Route path="/static-extern" component={StaticExtern} />
        <Route path="/stdint-stdbool" component={StdintStdbool} />
        <Route path="/bitfields" component={Bitfields} />
        <Route path="/endianness" component={Endianness} />
        <Route path="/alinhamento" component={Alinhamento} />
        <Route path="/packed-structs" component={PackedStructs} />
        <Route path="/ponto-flutuante" component={PontoFlutuante} />
        <Route path="/string-h" component={StringH} />
        <Route path="/math-h" component={MathH} />
        <Route path="/time-h" component={TimeH} />
        <Route path="/ctype-h" component={CtypeH} />
        <Route path="/assert-h" component={AssertH} />
        <Route path="/setjmp-h" component={SetjmpH} />
        <Route path="/signal-h" component={SignalH} />
        <Route path="/locale-h" component={LocaleH} />
        <Route path="/stdarg-h" component={StdargH} />
        <Route path="/limits-float" component={LimitsFloat} />
        <Route path="/lista-ligada" component={ListaLigada} />
        <Route path="/lista-dupla" component={ListaDupla} />
        <Route path="/pilha-fila" component={PilhaFila} />
        <Route path="/arvore-binaria" component={ArvoreBinaria} />
        <Route path="/heap-priority" component={HeapPriority} />
        <Route path="/hash-table" component={HashTable} />
        <Route path="/grafo" component={Grafo} />
        <Route path="/trie" component={Trie} />
        <Route path="/fila-prioridade-dijkstra" component={FilaPrioridadeDijkstra} />
        <Route path="/busca-binaria" component={BuscaBinaria} />
        <Route path="/sorts-basicos" component={SortsBasicos} />
        <Route path="/quicksort" component={Quicksort} />
        <Route path="/mergesort" component={Mergesort} />
        <Route path="/heapsort-radix" component={HeapsortRadix} />
        <Route path="/recursao" component={Recursao} />
        <Route path="/bfs-dfs" component={BfsDfs} />
        <Route path="/programacao-dinamica" component={ProgramacaoDinamica} />
        <Route path="/fork-exec" component={ForkExec} />
        <Route path="/pipes" component={Pipes} />
        <Route path="/mmap" component={Mmap} />
        <Route path="/shared-mem-sem" component={SharedMemSem} />
        <Route path="/sockets-tcp" component={SocketsTcp} />
        <Route path="/sockets-udp" component={SocketsUdp} />
        <Route path="/epoll-select" component={EpollSelect} />
        <Route path="/dlopen" component={Dlopen} />
        <Route path="/syscalls" component={Syscalls} />
        <Route path="/proc-fs" component={ProcFs} />
        <Route path="/argv-args" component={ArgvArgs} />
        <Route path="/mutex-condvar" component={MutexCondvar} />
        <Route path="/atomics-c11" component={AtomicsC11} />
        <Route path="/memory-model" component={MemoryModel} />
        <Route path="/lock-free" component={LockFree} />
        <Route path="/openmp" component={Openmp} />
        <Route path="/gdb-basico" component={GdbBasico} />
        <Route path="/gdb-avancado" component={GdbAvancado} />
        <Route path="/valgrind" component={Valgrind} />
        <Route path="/sanitizers" component={Sanitizers} />
        <Route path="/profiling-perf" component={ProfilingPerf} />
        <Route path="/cmake" component={Cmake} />
        <Route path="/pkgconfig" component={Pkgconfig} />
        <Route path="/doxygen" component={Doxygen} />
        <Route path="/buffer-overflow" component={BufferOverflow} />
        <Route path="/format-string" component={FormatString} />
        <Route path="/integer-overflow" component={IntegerOverflow} />
        <Route path="/use-after-free" component={UseAfterFree} />
        <Route path="/hardening" component={Hardening} />
        <Route path="/fuzzing" component={Fuzzing} />
        <Route path="/opaque-pointers" component={OpaquePointers} />
        <Route path="/adt-modulo" component={AdtModulo} />
        <Route path="/callbacks-funcptr" component={CallbacksFuncptr} />
        <Route path="/state-machine" component={StateMachine} />
        <Route path="/module-pattern" component={ModulePattern} />
        <Route path="/unity-tests" component={UnityTests} />
        <Route path="/cmocka" component={Cmocka} />
        <Route path="/tdd-em-c" component={TddEmC} />
        <Route path="/libcurl" component={Libcurl} />
        <Route path="/sqlite-c" component={SqliteC} />
        <Route path="/json-c" component={JsonC} />
        <Route path="/regex-c" component={RegexC} />
        <Route path="/ncurses" component={Ncurses} />
        <Route path="/sdl2" component={Sdl2} />
        <Route path="/projeto-shell-mini" component={ProjetoShellMini} />
        <Route path="/projeto-http-server" component={ProjetoHttpServer} />
        <Route path="/projeto-game-of-life" component={ProjetoGameOfLife} />
        <Route path="/projeto-json-parser" component={ProjetoJsonParser} />
        <Route path="/projeto-allocator" component={ProjetoAllocator} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Layout>
          <AppRoutes />
        </Layout>
      </WouterRouter>
    </QueryClientProvider>
  );
}
