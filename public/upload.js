let inputFile = document.getElementById('myfile');
let fileNameField = document.getElementById('file-name');
inputFile.addEventListener('change',function(event){
        let uploadFilename = event.target.files[0].name;
        fileNameField.textContent = uploadFilename;
    })