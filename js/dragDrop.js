(function () {
  function Init() {
    let fileSelect = document.getElementById('file-upload'),
      fileDrag = document.getElementById('file-drag'),
      submitButton = document.getElementById('submit-button');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Is XHR2 available?
    let xhr = new XMLHttpRequest();

    if (xhr.upload) {
      // File Drop
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    const fileDrag = document.getElementById('file-drag');

    e.stopPropagation();
    e.preventDefault();

    if (e.type === 'dragover')
      fileDrag.classList.add('uploader__inner--drag');
    else
      fileDrag.classList.remove('uploader__inner--drag');
  }

  function setDragHover() {
    const fileDrag = document.getElementById('file-drag');
    fileDrag.className = 'uploader__inner-done';

    const _fileUploadBtn = document.getElementById('file-upload-btn');
    const _uploaderArrowImg = document.querySelector('.uploader__arrow');
    const _uploaderDoneImg = document.querySelector('.uploader__done');

    _fileUploadBtn.style.display = 'none';
    _uploaderArrowImg.style.display = 'none';
    _uploaderDoneImg.style.display = 'block';
  }

  function fileSelectHandler(e) {
    // Fetch FileList object
    let files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);
    setDragHover();

    // Process all File objects
    for (let i = 0, f; f = files[i]; i++) {
      setNameFile(f.name);
      uploadFile(f);
    }
  }

  function setNameFile(msg) {
    const _messages = document.getElementById('messages');
    _messages.innerHTML = msg;
  }

  function setProgressMaxValue(e) {
    let pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.max = e.total;
    }
  }

  function updateFileProgress(e) {
    let pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.value = e.loaded;
    }
  }

  function uploadFile(file) {

    let xhr = new XMLHttpRequest(),
      fileInput = document.getElementById('class-roster-file'),
      pBar = document.getElementById('file-progress'),
      fileSizeLimit = 1024; // In MB

    if (xhr.upload) {

      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 1024 * 1024) {
        // Progress bar
        pBar.style.display = 'inline';
        xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
        xhr.upload.addEventListener('progress', updateFileProgress, false);

        // File received / failed
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState == 4) {
            // Everything is good!

            // progress.className = (xhr.status == 200 ? "success" : "failure");
            // document.location.reload(true);
          }
        }

          ;

        // Start upload
        xhr.open('POST', document.getElementById('file-upload-form').action, true);
        xhr.setRequestHeader('X-File-Name', file.name);
        xhr.setRequestHeader('X-File-Size', file.size);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(file);
      }

      else {
        setNameFile('Загрузите файл меньшего размера (< ' + fileSizeLimit + ' MB).');
      }
    }
  }

  // Check for the letious File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  }

  else {
    document.getElementById('file-drag').style.display = 'none';
  }
}

)();
