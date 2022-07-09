const fileInput = document.querySelector('.file-input'),
chooseBtn = document.querySelector('.choose-img'),
img = document.querySelector('.preview-img img'),
filterOptions = document.querySelectorAll('.filter button'),
filterSlider = document.querySelector('.slider input'),
filterValue = document.querySelector('.filter-info .value'),
filterName = document.querySelector('.filter-info .name'),
resetBtn = document.querySelector('.reset-filter'),
rotateBtn = document.querySelectorAll('.rotate button'),
saveImg = document.querySelector('.save-img');

let brightness = 100 , saturation = 100 , inversion = 0 , grayscale = 0;

let rotate = 0 , flipHorizontal = 1 , flipVertical = 1;

const applyFilters = () => {
    img.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    img.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
}

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    img.src = URL.createObjectURL(file);
    img.addEventListener('load' , ()=>{
        document.querySelector('.container').classList.remove('disable');
    });
}

filterOptions.forEach(option => {
    option.addEventListener('click' , () => {
        document.querySelector('.filter .active').classList.remove('active');
        option.classList.add('active');
        filterName.innerHTML = option.innerHTML; 

        if(option.id === 'brightness'){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerHTML = `${brightness}%`;
        }
        else if(option.id === 'saturation'){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerHTML = `${saturation}%`;
        }
        else if(option.id === 'inversion'){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerHTML = `${inversion}%`;
        }
        else{
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerHTML = `${grayscale}%`;
        }
    });
});

filterSlider.addEventListener('input', () => {
    filterValue.innerHTML = `${filterSlider.value} %`;
    const selectBtn = document.querySelector('.filter .active');

    if(selectBtn.id === 'brightness'){
        brightness = filterSlider.value;
    } else if(selectBtn.id === 'saturation'){
        saturation = filterSlider.value;
    } else if(selectBtn.id === 'inversion'){
        inversion = filterSlider.value;
    } else{
        grayscale = filterSlider.value;
    }

    applyFilters();
});

rotateBtn.forEach((btn) => {
    btn.addEventListener('click' , () => {
        if(btn.id === 'left') rotate -= 90;
        else if(btn.id === 'right') rotate += 90;
        else if(btn.id === 'horizontal') flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        else flipVertical = flipVertical === 1 ? -1 : 1;
        applyFilters();
    });
});

resetBtn.addEventListener('click' , () => {
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilters();
});

saveImg.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2 , canvas.height/2);
    ctx.scale(flipHorizontal , flipVertical);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.drawImage(img , -canvas.width/2 , -canvas.height/2 , canvas.width , canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
});

fileInput.addEventListener("change" , loadImage);
chooseBtn.addEventListener('click' , () => fileInput.click());