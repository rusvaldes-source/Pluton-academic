$ErrorActionPreference='Stop'
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
$out=Join-Path $root 'SUBIR_A_B57_PRUEBA'
New-Item -ItemType Directory -Force $out | Out-Null
$url='https://raw.githubusercontent.com/rusvaldes-source/Pluton-academic/B57-Prueba/index.html'
Write-Host 'Leyendo index.html de B57-Prueba...'
Invoke-WebRequest -Uri $url -OutFile (Join-Path $out 'index.html') -UseBasicParsing
$p=Join-Path $out 'index.html'
$h=[IO.File]::ReadAllText($p)
$old='src="assets/b57/estudiante-01.webp"'
if($h.Contains('b59-founders') -or $h.Contains('b59-redes')) {throw 'Ya existe una integración parcial; detenido para no duplicar cambios.'}
if(-not $h.Contains($old)) {throw 'No coincide la portada esperada. Detenido sin subir nada.'}
if(-not $h.Contains('class="pa-b37-banner pa-b54-banner"')) {throw 'No coincide la estructura del banner.'}
if(-not $h.Contains('</footer>')) {throw 'No se encuentra el pie de página.'}
$h=$h.Replace($old,'src="assets/b59/b58-fundadores-foto.webp"')
$h=$h.Replace('alt="Estudiante con computadora y planeta Plutón"','alt="Fundadores de PLUTÓN ACADEMIC"')
$h=$h.Replace('class="pa-b37-banner pa-b54-banner"','class="pa-b37-banner pa-b54-banner b59-founders"')
$h=$h.Replace('</head>','<link rel="stylesheet" href="assets/b59/b59.css?v=59">' + "`n" + '</head>')
$social='<div id="b59-redes" aria-label="Redes sociales"><strong data-b53-es="Síguenos" data-b53-en="Follow us">Síguenos</strong><div class="b59-items" id="b59-items"></div></div><p style="text-align:center"><a href="admin/" data-b53-es="Administración" data-b53-en="Administration">Administración</a></p>'
$h=$h.Replace('</footer>',$social+'</footer>')
$h=$h.Replace('</body>','<script src="assets/b59/b59-social.js?v=59" defer></script></body>')
if(-not ($h.Contains('b59-founders') -and $h.Contains('b59-redes') -and $h.Contains('href="admin/"'))) {throw 'Falló la validación de integración.'}
[IO.File]::WriteAllText($p,$h,[Text.UTF8Encoding]::new($false))
$assets=Join-Path $out 'assets/b59'
New-Item -ItemType Directory -Force $assets | Out-Null
Copy-Item (Join-Path $root 'assets/b59/*') $assets
Write-Host 'LISTO: 5 archivos corregidos, en SUBIR_A_B57_PRUEBA.'
Write-Host 'En GitHub selecciona B57-Prueba y sube index.html y la carpeta assets (conservando rutas). NO main.'
Write-Host 'La web publica no cambia hasta publicar desde la rama aprobada.'
