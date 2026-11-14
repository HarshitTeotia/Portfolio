param([string]$Compiler)
$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$source = Join-Path $repoRoot 'resume/Harshit_Teotia_Resume.tex'
$buildDir = Join-Path $repoRoot 'resume/build'
New-Item -ItemType Directory -Path $buildDir -Force | Out-Null
if (-not $Compiler) {
  $pdfLatex = Get-Command pdflatex -ErrorAction SilentlyContinue
  if ($pdfLatex) { $Compiler = $pdfLatex.Source }
  elseif (Test-Path (Join-Path $repoRoot '.tools/tectonic/tectonic.exe')) {
    $Compiler = Join-Path $repoRoot '.tools/tectonic/tectonic.exe'
  } else { throw 'Install PDFLaTeX, or pass -Compiler with a Tectonic executable path.' }
}
if ([IO.Path]::GetFileNameWithoutExtension($Compiler) -eq 'pdflatex') {
  & $Compiler -interaction=nonstopmode -halt-on-error -output-directory $buildDir $source
} else {
  $env:TECTONIC_CACHE_DIR = Join-Path $repoRoot '.tools/tectonic/cache'
  & $Compiler --keep-logs --keep-intermediates --outdir $buildDir $source
}
if ($LASTEXITCODE -ne 0) { throw 'Resume compilation failed; production asset was not replaced.' }
$log = Get-Content -LiteralPath (Join-Path $buildDir 'Harshit_Teotia_Resume.log') -Raw
if ($log -match 'Overfull \\[hv]box') { throw 'Resume has an overfull layout box; production asset was not replaced.' }
$compiled = Join-Path $buildDir 'Harshit_Teotia_Resume.pdf'
Copy-Item -LiteralPath $compiled -Destination (Join-Path $repoRoot 'resume/Harshit_Teotia_Resume.pdf')
Copy-Item -LiteralPath $compiled -Destination (Join-Path $repoRoot 'public/resume/Harshit_Teotia_Resume.pdf')
Write-Output 'Compiled resume copied to resume/ and the existing public/resume/ asset path.'
