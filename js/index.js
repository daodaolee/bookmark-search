$(async function () {
  let tagColor = [
    {
      name: "magenta",
      background: "#fff0f6",
      border: "#ffadd2",
      color: "#c41d7f",
    },
    {
      name: "red",
      background: "#fff1f0",
      border: "#ffa39e",
      color: "#cf1322",
    },
    {
      name: "volcano",
      background: "#fff2e8",
      border: "#ffbb96",
      color: "#d4380d",
    },
    {
      name: "orange",
      background: "#fff7e6",
      border: "#ffd591",
      color: "#d48806",
    },
    {
      name: "gold",
      background: "#fffbe6",
      border: "#ffe58f",
      color: "#c41d7f",
    },
    {
      name: "green",
      background: "#f6ffed",
      border: "#b7eb8f",
      color: "#389e0d",
    },
    {
      name: "cyan",
      background: "#e6fffb",
      border: "#87e8de",
      color: "#08979c",
    },
    {
      name: "blue",
      background: "#e6f7ff",
      border: "#91d5ff",
      color: "#096dd9",
    },
    {
      name: "geekblue",
      background: "#f0f5ff",
      border: "#adc6ff",
      color: "#1d39c4",
    },
    {
      name: "purple",
      background: "#f9f0ff",
      border: "#d3adf7",
      color: "#531dab",
    },
  ];

  // 查询默认焦点
  $("#searchInput").focus();
  // 读取书签栏并渲染
  const bookmarks = await getBookMarksByParent()
  getTags(bookmarks, tagColor);


  // 过滤渲染
  $("input").keyup(async function () {
    $("input").empty();
    let val = $("input").val();
    if (!val) {
      getTags(bookmarks, tagColor)
      return
    }
    let filterResult = [];
    for (let key = 0; key < bookmarks.length; key++) {
      let child = bookmarks[key].children;
      // 没有匹配过滤就跳出
      if (!Array.isArray(child)) {
        continue
      }
      child.forEach(item => {
        // let target = `${item.title ? item.title.toUpperCase() : ""}-${item.url ? item.url.toUpperCase() : ""}`;
        if (item.keyword && item.keyword.toUpperCase().indexOf(val.toUpperCase()) > -1) {
          filterResult.push(item)
        }
      })

    }
    if (filterResult.length === 0) {
      let empty = document.createElement("div");
      empty.classList.add("emptyData");
      let desc = document.createElement("span");
      desc.innerHTML = `没有哦！`;
      let baidu = document.createElement("span");
      baidu.innerHTML = "搜百度";
      baidu.style.fontSize = "14px";
      baidu.style.color = "#1a73e8";
      baidu.style.display = "inline-block";
      baidu.style.marginRight = "10px";
      baidu.style.cursor = "pointer";
      baidu.addEventListener("click", function () {
        chrome.tabs.create({ url: `https://www.baidu.com/s?wd=${val}` })
      })
      let google = document.createElement("span");
      google.innerHTML = "搜谷歌";
      google.style.fontSize = "14px";
      google.style.color = "#1a73e8";
      google.style.display = "inline-block";
      baidu.style.cursor = "pointer";
      google.addEventListener("click", function () {
        chrome.tabs.create({ url: `https://www.google.com/search?q=${val}` })
      })
      empty.appendChild(desc)
      empty.appendChild(baidu)
      empty.appendChild(google)
      $(".tags").empty();
      $(".tags").append(empty);
    } else {
      let result = await getParentNodeByChild(filterResult)
      getTags(result, tagColor);
    }
  });
});

function getTags(data, tagColor) {
  $(".tags").empty();
  for (let key = 0; key < data.length; key++) {
    if (!data[key].children) {
      continue
    }
    let tagCategory = document.createElement("div");
    tagCategory.classList.add("tagCategory");
    tagCategory.style.paddingBottom = "5px";
    tagCategory.style.fontSize = "12px";
    tagCategory.innerHTML = data[key].title;

    let tagContainer = document.createElement("div");
    tagContainer.classList.add("tagContainer");
    tagContainer.style.display = "flex";
    tagContainer.style.flexWrap = "wrap";
    tagContainer.style.paddingBottom = "5px";
    $(".tags").append(tagCategory);
    $(".tags").append(tagContainer);

    data[key].children.forEach((item) => {
      let len = Math.floor(Math.random() * 10);
      let span = document.createElement("span");
      span.innerText = item.title || "";
      span.title = item.keyword;
      // span.style.color = "rgb(95,99,104)";

      span.style.paddingLeft = "5px";
      span.style.transition = "all 0.2s ease-in-out";
      span.style.display = "inline-block";
      let img = document.createElement("img");
      img.src = getFavicon(item.url);
      img.style.verticalAlign = "middle";
      img.style.width = "16px";
      img.style.height = "16px";
      let innerDiv = document.createElement("div");
      innerDiv.style.paddingBottom = "1px";
      innerDiv.style.display = "flex";
      innerDiv.style.alignItems = "center";
      innerDiv.style.fontSize = "12px";
      innerDiv.style.cursor = "pointer";
      // innerDiv.style.borderRadius = "4px";
      innerDiv.style.margin = "2px 10px 6px 0";
      innerDiv.style.lineHeight = "20px";
      innerDiv.appendChild(img);
      if (item.title) {
        innerDiv.appendChild(span);
        innerDiv.style.borderBottom = "2px solid " + tagColor[len].border;
      }

      if (item.url) {
        innerDiv.addEventListener("click", function () {
          chrome.tabs.create({ url: item.url });
        });
      } else if (item.onClick) {
        innerDiv.addEventListener("click", item.onClick);
      }
      tagContainer.appendChild(innerDiv);
    });

  }
}

function searchOther(type, val) {
  let url = "";
  switch (type) {
    case "baidu":
      url = `https://www.baidu.com/s?wd=${val}`
      break;
    case "google":
      url = `https://www.google.com/search?q=${val}`
      break;
  }
  chrome.tabs.create({ url })
}

//防抖功能
function debounce(handler, delay) {
  var timer = null;
  return function (e) {
    var _self = this,
      _arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      handler.apply(_self, _arg);
    }, delay);
  };
}

// 背景
chrome.storage.local.get(["isOpenBG"], function (result) {
  if (result.isOpenBG) {
    $(".switch").addClass('active');
    window['rib'] = new Ribbons()
  } else {
    $(".switch").removeClass('active');
    $("#bgCanvas").remove()
    delete window['rib']
  }
})


$(".switch").click(function () {
  chrome.storage.local.get(["isOpenBG"], function (has) {
    if (has.isOpenBG) {
      $(".switch").removeClass('active');
      chrome.storage.local.remove('isOpenBG')
      $("#bgCanvas").remove()
      delete window['rib']
    } else {
      $(".switch").addClass('active');
      chrome.storage.local.set({ 'isOpenBG': 'active' })
      window['rib'] = new Ribbons()
    }
  })
})