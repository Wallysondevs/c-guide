import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Ncurses() {
  return (
    <PageContainer
      title={"ncurses: TUI em C"}
      subtitle={"Janelas, cores, teclas, menus no terminal. A base de htop, mc, vim básico."}
      difficulty={"intermediario"}
      timeToRead={"10 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <ncurses.h>

int main(void) {
    initscr();              // entra modo TUI
    cbreak();               // teclas sem buffer de linha
    noecho();               // não ecoa
    keypad(stdscr, TRUE);   // setas e F-keys
    curs_set(0);            // esconde cursor

    int x = 10, y = 5;
    int ch;
    while ((ch = getch()) != 'q') {
        clear();
        mvprintw(y, x, "@");
        mvprintw(0, 0, "use setas, q sai");
        refresh();
        switch (ch) {
            case KEY_UP:    y--; break;
            case KEY_DOWN:  y++; break;
            case KEY_LEFT:  x--; break;
            case KEY_RIGHT: x++; break;
        }
    }
    endwin();
}`}
      />

      <CodeBlock
        language="bash"
        code={`gcc app.c -lncurses -o app`}
      />

      <h2>Cores e janelas</h2>

      <CodeBlock
        language="c"
        code={`start_color();
init_pair(1, COLOR_RED, COLOR_BLACK);
attron(COLOR_PAIR(1));
mvprintw(0, 0, "vermelho!");
attroff(COLOR_PAIR(1));

WINDOW *w = newwin(10, 30, 5, 5);
box(w, 0, 0);
mvwprintw(w, 1, 1, "dentro da janela");
wrefresh(w);`}
      />
    </PageContainer>
  );
}
