let problemListKey = "all_problems";
const curURL = window.location.href.toString();
const urlStr = curURL.toString();
console.log("content.js loaded...");

window.addEventListener("load", function() {
    this.setTimeout(() => {
        console.log("content loaded. adding btn....");
        addBMBtn();
    }, 2500);
});

function addBMBtn(){
    const bmBtn = document.createElement("img");
    bmBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bmBtn.className = "bm-btn";
    bmBtn.title = "Bookmark this problem";
    bmBtn.style.width = "25px";
    bmBtn.style.height = "25px";
    bmBtn.style.marginLeft = "10px";
    bmBtn.style.marginRight = "10px";
    bmBtn.addEventListener("click", addBMEvent);

    //now add the button
    if(urlStr.includes("codeforces.com")){
        let container = document.getElementsByClassName("problem-statement")[0].firstChild.firstChild;
        container.insertBefore(bmBtn, container.firstChild);
    }else if(urlStr.includes("codechef.com")){
        let container = document.getElementById('problem-statement');
        console.log("container: ", container);
        container.removeChild(container.firstChild);

        const heading = document.createElement("h2");
        heading.style.display = "inline-block";
        heading.textContent = "Problem";

        container.insertBefore(bmBtn, container.firstChild);
        container.insertBefore(heading, container.firstChild);
    }else if(urlStr.includes("leetcode.com")){
        if(urlStr.includes("contest")){
            let container = document.getElementsByTagName("h3")[0];
            container.insertBefore(bmBtn, container.firstChild);
        }else{
            let container = document.getElementsByClassName("mr-2 text-label-1 dark:text-dark-label-1 text-lg font-medium")[0].parentNode;
            container.insertBefore(bmBtn, container.firstChild);
        }
    }else if(urlStr.includes("atcoder.jp")){
        let container = document.getElementsByClassName("h2")[0]
        container.insertBefore(bmBtn, container.firstChild);
    }else if(urlStr.includes("interviewbit.com")){
        let container = document.getElementsByClassName("p-tile__title")[0];
        container.insertBefore(bmBtn, container.firstChild);
    }else if(urlStr.includes("spoj.com")){
        let container = document.getElementById("problem-name");
        container.insertBefore(bmBtn, container.firstChild);
    }
}

const addBMEvent = async () => {
    curBMs = await fetchBMs();
    console.log("curBMs: ", curBMs);
    let container;
    if(urlStr.includes("codeforces.com")){
        container = document.getElementsByClassName("problem-statement")[0].firstChild.firstChild;
    }else if(urlStr.includes("codechef.com")){
        container = document.getElementsByClassName("_titleStatus__container_15tum_839")[0];
    }else if(urlStr.includes("leetcode.com")){
        if(urlStr.includes("contest")){
            container = document.getElementsByTagName("h3")[0];
        }else{
            container = document.getElementsByClassName("mr-2 text-label-1 dark:text-dark-label-1 text-lg font-medium")[0];
        }
    }else if(urlStr.includes("atcoder.jp")){
        container = document.getElementsByClassName("h2")[0];
    }else if(urlStr.includes("interviewbit.com")){
        container = document.getElementsByClassName("p-tile__title")[0];
    }else if(urlStr.includes("spoj.com")){
        container = document.getElementById("problem-name");
    }
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