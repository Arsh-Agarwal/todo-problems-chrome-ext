let problemListKey = "all_problems";
const curURL = window.location.href;

window.addEventListener('load', () => {
    addBMBtn();
});

function addBMBtn(){
    const bmBtn = document.createElement("img");
    bmBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bmBtn.className = "bm-btn";
    bmBtn.title = "Bookmark this problem";
    bmBtn.style.width = "25px";
    bmBtn.style.height = "25px";
    bmBtn.style.marginLeft = "10px";
    bmBtn.addEventListener("click", addBMEvent);
    console.log("bm-btn: ", bmBtn);

    //now add the button
    container = document.getElementsByClassName("problem-statement")[0].firstChild.firstChild;
    container.appendChild(bmBtn);
}

const addBMEvent = async () => {
    curBMs = await fetchBMs();
    console.log("curBMs: ", curBMs);
    container = document.getElementsByClassName("problem-statement")[0].firstChild.firstChild;
    problemTitle = container.textContent;
    console.log("Problem Title: ", problemTitle);

    newBM = {
        url: curURL,
        desc: problemTitle
    };

    let done = false;
    for(let i = 0; i < curBMs.length; i++){
        if(curBMs[i].url === curURL) {done = true; break;}
    }
    if(done) return;
    chrome.storage.sync.set({
        [problemListKey]: JSON.stringify([...curBMs, newBM])
    }); 
}

const fetchBMs = () => {
    return new Promise((resolve) => { 
        chrome.storage.sync.get([problemListKey], (obj) => {
            resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);
        });
    });
}