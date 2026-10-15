# RoB 2 Studio — código-fonte para hospedagem própria

Aplicação interativa em português para avaliar risco de viés com o RoB 2 IRPG beta v9. Este pacote contém o código da versão publicada, os testes e os arquivos prontos para hospedagem.

## Publicar em outra hospedagem

O site é estático: HTML, CSS, JavaScript e JSON. Não requer compilação, instalação de dependências, banco de dados, servidor de aplicação, chave de API ou conta ChatGPT para funcionar em outra hospedagem.

| Configuração | Valor |
| --- | --- |
| Diretório de publicação | `dist` |
| Arquivo inicial | `index.html` |
| Comando de instalação | Deixar vazio |
| Comando de compilação/build | Deixar vazio |
| Variáveis de ambiente da aplicação | Nenhuma |

1. Extraia o ZIP.
2. Se a hospedagem recebe arquivos, envie **todo o conteúdo de `dist/`** para a pasta pública. Mantenha os arquivos JSON e JavaScript junto de `index.html`.
3. Se a hospedagem recebe um repositório Git, envie esta pasta para um repositório seu e configure `dist` como diretório de publicação.
4. Abra a URL publicada. Não é necessário executar `npm install` ou `npm run build` para publicar.

A hospedagem deve servir arquivos `.js` como JavaScript, `.css` como CSS e permitir a leitura dos `.json`. Os caminhos são relativos e permitem publicar também em subpastas. Para restringir o acesso, configure a autenticação na hospedagem escolhida; a proteção privada do endereço original não acompanha os arquivos.

## Executar no computador

Com Python 3 instalado, abra um terminal na pasta do projeto e execute:

```bash
python3 -m http.server 8080 --directory dist
```

No Windows, se necessário:

```powershell
py -m http.server 8080 --directory dist
```

Abra `http://localhost:8080`. Utilize HTTP ou HTTPS: abrir `index.html` diretamente com duplo clique não permite carregar corretamente os módulos e os arquivos JSON em alguns navegadores.

## Levar suas avaliações para o novo endereço

As avaliações ficam no armazenamento local do navegador, separadas por endereço do site. Antes de mudar, abra o site original e exporte o backup completo em JSON. Depois abra o novo endereço e importe esse JSON. O ZIP contém o programa e o registro parcial de exemplo que acompanhou a planilha; não captura as avaliações que você salvou no navegador.

## O que está incluído

- Fluxos de intenção de tratar (ITT) e por protocolo (PP).
- Cinco domínios, julgamento global, perguntas condicionais e justificativas.
- Sugestão automática e revisão pelo avaliador.
- Gráficos de semáforo e proporções ponderadas.
- Importação de XLSM/XLSX, CSV/TSV e JSON.
- Exportação CSV, SVG/PNG, backup JSON e relatório para impressão/PDF.

A importação direta de Excel usa `DecompressionStream`, disponível em navegadores modernos. As fontes tipográficas são carregadas do Google Fonts; se indisponíveis, o CSS usa fontes alternativas. As funções da aplicação não dependem desse carregamento.

## Organização do repositório

| Caminho | Conteúdo |
| --- | --- |
| `dist/` | Aplicação completa e pronta para hospedagem; contém o código-fonte editável |
| `dist/core.js` | Regras, perguntas, fluxos e julgamentos |
| `dist/app.js` | Interface, formulários e armazenamento local |
| `dist/charts.js` | Gráficos e exportação de imagens |
| `dist/io.js` | Importação de arquivos e exportação CSV |
| `dist/model.json` / `dist/rules.json` | Metadados extraídos e árvores de decisão |
| `reference/algorithm.vba` | Algoritmos VBA de referência extraídos da planilha |
| `tests/` | Testes dos cálculos, fluxos, importação e exportação |
| `tooling/` | Scripts auxiliares da extração e verificação |
| `README_ORIGINAL.md` | Documentação técnica original |

## Verificar os testes

Com Node.js 22 ou posterior:

```bash
npm test
```

Os testes de equivalência enumeram 962.110 combinações e comparam o motor com uma tradução independente dos comandos VBA. Essa conferência não executa o Microsoft Excel. Os testes da aplicação usam uma simulação do DOM, sem inspeção visual em navegador real.

Dois testes opcionais usam a planilha original e são marcados como ignorados quando ela não está disponível. Para habilitá-los, coloque sua planilha em `tests/fixtures/original.xlsm` ou informe o caminho na variável `ROB2_FIXTURE`. O teste de importação XML também usa o pacote de desenvolvimento opcional `sax` (`npm install --no-save sax`). Esse pacote não é usado pelo site.

Para salvar as marcações HTML do teste da interface, defina `ROB2_SNAPSHOT_DIR` com uma pasta de saída. Isso é opcional.

`tooling/build-oracle.py` pode regenerar o oráculo de teste a partir do VBA incluído. `tooling/extract-model.py` requer os arquivos intermediários `UserForm3.vba`, `UserForm4.vba` e `workbook.json` em `analysis/` (ou `ROB2_ANALYSIS_DIR`), além da planilha em `ROB2_FIXTURE`. Esses arquivos intermediários e a planilha não estão incluídos e não são necessários para usar ou hospedar a aplicação: os arquivos já extraídos estão em `dist/`.

## Origem deste pacote

Código da versão publicada em 15/10/2026. Commit de origem: `4a57a6e4f465d7c28dcb6db9980c9d846b4baf90`.

Os arquivos da aplicação em `dist/` são idênticos aos desse commit. Apenas a documentação, os caminhos dos utilitários e dos testes foram preparados para execução fora do ambiente original. Metadados da hospedagem original e credenciais não fazem parte do pacote. O histórico Git não está incluído; a pasta pode ser usada para iniciar um novo repositório.
