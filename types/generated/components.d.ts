import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsSportType extends Struct.ComponentSchema {
  collectionName: 'components_components_sport_types';
  info: {
    displayName: 'sport-type';
  };
  attributes: {
    Type: Schema.Attribute.Enumeration<['Run', 'Walk', 'Yoga', 'Mobility']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.sport-type': ComponentsSportType;
    }
  }
}
