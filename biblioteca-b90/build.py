from pathlib import Path
import json
p=Path(__file__).parent
data=json.loads((p/"content.json").read_text())
template='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PLUTÓN · Vista de revisión</title><style>__CSS__</style></head><body><header><div><div class="top"><span class="brand">PLUTÓN ACADEMIC · __VERSION__</span><button id="language" type="button">English</button></div><h1 id="title"></h1><p id="subtitle"></p></div></header><main><aside id="notice" class="notice"></aside><div id="catalog"><div class="tools"><label><span id="search-label"></span><input id="search" type="search" autocomplete="off"></label><label><span id="category-label"></span><select id="category"></select></label></div><p id="count" role="status"></p><div id="cards" class="cards"></div></div><div id="reader" hidden></div><footer id="footer"></footer></main><script>window.PREVIEW_DATA=__DATA__;</script><script>__JS__</script></body></html>'
payload=json.dumps(data,ensure_ascii=False).replace("<", "\\u003c")
html=template.replace("__CSS__",(p/"styles.css").read_text()).replace("__VERSION__",data["version"]).replace("__DATA__",payload).replace("__JS__",(p/"app.js").read_text())
(p/"index.html").write_text(html)
print("Built", data["version"])
