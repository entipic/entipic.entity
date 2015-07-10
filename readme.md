# entipic topic

Entipic topic explorer. Find topic in wikipedia.

## API

- `wikipedia`
  + `api`
    + `query`
    + `search`
    + `oepnSearch`
  + `entity`
    + `explore`(lang, name) - explore an entity by name
    + `info`(lang, title) - find entity info: title, description
    + `type`(title) - find entity type: person, group or place

## Usage

```
var wikipedia = require('entipic.entity').wikipedia;

wikipedia.entity.explore('en', 'Obama')
  .then(function(entity){
    
  });
```
