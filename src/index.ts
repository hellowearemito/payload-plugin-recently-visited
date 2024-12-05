import type { Config, Plugin } from 'payload'

import { modifyCollections } from './recentlyVisitedSettingsFields'

export interface RecentlyVisitedPluginOptions {
  /**
   * Enable or disable plugin
   * @default undefined
   */
  enabled: boolean

  /**
   * Admin user collection slug
   * @default 'users'
   */
  adminUsersCollectionSlug?: string


  /**
   * CSS class for the breadcrumb last element
   * – its useful if you have custom navigation, it expects the last item of the breadcrumb
   * @default '.step-nav__last'
   */
  breadcrumbClass?: string
}

export const recentlyVisited = (pluginOptions: RecentlyVisitedPluginOptions): Plugin => {
  return (incomingConfig: Config): Config => {
    if (!pluginOptions.enabled) return incomingConfig

    const config: Config = {
      ...incomingConfig,
      admin: {
        ...(incomingConfig.admin || {}),
        dependencies: {
          ...(incomingConfig.admin?.dependencies || {}),
          recentlyVisited: {
            path: '@hellowearemito/payload-plugin-recently-visited/RecentlyVisited',
            type: 'component',
            clientProps: pluginOptions
          }
        },
        components: {
          ...(incomingConfig.admin?.components || {}),
          beforeNavLinks: [
            ...(incomingConfig.admin?.components?.beforeNavLinks || []),
            '@hellowearemito/payload-plugin-recently-visited/RecentlyVisited',
          ],
        },
      },
      collections: modifyCollections(incomingConfig.collections || [], pluginOptions),
    }

    return config
  }
}
