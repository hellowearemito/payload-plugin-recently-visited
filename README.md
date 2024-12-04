# Payload Plugin Recently Viewed

The aim of this plugin is to provide a list of recently viewed pages to the user. 
This plugin is useful for users who want to quickly navigate to the pages they have recently viewed.

## Installation

```bash
npm install @hellowearemito/payload-plugin-recently-viewed
```

## Usage

```typescript
import { recentlyVisited } from 'payload-plugin-recently-visited'

export default buildConfig({
  // ... rest of the config
  plugins: [
    recentlyVisited({ enabled: true })
  ]
})
```

## Options

| Option                   | Type      | Default           | Description                                        |
|--------------------------|-----------|-------------------|----------------------------------------------------|
| enabled                  | `boolean` | `false`           | Enable or disable the plugin                       |
| adminUsersCollectionSlug | `string`  | `users`           | The collection slug for the admin users collection |
| breadcrumbClass          | `string`  | `.step-nav__last` | The class name for the breadcrumb container        |

## Usage on the Frontend

The plugin settings for each user can be accessible via the Account Settings page.
It is possible to enable or disable the plugin, and to set the maximum number of pages to be displayed.
Minimum number of pages to be displayed is 1 and the maximum number of pages to be displayed is 10.

## License

MIT