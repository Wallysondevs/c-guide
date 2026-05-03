import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Controle() {
  return (
    <PageContainer
      title="Controle de Fluxo"
      subtitle="if, else, switch, while, for, do/while, break, continue, goto. As estruturas que decidem o que executar e quando parar. Iguais a outras linguagens — mas com algumas pegadinhas só de C."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <h2>if / else if / else</h2>
      <CodeBlock
        language="c"
        code={`if (idade >= 18) {
    printf("maior\\n");
} else if (idade >= 12) {
    printf("adolescente\\n");
} else {
    printf("criança\\n");
}

/* Sem chaves — vale só pra UMA linha (cuidado!) */
if (x > 0)
    printf("positivo\\n");

/* Estilo seguro: SEMPRE chaves */
if (x > 0) {
    printf("positivo\\n");
}`}
      />

      <AlertBox type="danger" title="O bug 'goto fail' da Apple (2014)">
        <pre className="text-xs mt-2">{`if (cond)
    goto fail;
    goto fail;       // ← duplicado, mas SEMPRE executa (sem chaves!)
                     // bug que travou TLS no iOS por meses`}</pre>
        Use chaves sempre. Custa nada e evita bugs históricos.
      </AlertBox>

      <h2>switch / case</h2>
      <CodeBlock
        language="c"
        code={`switch (opcao) {
    case 1:
        printf("um\\n");
        break;
    case 2:
        printf("dois\\n");
        break;
    case 3:
    case 4:                         // dois cases compartilham o mesmo bloco
        printf("três ou quatro\\n");
        break;
    default:
        printf("desconhecido\\n");
}

/* IMPORTANTE: switch só funciona com inteiros (int, char, enum) — NÃO com strings, float, double */`}
      />

      <AlertBox type="warning" title="Esqueceu o break = fall-through">
        Sem <code>break</code>, a execução "vaza" pro próximo case.
        Às vezes você QUER isso — e em C23 dá pra documentar com
        <code> [[fallthrough]]</code>:
      </AlertBox>

      <CodeBlock
        language="c"
        code={`switch (mes) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        dias = 31; break;
    case 4: case 6: case 9: case 11:
        dias = 30; break;
    case 2:
        dias = bissexto ? 29 : 28; break;
}

/* Fall-through INTENCIONAL (C23) */
switch (cmd) {
    case 'A':
        log_admin();
        [[fallthrough]];     // documenta: SIM, eu quero cair no próximo
    case 'a':
        executar();
        break;
}`}
      />

      <h2>while</h2>
      <CodeBlock
        language="c"
        code={`/* Roda enquanto a condição for verdadeira */
int i = 0;
while (i < 10) {
    printf("%d\\n", i);
    i++;
}

/* Loop infinito (controlado por break dentro) */
while (1) {
    int c = getchar();
    if (c == EOF) break;
    putchar(c);
}`}
      />

      <h2>do / while — roda PELO MENOS uma vez</h2>
      <CodeBlock
        language="c"
        code={`int opcao;
do {
    printf("Menu:\\n1) ...\\n2) ...\\n");
    scanf("%d", &opcao);
} while (opcao < 1 || opcao > 2);
//      ↑ ponto e vírgula obrigatório`}
      />

      <h2>for — o mais comum</h2>
      <CodeBlock
        language="c"
        code={`/* for (init; condição; pós) */
for (int i = 0; i < 10; i++) {
    printf("%d\\n", i);
}

/* Decrementando */
for (int i = 9; i >= 0; i--) { ... }

/* De 2 em 2 */
for (int i = 0; i < 100; i += 2) { ... }

/* Loop infinito (forma idiomática) */
for (;;) { ... }

/* Múltiplas variáveis */
for (int i = 0, j = 10; i < j; i++, j--) { ... }`}
      />

      <AlertBox type="warning" title="Declarar dentro do for é C99+">
        Em C89 (clássico), você TEM que declarar antes:
        <code> int i; for (i = 0; ...)</code>. Em C99+ pode declarar
        no <code>for</code> direto. Use <code>-std=c99</code> ou superior.
      </AlertBox>

      <h2>break e continue</h2>
      <CodeBlock
        language="c"
        code={`/* break — sai do loop ou switch ATUAL */
for (int i = 0; i < 100; i++) {
    if (achou(i)) break;
}

/* continue — pula pra próxima iteração */
for (int i = 0; i < 100; i++) {
    if (i % 2 == 0) continue;    // pula pares
    printf("%d\\n", i);
}`}
      />

      <h2>goto — sim, ele existe (e tem uso legítimo)</h2>
      <p>
        <code>goto</code> tem fama ruim ("Goto Considered Harmful",
        Dijkstra 1968), mas em C tem UM uso aceito pela comunidade:
        <strong> tratamento de erro com cleanup</strong>. É padrão no
        kernel do Linux.
      </p>

      <CodeBlock
        language="c"
        code={`/* Padrão "single exit" — limpa recursos antes de sair */
int processar(const char *path) {
    FILE *f = NULL;
    char *buf = NULL;
    int rc = -1;

    f = fopen(path, "r");
    if (!f) goto cleanup;

    buf = malloc(1024);
    if (!buf) goto cleanup;

    if (fread(buf, 1, 1024, f) == 0) goto cleanup;

    /* ... processa ... */
    rc = 0;   // sucesso

cleanup:
    free(buf);
    if (f) fclose(f);
    return rc;
}`}
      />

      <AlertBox type="danger" title="goto SÓ pra frente (forward goto)">
        Pular pra cima ou pra dentro de outro bloco vira pesadelo de
        manutenção. A regra: <code>goto cleanup</code> sempre desce.
      </AlertBox>

      <h2>Padrão idiomático: ler arquivo até EOF</h2>
      <CodeBlock
        language="c"
        code={`int c;
while ((c = getchar()) != EOF) {
    putchar(c);
}

/* Por que getchar() retorna int (não char)?
   Porque EOF é -1, e char unsigned não pode ser negativo.
   Se você ler como char, NUNCA vai detectar EOF. */`}
      />

      <h2>Loops aninhados — break sai SÓ do mais interno</h2>
      <CodeBlock
        language="c"
        code={`/* break sai só do for de j */
for (int i = 0; i < N; i++) {
    for (int j = 0; j < M; j++) {
        if (achou(matriz[i][j])) break;
    }
}

/* Pra sair de AMBOS, use flag ou goto */
int achei = 0;
for (int i = 0; i < N && !achei; i++) {
    for (int j = 0; j < M; j++) {
        if (achou(matriz[i][j])) { achei = 1; break; }
    }
}

/* Ou com goto (mais limpo às vezes) */
for (int i = 0; i < N; i++) {
    for (int j = 0; j < M; j++) {
        if (achou(matriz[i][j])) goto done;
    }
}
done: ;`}
      />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="warning" title="; sobrando depois do for">
        <pre className="text-xs mt-2">{`for (int i = 0; i < 10; i++);    // ← ponto e vírgula extra!
{
    printf("%d\\n", i);            // ESTE bloco roda só UMA vez
}`}</pre>
      </AlertBox>

      <AlertBox type="warning" title="while (i++ < 10) é confuso">
        <code>while (i &lt; 10) &#123; ...; i++; &#125;</code> é mais
        legível. Evite incremento dentro da condição.
      </AlertBox>

      <h2>Resumão</h2>
      <CodeBlock
        language="c"
        code={`if (cond) {} else if (cond) {} else {}

switch (n) {
    case 1: ...; break;
    default: ...;
}

while (cond) {}             // 0 ou mais vezes
do {} while (cond);         // 1 ou mais vezes
for (init; cond; pos) {}    // mais comum

break;       // sai do loop/switch atual
continue;    // próxima iteração
goto label;  // SÓ pra cleanup; sempre adiante

/* Idiomas */
for (;;) {}                                     // loop infinito
while ((c = getchar()) != EOF) {}               // ler até EOF
if (p && p->valor > 0) {}                       // proteção curto-circuito`}
      />
    </PageContainer>
  );
}
