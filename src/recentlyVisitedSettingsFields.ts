import type { CollectionConfig, Field } from 'payload'

import type { RecentlyVisitedPluginOptions } from './'

export const recentlyVisitedSettingsFields: Field[] = [
  {
    type: 'group',
    label: 'Recently visited plugin',
    name: 'recentlyVisitedPlugin',
    interfaceName: 'RecentlyVisitedPluginProps',
    fields: [
      {
        name: 'enabled',
        label: 'Enabled',
        type: 'checkbox',
      },
      {
        name: 'amount',
        label: 'History items to show',
        type: 'number',
        defaultValue: 4,
        admin: {
          condition: (_, siblingData) => siblingData.enabled,
        },
      },
    ],
  },
]

export const modifyCollections = (
  collections: CollectionConfig[],
  options?: RecentlyVisitedPluginOptions,
): CollectionConfig[] => {
  const adminUsersCollectionSlug = options?.adminUsersCollectionSlug || 'users'
  return collections.map(collection => {
    if (collection.slug !== adminUsersCollectionSlug) return collection

    return {
      ...collection,
      fields: [...collection.fields, ...recentlyVisitedSettingsFields],
    }
  })
}
