const enMessages = require('./i18n/en.json');
const frMessages = require('./i18n/fr.json');

const language = process.env.DISCORD_PLUGIN_LANGUAGE || 'EN';

const messages = {EN: enMessages, FR: frMessages};
const translatedMessages = messages[language.toUpperCase()] || enMessages;

const time = () => {
  const now = new Date();
  return now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
};

const field = (name, value, inline = false) => ({
  name,
  value: value || 'Unavailable',
  inline,
});

const infos = {
  name: process.env.SITE_NAME,
  deploy: {
    id: process.env.DEPLOY_ID,
    url: process.env.DEPLOY_URL,
    log: `https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.DEPLOY_ID}`,
  },
  node: process.env.NODE_VERSION,
  url: process.env.URL,
  webhook: process.env.DISCORD_WEBHOOK_URL,
  context: process.env.CONTEXT,
  build: process.env.BUILD_ID,
  branch: process.env.BRANCH,
  repository: process.env.REPOSITORY_URL,
  commit: process.env.COMMIT_REF,
};

module.exports = {
  onPreBuild: async ({utils}) => {
    if (!infos.webhook) {
      utils.build.failBuild(translatedMessages.noWebhook);
    }
  },

  onSuccess: async ({utils}) => {
    const webhookUrl = infos.webhook;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: 'Netlify',
          avatar_url:
            'https://www.netlify.com/v3/img/components/logomark.png',
          embeds: [
            {
              author: {
                name: 'Netlify',
                url: 'https://app.netlify.com',
                icon_url:
                  'https://www.netlify.com/v3/img/components/logomark.png',
              },
              title: `${translatedMessages.successTitle} ${infos.name}`,
              url: infos.deploy.url,
              color: 3066993,
              description: translatedMessages.successDescription
                .replace('{name}', infos.name)
                .replace('{url}', infos.url)
                .replace('{time}', time())
                .replace('{log}', infos.deploy.log),
              fields: [
                field('Build ID', infos.build, true),
                field('Context', infos.context, true),
                field('Node version', infos.node, true),
                field('Repository', infos.repository),
                field('Branch', infos.branch, true),
                field('Commit', infos.commit, true),
              ],
              footer: {
                text: 'Netlify Build System',
                icon_url:
                  'https://www.netlify.com/v3/img/components/logomark.png',
              },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      utils.build.failPlugin(
        translatedMessages.notificationFailure.replace('{error}', error.message),
      );
    }
  },

  onError: async ({utils}) => {
    const webhookUrl = infos.webhook;

    if (!webhookUrl) {
      utils.build.failPlugin(translatedMessages.noWebhook);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: 'Netlify',
          avatar_url:
            'https://www.netlify.com/v3/img/components/logomark.png',
          embeds: [
            {
              title: `${translatedMessages.failureTitle} ${infos.name}`,
              description: translatedMessages.failureDescription
                .replace('{name}', infos.name)
                .replace('{url}', infos.url)
                .replace('{log}', infos.deploy.log),
              color: 15158332,
              fields: [
                field('Build ID', infos.build, true),
                field('Branch', infos.branch, true),
                field('Context', infos.context, true),
              ],
              footer: {
                text: 'Netlify Build System',
                icon_url:
                  'https://www.netlify.com/v3/img/components/logomark.png',
              },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      utils.build.failPlugin(
        translatedMessages.notificationFailure.replace('{error}', error.message),
      );
    }
  },
};
