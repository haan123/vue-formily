---
title: String Formatter
description: 'String Formatter'
position: 23
category: Plugins
---

## String Formatter Plugin
The string formatter plugin for **vue-formily**. This is also the core of the [I18n plugin](/plugins/i18n)

## Install
### In Vue Formily Installation
```typescript
import Vue from 'vue';
import VueFormily from 'vue-formily';
import stringFormatter from 'vue-formily/plugins/stringFormatter';

Vue.use(VueFormily, {
  plugins: [stringFormatter]
});
```

### In Runtime
```typescript
import stringFormatter from 'vue-formily/plugins/stringFormatter';
import { plug } from 'vue-formily';

plug(stringFormatter);
```

## Options
Currently, this plugin doesn't has any options.

## Basic Usage
### Stand Along
```typescript
import stringFormatter from 'vue-formily/plugins/stringFormatter';

stringFormatter.format('Hello, {name}!', {
  name: 'Bob'
}); // Hello, Bob!

stringFormatter.format('Today is {dates[6]}.', {
  dates: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}); // Today is Sunday.

stringFormatter.format('Welcome, {user.name}!', {
  user: {
    name: 'Bob'
  }
}); // Welcome, Bob!
```

### In Vue Formily
This plugin is using in [Field](/api/field) that has the `string` type. The format template can be set by the `format` option is [Field's schema](/api/field#constructor). Here is the [formatting example](/examples/formatting).


## Methods
### format
Format the input string.

**Signatures**
```typescript
format(format: string, data: Record<string, any> | Record<string, any>[]): string;
```

**Parameters**
- **format** - The format string.
- **data** - The data used for the formatting.

## Related concepts
- [plug](/api/helpers#plug)
