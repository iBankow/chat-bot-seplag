import categories from "./data/categories.js";
import axios from "axios";
import fs from "node:fs/promises";
import fsSync from "node:fs";

async function main() {
  for (let i = 0; i < 22; i++) {
    let category = categories[i].value;
    let { data } = await axios.post(
      "https://portal.mt.gov.br/v1/search/new_search",
      {
        groups: ["CATALOG"],
        category: category,
      }
    );
    for (let service of data) {
      let resp = await axios.get(
        `https://portal.mt.gov.br/v1/catalog/${service.slug}/load`
      );
      await saveFile(resp.data, category);
    }
  }
}
const PATH_CATEGORIES = "./catalago/services/";

async function saveFile(service, category) {
  const folderName = PATH_CATEGORIES + category + "/";

  if (!fsSync.existsSync(folderName)) {
    fsSync.mkdirSync(folderName);
  }

  let data = JSON.stringify(service);

  console.log(data);

  await fs.writeFile(
    folderName +
      "/" +
      service.slug
        .replaceAll('"', "")
        .replaceAll(":", "")
        .replaceAll("(", "")
        .replaceAll(")", "") +
      ".json",
    data
  );
}

main();
