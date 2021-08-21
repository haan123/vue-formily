---
title: CollectionItem
description: 'Collection Item'
position: 24
category: Api
---

## Class CollectionItem
<tree :items="[
  { text: 'Evento', url: '/api/evento' },
  { text: 'Objeto', url: '/api/objeto' },
  { text: 'Element', url: '/api/element' },
  { text: 'Group', url: '/api/group' },
  { text: 'CollectionItem' }
]"></tree>

Represents a **group item** in a **collection**.

## Constructor
This class inherit the constructor of the parent class.

## Properties
| Prop | Type | Default | Description |
| ---- | ---- | ---------------- | ----------- |
| **index** <prop-infos readonly></prop-infos> | `number` |  | The index of current item in the collection element |
| **formId** <prop-infos readonly></prop-infos> | `string` |  | The generated `formId` of this item which is following the format `{formId}{index}` |

## Inherited Methods
### From class [Group](/api/group)
<InheritedMethods name="group"></InheritedMethods>

### From class [Element](/api/element)
<InheritedMethods name="element"></InheritedMethods>

### From class [Evento](/api/evento)
<InheritedMethods name="evento"></InheritedMethods>
