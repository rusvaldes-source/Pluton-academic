$ErrorActionPreference='Stop'
$root=Split-Path -Parent $MyInvocation.MyCommand.Path
$work=Join-Path $root 'TRABAJO_B59'
$archive=Join-Path $work 'rama.zip'
$uri='https://github.com/rusvaldes-source/Pluton-academic/archive/refs/heads/B57-Prueba.zip'
New-Item -ItemType Directory -Force -Path $work | Out-Null
Write-Host 'Descargando B57-Prueba de GitHub...'
Invoke-WebRequest -Uri $uri -OutFile $archive -UseBasicParsing
Expand-Archive -LiteralPath $archive -DestinationPath $work -Force
$repo=Get-ChildItem $work -Directory | Where-Object {$_.Name -like 'Pluton-academic-*'} | Select-Object -First 1
if(-not $repo){throw 'No se pudo localizar la copia de B57-Prueba.'}
$path=$repo.FullName
$index=Join-Path $path 'index.html'
$styles=Join-Path $path 'styles.css'
if(-not (Test-Path $index) -or -not (Test-Path $styles)){throw 'Faltan index.html o styles.css. No se modificó GitHub.'}
$h=[System.IO.File]::ReadAllText($index)
$old='src="assets/b57/estudiante-01.webp"'
if(-not $h.Contains($old)){throw 'La portada cambió desde la auditoría. Se detuvo para evitar daños.'}
$h=$h.Replace($old,'src="assets/b59/b58-fundadores-foto.webp"').Replace('alt="Estudiante con computadora y planeta Plutón"','alt="Fundadores de PLUTÓN ACADEMIC"').Replace('class="pa-b37-banner pa-b54-banner"','class="pa-b37-banner pa-b54-banner b59-founders"')
$h=$h.Replace('</head>','<link rel="stylesheet" href="assets/b59/b59.css?v=59">' + "`n" + '</head>')
$zone=[System.IO.File]::ReadAllText((Join-Path $root 'visual/zona-estudiantes-b58.html'))
$anchor='<div aria-label="Accesos de PLUTÓN ACADEMIC"'
if(-not $h.Contains($anchor)){throw 'No se encontró el ancla para estudiantes.'}
$h=$h.Replace($anchor,$zone + "`n" + $anchor)
$social='<div id="b59-redes" aria-label="Redes sociales"><strong>Síguenos / Follow us</strong><div class="b59-items" id="b59-items"></div></div><p style="text-align:center"><a href="admin/">Administración</a></p>'
$h=$h.Replace('</footer>',$social+'</footer>')
$h=$h.Replace('</body>','<script src="assets/b59/b59-social.js" defer></script></body>')
$assets=Join-Path $path 'assets/b59'
New-Item -ItemType Directory -Force -Path $assets | Out-Null
Copy-Item (Join-Path $root 'integration/b58-fundadores-foto.webp') (Join-Path $assets 'b58-fundadores-foto.webp')
Copy-Item (Join-Path $root 'b59.css') (Join-Path $assets 'b59.css')
Copy-Item (Join-Path $root 'b59-social.js') (Join-Path $assets 'b59-social.js')
Copy-Item (Join-Path $root 'social/social-links.json') (Join-Path $assets 'social-links.json')
Copy-Item (Join-Path $root 'admin') (Join-Path $path 'admin') -Recurse -Force
[System.IO.File]::WriteAllText($index,$h,[System.Text.UTF8Encoding]::new($false))
if(-not ($h.Contains('b59-founders') -and $h.Contains('b59-redes') -and $h.Contains('href="admin/"'))){throw 'Falló la validación de index.html'}
$out=Join-Path $root 'PAQUETES_PARA_GITHUB'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$files=Get-ChildItem $path -File -Recurse | Where-Object {$_.Name -notlike '*.zip'} | Sort-Object FullName
# Produce batches of at most 90 files with paths relative to repository root.
$batch=0
for($i=0;$i -lt $files.Count;$i+=90){
 $batch++
 $dest=Join-Path $out ('B59_PARTE_{0:D2}' -f $batch)
 New-Item -ItemType Directory -Force -Path $dest | Out-Null
 $files | Select-Object -Skip $i -First 90 | ForEach-Object {
  $rel=$_.FullName.Substring($path.Length).TrimStart('\')
  $to=Join-Path $dest $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $to) | Out-Null
  Copy-Item $_.FullName $to
 }
}
Write-Host "LISTO: $($files.Count) archivos repartidos en $batch carpetas de maximo 90 archivos."
Write-Host "CARPETAS: $out"
Write-Host 'Subir SOLO a B57-Prueba, conservando rutas. NO a main.'
Write-Host 'Admin requiere permisos Supabase y pruebas. Redes requieren URL oficiales.'
