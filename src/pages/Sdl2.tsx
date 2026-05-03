import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sdl2() {
  return (
    <PageContainer
      title={"SDL2: gráficos e janela"}
      subtitle={"Multimídia portátil — janela, eventos, render 2D, áudio. Mil jogos indie começam aqui."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="c"
        code={`#include <SDL2/SDL.h>

int main(int argc, char **argv) {
    SDL_Init(SDL_INIT_VIDEO);
    SDL_Window  *w = SDL_CreateWindow("ola", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, 0);
    SDL_Renderer *r = SDL_CreateRenderer(w, -1, SDL_RENDERER_ACCELERATED);

    int rodando = 1, x = 400, y = 300;
    while (rodando) {
        SDL_Event e;
        while (SDL_PollEvent(&e))
            if (e.type == SDL_QUIT) rodando = 0;
        const Uint8 *keys = SDL_GetKeyboardState(NULL);
        if (keys[SDL_SCANCODE_LEFT])  x -= 4;
        if (keys[SDL_SCANCODE_RIGHT]) x += 4;

        SDL_SetRenderDrawColor(r, 20, 20, 30, 255);
        SDL_RenderClear(r);
        SDL_SetRenderDrawColor(r, 255, 100, 80, 255);
        SDL_Rect player = { x, y, 40, 40 };
        SDL_RenderFillRect(r, &player);
        SDL_RenderPresent(r);
        SDL_Delay(16);
    }
    SDL_DestroyRenderer(r);
    SDL_DestroyWindow(w);
    SDL_Quit();
}`}
      />

      <CodeBlock
        language="bash"
        code={`gcc app.c $(sdl2-config --cflags --libs) -o app`}
      />

      <AlertBox type="info" title={"SDL_image, SDL_ttf, SDL_mixer"}>
        <p>Bibliotecas satélites pra carregar PNG/JPG, fontes TrueType e tocar som/música. Juntas formam a base de uma engine 2D enxuta.</p>
      </AlertBox>
    </PageContainer>
  );
}
