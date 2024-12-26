Netlify Discord Notification Plugin
===================================

This plugin sends deployment notifications to a Discord webhook, allowing you to track deployment statuses directly from your Discord channel.

Installation
------------

To install the plugin in your Netlify project, follow these steps:

1.  Navigate to your Netlify project directory.

2.  Install the plugin as a dependency using npm or yarn:

    ```sh
    npm install @dev0ph3r/netlify-plugin-discord
    ```

    or

    ```sh
    yarn add @dev0ph3r/netlify-plugin-discord
    ```

3.  Add the plugin to your `netlify.toml` configuration file:
```
    [[plugins]]
        package = "@dev0ph3r/netlify-plugin-discord"
```

Configuration
-------------

The plugin requires two environment variables to function properly. You can set these variables in the **Netlify UI**.<br>
### Required Environment Variables

1.  **DISCORD\_WEBHOOK\_URL** [^1]
    [^1]: (How to create a webhook in discord: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

    *   **Description**: The Discord webhook URL where notifications will be sent.

    *   **Example**:

        DISCORD\_WEBHOOK\_URL=https://discord.com/api/webhooks/your-webhook-id/your-webhook-token

2.  **DISCORD\_PLUGIN\_LANGUAGE**

    *   **Description**: The language used in notifications.

    *   **Options**: `EN` (English) or `FR` (French). Defaults to `EN` if not specified.

    *   **Example**:

        DISCORD\_PLUGIN\_LANGUAGE=FR


### Setting Environment Variables in Netlify

To configure the environment variables in Netlify:

1.  Go to your site in the Netlify dashboard.

2.  Navigate to **Site settings > Environment variables**.

3.  Add the following variables:

    *   `DISCORD_WEBHOOK_URL`

    *   `DISCORD_PLUGIN_LANGUAGE`

4.  Save the changes.


Usage
-----

Once the plugin is installed and the environment variables are set, it will automatically send deployment notifications to the specified Discord webhook during build events.

### Notifications

*   **Success Notification**: Sent when the build and deployment succeed.

*   **Error Notification**: Sent when the build or deployment fails.


Both notifications include detailed information about the deployment, such as the site name, branch, build ID, and more.

Support
-------

If you encounter any issues or have questions, feel free to reach out via the plugin's repository.

Enjoy seamless notifications with the Netlify Discord Notification Plugin!
