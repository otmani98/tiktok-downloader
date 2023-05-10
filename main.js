let fileInput = document.querySelector("input");
let downloadBtn = document.querySelector("button");
let popup = document.querySelector(".popup");
let blurs = document.querySelector(".blurs");
let result = document.querySelector(".result");
let error = document.querySelector(".error");

let sizeofVideo;
let setNameVideo;
let videoLinks1;
let videoLinks2;
let audioLink;
let duration;
let desc;
let cover;

const url =
  "https://tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com/media-info/?link=";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "65ff46f604msh5eb8aaf7403cb92p186c53jsnf7ace0c9448e",
    "X-RapidAPI-Host":
      "tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com",
  },
};

downloadBtn.addEventListener("click", (e) => {
  error.innerHTML = "";
  downloadBtn.innerText = "Fetching...";
  fetchdataOnclick();
});

//
function fetchdataOnclick() {
  fetch(`${url}${fileInput.value}`, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Wrong Link");
      }
      return res.json();
    })
    .then((res) => {
      if (res.result.video.url_list[0].includes("https://v25")) {
        fetchdataOnclick();
      }
      sizeofVideo = res.result.video.data_size;
      setNameVideo = res.result.aweme_id;
      videoLinks1 = res.result.video.url_list[0];
      videoLinks2 = res.result.video.url_list[2];
      audioLink = res.result.music.url_list[0];
      duration = res.result.video.duration;
      desc = res.result.aweme_detail.desc;
      cover = res.result.aweme_detail.video.cover.url_list[0];
      console.log(videoLinks1);
      downloadBtn.innerText = "Download";
      popupclick();
    })
    .catch(() => {
      error.innerHTML = `Error Fetching Data Wrong Link`;
      downloadBtn.innerText = "Download";
    });
}

//render data to popup element and show it
function popupclick() {
  popup.innerHTML = `<button
          id="exit"
          class="circle fromMiddle"
          data-animation="magnify"
          data-remove="3000"
        >
          <span></span>
        </button>
        <div class="img">
          <img
            src="${cover}"
            alt=""
          />
        </div>
        <div class="content">
          <h3>
            ${desc}
          </h3>
          <button id="s1" setData="${videoLinks1}">Download S1</button>
          <button id="au" setData="${audioLink}">Download Audio</button>
        </div>`;
  popup.style.display = "flex";
  blurs.style.display = "block";
}

//fetching for specefic file and run get
function fetchFile(url, buttonId) {
  fetch(url).then((res) => {
    get(res, buttonId);
    return res.blob();
  });
}

//get progress of dowloading and making a blob data
async function get(response, buttonId) {
  let buttontarget = document.getElementById(`${buttonId}`);
  let stashInner = buttontarget.innerHTML;
  let currentsize = 0;
  let chunks = [];
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      buttontarget.innerHTML = stashInner;
      if (buttonId === "s1") {
        return download(
          new Blob(chunks, {
            type: "video/mp4",
          })
        );
      } else {
        return download(
          new Blob(chunks, {
            type: "audio/mp3",
          })
        );
      }
    }
    chunks.push(value);
    currentsize += value.length;
    console.log(value.length);
    buttontarget.innerHTML = `Progress ${(
      (currentsize * 100) /
      sizeofVideo
    ).toFixed(2)}%`;
  }
}

//for exitbutton and download buttons
document.addEventListener("click", function (e) {
  if (e.target.id === "exit") {
    popup.style.display = "none";
    blurs.style.display = "none";
  }
  if (e.target.getAttribute("setData")) {
    fetchFile(e.target.getAttribute("setData"), e.target.id);
  }
});

//run download after blob data
function download(file) {
  let tempUrl = URL.createObjectURL(file);
  const aTag = document.createElement("a");
  console.log(tempUrl);
  aTag.href = tempUrl;
  aTag.download = setNameVideo;
  document.body.appendChild(aTag);
  aTag.click();
  downloadBtn.innerText = "Download File";
  URL.revokeObjectURL(tempUrl);
  aTag.remove();
}