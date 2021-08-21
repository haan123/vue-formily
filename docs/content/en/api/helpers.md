---
title: Helpers
description: 'Helpers'
position: 24
category: Api
---

Helpers functions that help to work with plugins and form elements. 

### plug
Register new plugin.

**Signatures**
```typescript
plug(plugin: VueFormilyPlugin, ...args: any[]): void;

interface VueFormilyPlugin {
  name: string;
  // When calling `registerElement` helper, this method will be called.
  install(...args: any[]): any;
  // This options will passed to `install` method when it's called.
  options?: Record<string, any>;
  [key: string]: any;
}
```

**Parameters**
- **plugin** - The registering plugin.
- **...args** - Additional arguments, 

<alert>
When the <b>registerElement</b> helper is called, it will pass the plugin's options as first parameter.
</alert>


### unplug
Un-register a plugin.

**Signatures**
```typescript
unplug(name: string): void;
```

**Parameters**
- **name** - The plugin's name.

### getPlug
Get a plugin to work with.

**Signatures**
```typescript
getPlug(name: string): VueFormilyPlugin;
```

**Parameters**
- **name** - The plugin's name.

**Returns**
- The `VueFormilyPlugin`.

### registerElement
Register new form element. This function is using when installing **vue-formily**. When calling, it's also executing the [static `register`](/api/element#static-register) method of that form element.

**Signatures**
```typescript
registerElement(F: any, ...args: any[]): void;
```

**Parameters**
- **F** - The new form element.
- **...args** - Additional arguments.

<alert> 
When installing <b>vue-formily</b> with <b>Vue.use(VueFormily, options)</b>, the options will be passed as first parameter.
</alert>

### unregisterElement
Un-register a form element. When calling, it's also executing the [static `register`](/api/element#static-unregister) method of that form element.

**Signatures**
```typescript
unregisterElement(F: any, ...args: any[]): void;
```

**Parameters**
- **F** - The form element to remove.
- **...args** - Additional arguments.
