const time = () => new Date().toTimeString().split(" ")[0];
const field = (name, value, inline = false) => ({
  name,
  value,
  inline,
});

const infos = {
  name: process.env["SITE_NAME"],
  deploy: {
    id: process.env["DEPLOY_ID"],
    url: process.env["DEPLOY_URL"],
    log: `https://app.netlify.com/${process.env["SITE_NAME"]}/deploys/${process.env["DEPLOY_ID"]}`,
  },
  node: process.env["NODE_VERSION"],
  url: process.env["URL"],
  webhook: process.env["DISCORD_WEBHOOK_URL"],
  context: process.env["CONTEXT"],
  build: process.env["BUILD_ID"],
  branch: process.env["BRANCH"],
  repository: process.env["REPOSITORY_URL"],
  commit: process.env["COMMIT_REF"],
  head: process.env["HEAD"],
};

module.exports = {
  onPreBuild: async ({ build }) => {
    !process.env["DISCORD_WEBHOOK_URL"] && build.failBuild("No webhook set");

    console.log("Discord webhook URL was found");
  },

  onSuccess: async ({ constants, utils }) => {
    const webhookUrl = process.env["DISCORD_WEBHOOK_URL"];

    const buildInfo = {
      build_id: constants.BUILD_ID,
      site_name: constants.SITE_NAME,
      branch: constants.BRANCH,
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Netlify",
          avatar_url: "https://www.netlify.com/v3/img/components/logomark.png",
          embeds: [
            {
              author: {
                name: "Netlify",
                url: "https://app.netlify.com",
                icon_url:
                  "https://www.netlify.com/v3/img/components/logomark.png",
              },
              url: `https://app.netlify.com/sites/${process.env["SITE_NAME"]}`,
              color: 2731430,
              title: "🚀 Déploiement réussi !",
              description: `[${process.env["SITE_NAME"]}](${
                process.env["URL"]
              }) was deployed at ${time()}.`,
              fields: [
                field("Build ID", infos.build),
                field("Context", infos.context),
                field("Node version", infos.node),
                field("Repository", infos.repository),
                field("Branch", infos.branch),
                field("Commit", infos.commit),
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      console.log("Notification envoyée sur Discord.");
    } catch (error) {
      utils.build.failPlugin(
        `Erreur lors de l'envoi de la notification Discord : ${error.message}`,
      );
    }
  },

  onError: async ({ constants, utils }) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      utils.build.failPlugin(
        "Le plugin Netlify Discord nécessite une URL de webhook Discord dans la variable DISCORD_WEBHOOK_URL.",
      );
      return;
    }

    const buildInfo = {
      build_id: constants.BUILD_ID,
      site_name: constants.SITE_NAME,
      branch: constants.BRANCH,
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "⚠️ Échec du déploiement",
              description: `Le site **${buildInfo.site_name}** n'a pas été déployé.`,
              color: 2731430, // Couleur personnalisée
              fields: [
                { name: "Branch", value: buildInfo.branch, inline: true },
                { name: "Build ID", value: buildInfo.build_id, inline: true },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: "Netlify",
                icon_url:
                  "https://www.netlify.com/v3/img/components/logomark.png",
              },
              url: "https://app.netlify.com",
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      console.log("Notification d'échec envoyée sur Discord.");
    } catch (error) {
      utils.build.failPlugin(
        `Erreur lors de l'envoi de la notification Discord : ${error.message}`,
      );
    }
  },
};
