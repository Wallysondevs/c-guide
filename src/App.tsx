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
