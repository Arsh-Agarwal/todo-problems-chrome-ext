let problemListKey = "all_problems";

const fetchBMs = () => {
    return new Promise((resolve) => { 
        chrome.storage.sync.get([problemListKey], (obj) => {
            resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);
        });
    });
};

const addControl = (key, callback, container) => {
    const newElement = document.createElement("img");
    newElement.src = "assets/" + key + '.png';
    newElement.title = key;
    newElement.className = "bm-controls";
    newElement.addEventListener("click", callback);
    container.appendChild(newElement);
};

const onPlay = async e => {
    const url = e.target.parentNode.parentNode.getAttribute("url");
    window.open(url, "_blank");
};

const onDelete = async e => {
    const url = e.target.parentNode.parentNode.getAttribute("url");
    console.log("deleting bm url: ", url);
    
    let curBMs = await fetchBMs();
    curBMs = curBMs.filter((bm) => {bm.url!=url});
    chrome.storage.sync.set({[problemListKey]: JSON.stringify(curBMs)});
    viewBMs(curBMs);
};

const addBMElement = (bm, bmContainer) => {
    //set up primary container
    const newBMElement = document.createElement("div");
    newBMElement.id = "bookmark-" + bm.url.toString().split('-').at(-1);
    newBMElement.className = "bm";
    newBMElement.setAttribute("url", bm.url);

    //setup title
    const bmTitle = document.createElement("p");
    bmTitle.textContent = bm.desc;
    bmTitle.className = "bm-text";
    newBMElement.appendChild(bmTitle);

    //setup control elements
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "controls-container";
    addControl("play", onPlay, controlsContainer);
    addControl("delete", onDelete, controlsContainer);
    newBMElement.appendChild(controlsContainer);

    bmContainer.appendChild(newBMElement);
};

const viewBMs = (curBMs = []) => {
    const bmContainer = document.getElementById("bms");
    bmContainer.innerHTML = "";
    if(curBMs.length==0){
        bmContainer.innerHTML = "<i>No bookmarks to show.</i>"
    }else{
        for(let i = 0; i < curBMs.length; i++){
            const bm = curBMs[i];
            addBMElement(bm, bmContainer);
        }
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.sync.get([problemListKey], (data) => {
        const curBMs = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];
        viewBMs(curBMs);
    });
});