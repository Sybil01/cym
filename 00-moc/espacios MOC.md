
```dataview
TABLE    without ID ("![|100](" + img + ")") as foto, file.link as name, year as year, tags, backlinks as backlinks
FROM "06-out/espacios" 
SORT Status DESC
FLATTEN tags
```


