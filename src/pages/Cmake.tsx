import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Cmake() {
  return (
    <PageContainer
      title={"CMake básico"}
      subtitle={"Gerador de build moderno: escreva uma vez, gere Makefile, Ninja ou projeto Visual Studio."}
      difficulty={"intermediario"}
      timeToRead={"11 min"}
    >
      <CodeBlock
        language="cmake"
        title="CMakeLists.txt"
        code={`cmake_minimum_required(VERSION 3.16)
project(meu_app C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

add_compile_options(-Wall -Wextra -Wpedantic)

add_library(util STATIC src/util.c)
target_include_directories(util PUBLIC include)

add_executable(app src/main.c)
target_link_libraries(app PRIVATE util m)

# instalar
install(TARGETS app RUNTIME DESTINATION bin)`}
      />

      <CodeBlock
        language="bash"
        code={`mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j
ctest          # se você usou enable_testing()
cmake --install . --prefix /usr/local`}
      />

      <h2>Encontrar dependências</h2>

      <CodeBlock
        language="cmake"
        code={`find_package(OpenSSL REQUIRED)
target_link_libraries(app PRIVATE OpenSSL::SSL OpenSSL::Crypto)

find_package(PkgConfig REQUIRED)
pkg_check_modules(GLIB REQUIRED glib-2.0)
target_include_directories(app PRIVATE \${GLIB_INCLUDE_DIRS})`}
      />

      <AlertBox type="info" title={"Modern CMake"}>
        <p>Use sempre alvos (<code>target_*</code>) ao invés de variáveis globais (<code>include_directories</code>). Isso encapsula direitinho e evita conflitos.</p>
      </AlertBox>
    </PageContainer>
  );
}
