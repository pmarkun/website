const path = require("path");
const fs = require("fs");
const lodash = require("lodash");


module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets/");
    
    // Coleção de posts do blog
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/blog/*.md").reverse();
    });

    // Coleção de itens do portfólio
    eleventyConfig.addCollection("portfolio", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/content/projetos/**/*.md");
    });
    

    // Adiciona o filtro groupBy
    eleventyConfig.addFilter("groupBy", function(array, key) {
        groups = lodash.groupBy(array, key);
        //faz um sort nos grupos em ordem decrescente de key
        groups = Object.keys(groups).sort().reverse().reduce((acc, key) => {
            acc[" "+String(key)] = groups[key];
            return acc;
        }, {});
        return groups;
    });

    // Define o layout padrão dinamicamente com base no último diretório
    eleventyConfig.addGlobalData("eleventyComputed", {
        layout: data => {
            const inputPath = data.page.inputPath;
            const lastFolder = path.basename(path.dirname(inputPath)); // Último diretório
            const potentialTemplate = `${lastFolder}.njk`; // Nome do template esperado
            const templatePath = path.join("src/_includes/layouts", potentialTemplate);
            // Verifica se o template existe
            if (fs.existsSync(templatePath)) {
                return 'layouts/' + potentialTemplate;
            }

            // Retorna o layout original ou nenhum
            return data.layout;
        }
    });
    
    return {
      dir: {
        input: "src",
        includes: "_includes",
        data: "_data",
        output: "dist"
      }
    };
  };
  