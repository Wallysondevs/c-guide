import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoGameOfLife() {
  return (
    <PageContainer
      title={"Projeto: Game of Life"}
      subtitle={"O autômato celular do Conway: regras simples, comportamento emergente. ~80 linhas com ncurses."}
      difficulty={"intermediario"}
      timeToRead={"14 min"}
    >
      <CodeBlock
        language="c"
        title="gol.c"
        code={`#include <ncurses.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

#define W 80
#define H 24

int grade[H][W], prox[H][W];

int vizinhos(int y, int x) {
    int n = 0;
    for (int dy = -1; dy <= 1; dy++)
        for (int dx = -1; dx <= 1; dx++) {
            if (dy == 0 && dx == 0) continue;
            int yy = (y + dy + H) % H, xx = (x + dx + W) % W;
            n += grade[yy][xx];
        }
    return n;
}

void passo(void) {
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++) {
            int v = vizinhos(y, x);
            prox[y][x] = grade[y][x]
                ? (v == 2 || v == 3)
                : (v == 3);
        }
    memcpy(grade, prox, sizeof grade);
}

int main(void) {
    initscr(); curs_set(0); noecho();
    srand(time(NULL));
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++)
            grade[y][x] = rand() % 4 == 0;
    while (1) {
        clear();
        for (int y = 0; y < H; y++)
            for (int x = 0; x < W; x++)
                if (grade[y][x]) mvaddch(y, x, '#');
        refresh();
        passo();
        usleep(80000);
    }
}`}
      />

      <h2>Regras do Conway</h2>

      <ul>
        <li>Célula viva com 2 ou 3 vizinhos vivos: sobrevive.</li>
        <li>Célula morta com exatamente 3 vivos: nasce.</li>
        <li>Resto: morre.</li>
      </ul>

      <AlertBox type="info" title={"Otimizações famosas"}>
        <p>Hashlife (Bill Gosper) usa quadtrees + memoization e simula trilhões de gerações em segundos. Show de algoritmo.</p>
      </AlertBox>
    </PageContainer>
  );
}
