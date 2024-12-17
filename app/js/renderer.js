const { ipcRenderer } = require('electron')
const path = require('path')
const os = require('os')

const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')
const selectedFile = document.getElementById('selected-file')

document.getElementById('output-path').innerText = path.join(os.homedir(), 'imageshrink')

let fullPath

// Abrindo o dialog para seleção do arquivo:
img.addEventListener('click', async () => {
  fileInfo = await ipcRenderer.invoke('open-file-dialog')
  
  if(fileInfo) {
    const { filePath, fileName } = fileInfo
    fullPath = filePath
    selectedFile.value = fileName
  }
})

form.addEventListener('submit', e => {
  e.preventDefault()

  const imgPath = fullPath
  const quality = slider.value

  ipcRenderer.send('image:minimize', { imgPath, quality })
})

ipcRenderer.on('image:done', () => {
  // toast do Materialize
  M.toast({
    html: `Image resized to ${slider.value}% quality`,
  })
})
