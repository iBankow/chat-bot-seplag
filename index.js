import fs from "node:fs";
import { convert } from "html-to-text";

const PATH = "./catalog/services/";

function main() {
  const categories = fs.readdirSync(PATH);

  for (let j = 0; j < 1; j++) {
    const services = fs.readdirSync(PATH + categories[j]);
    for (let i = 0; i < 1; i++) {
      const service = JSON.parse(
        fs.readFileSync(PATH + categories[j] + "/" + services[i])
      );

      let txt = "";

      txt += "SERVIÇO: " + service.name.replaceAll("\n", "") + "\n";
      txt +=
        "DESCRIÇÃO DO SERVIÇO: " +
        service.description.replaceAll("\n", "") +
        "\n\n";

      txt +=
        "ORGÃO: " +
        service.department.name +
        " - " +
        service.department.shortName +
        "\n\n";

      txt +=
        "SERVIÇO É ONLINE?" + `${service.isDigital ? " SIM" : " NÃO"}` + "\n";
      txt +=
        "SERVIÇO É DIGITAL?" +
        `${service.isDigital ? " SIM" : " NÃO"}` +
        "\n\n";

      txt += "CATEGORIA:\n";
      txt += service.category.name + "\n\n";

      txt += "PUBLICO ALVO:\n";
      txt += service.targets.toString().replace(",", ", ") + "\n\n";
      txt += "TAGS:\n";
      txt += service.tags.toString().replace(",", ", ") + "\n\n";

      txt += "INFORMAÇÕES:\n";
      for (let info of service.info) {
        let infoFormated = convert(info.text, { ignoreLineBreaks: true });
        txt += info.title + "\n";
        txt += infoFormated.replaceAll("\n", "") + "\n";
      }

      txt += "PASSO A PASSO:\n";
      for (let info of service.steps) {
        let infoFormated = convert(info.htmlContent, {
          ignoreLineBreaks: true,
        });
        txt += info.name + "\n";
        txt += infoFormated + "\n";
      }

      // if (!fs.existsSync("./data/services/" + service.category.slug)) {
      //   fs.mkdirSync("./data/services/" + service.category.slug);
      // }

      // fs.writeFileSync(
      //   "./data/services/" +
      //     service.category.slug +
      //     "/" +
      //     services[i].slice(0, -4) +
      //     "txt",
      //   txt
      // );
    }
  }
}

main();
