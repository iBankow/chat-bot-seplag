import fs from "node:fs";
import { convert } from "html-to-text";

const PATH = "./catalago/services/";

function main() {
  const categories = fs.readdirSync(PATH);

  for (let j = 0; j < categories.length; j++) {
    const services = fs.readdirSync(PATH + categories[j]);
    for (let i = 0; i < services.length; i++) {
      const service = JSON.parse(
        fs.readFileSync(PATH + categories[j] + "/" + services[i])
      );

      let txt = "";

      txt += "SERVIÇO: " + service.name + "\n";
      txt += "DESCRIÇÃO DO SERVIÇO: " + service.description + "\n\n";

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
        let infoFormated = convert(
          info.text,
          // .replace(/<p><br \/><\/p>/g, "")
          // .replace(/<p>/g, "") // Remove <p>
          // .replace(/<\/p>/g, "\n") // Substitui </p> por nova linha
          { ignoreLineBreaks: true }
        );
        txt += info.title + "\n";
        txt += infoFormated + "\n";
      }

      txt += "PASSO A PASSO:\n";
      for (let info of service.steps) {
        let infoFormated = convert(info.htmlContent);
        txt += info.name + "\n";
        txt += infoFormated + "\n";
      }

      if (!fs.existsSync("./catalago/data/" + service.category.slug)) {
        fs.mkdirSync("./catalago/data/" + service.category.slug);
      }

      fs.writeFileSync(
        "./catalago/data/" +
          service.category.slug +
          "/" +
          services[i].slice(0, -4) +
          "txt",
        txt
      );
    }
  }
}

main();
