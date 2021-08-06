// 发送通知
function noticeHandle(title = "", message = "") {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "../img/logo.png",
    title,
    message,
  });
}
// 添加缓存
function storageAdd(){}
// 删除缓存
function storageDelete(){}
// 清空缓存
function storageClear(){}

// 获取书签一维数组
 function getBookMarks(){
  return new Promise(resolve => {
    let result = [];
    chrome.bookmarks.getTree(bookmarks => {
      let bookmark = bookmarks[0].children.find(item => item.id === "1");
      bookmark.children.forEach(book => {
        if(!book.children){
          // 纯链接
          result.push({
            url: book.url,
            title: book.title,
            id: book.id,
            ico: getFavicon(book.url)
          })
        } else {
          // 带文件夹的链接
          book.children.forEach(child => {
            result.push({
              url: child.url,
              title: child.title,
              id: child.id,
              ico: getFavicon(child.url)
            })
          })
        }
        resolve(result)
      });
    })
  })
}
// 获取带父节点的书签二级数组
function getBookMarksByParent(){
  return new Promise(resolve => {
    // chrome.storage.local.get("bookmarks", function(val){
      // if(val.bookmarks && val.bookmarks.length){
      //   val.bookmarks.forEach(item => {
      //     if(item.children){
      //       item.children.forEach(child => {
      //         child.keyword = `${getKeyword(child)}-${child.title ? child.title.toUpperCase() : ""}--${child.url ? child.url.toUpperCase() : ""}`;
      //       })
      //     }
      //   })
      //   resolve(val.bookmarks)
      // }else{
        chrome.bookmarks.getTree(bookmarks => {
          let bookmark = bookmarks[0].children.find(item => item.id === "1");
          bookmark.children.forEach(item => {
            if(item.children){
              let temp = [];
              let x = flat(item.children)
              temp = [...x]
              temp.forEach(t => {
                t.keyword = `${getKeyword(t)}-${t.title ? t.title.toUpperCase() : ""}--${t.url ? t.url.toUpperCase() : ""}`;
              })
              item.children = temp;
            }
          })
          let once = bookmark.children.filter(item => item.parentId === "1" && !item.children);
          once.forEach(o => {
            o.keyword = `${getKeyword(o)}-${o.title ? o.title.toUpperCase() : ""}--${o.url ? o.url.toUpperCase() : ""}`;
          })
          bookmark.children.unshift({
            title: "",
            parentId: "1",
            children: once
          })
          resolve(bookmark.children || [])
        })
      // }
    // })
  })
}
// 拍平数组
function flat(arr = []) {
  let res = [];
  arr.map(item => {
    if(Array.isArray(item.children)) {
        res = res.concat(flat(item.children));
    } else {
        res.push(item);
    }
  });
  return res;
}

// 通过子节点获取父节点并拼接
async function getParentNodeByChild(arr){
  const data = await getBookMarksByParent();
  let result = [];
  data.forEach(item => {
    if(!item.children || !item.children.length){
      return
    }
    let obj = {
      id: item.id,
      title: item.title,
      children: []
    };
    arr.forEach(a => {
      let has = item.children.some(i => i.id === a.id);
      if(has){
         obj.children.push(a)
      }
    })
    result.push(obj)
  })
  return result.filter(item => item.children.length)
}

// 获取书签文件夹节点
function getBookMarksParent(){
  return new Promise(resolve => {
    let result = [];
    chrome.bookmarks.getTree(bookmarks => {
      let bookmark = bookmarks[0].children.find(item => item.id === "1");
      bookmark.children.forEach(book => {
        if(book.children){
          result.push({
            label: book.title,
            value: book.id
          })
        }
      })
      resolve(result)
    })
  })
}

function getFavicon(url){
  return `chrome://favicon/size/48/${url}`
}

function getKeyword(data){
  let obj = {
    "node": "nodeJs,服务,后端，node文档",
    "antdv": "AntDesignVue, antdv,Ant Design Vue, UI框架，组件，蚂蚁，antdv文档",
    "element": "elementUI, element ui, UI框架，组件，饿了么，element文档",
    "github": "github,git,仓库,代码",
    "iconfont": "iconfont， 图标，图片",
    "zhihu": "知乎，zhihu",
    "douban": "douban， 豆瓣",
    "vue": "vue, v2, v3,JS,javascript，vue文档",
    "router": "vue, vuerouter，react文档",
    "vuex": "vuex，文档",
    "react": "react,JS,javascript，文档",
    "segmentfault": "segmentfault,思否",
    "vite": "vitejs,打包，发布，vite文档",
    "webpack": "webpack，打包，发布，webpack文档",
    "mozilla":"mdn文档",
    "caniuse": "caniuse，我可以用，兼容",
    "ts": "typescript,ts,js，ts文档",
    "yinxiang":"印象，笔记，yinxiang",
    "processon":"processon,导图，脑图，流程图，思维",
    "python": "python,语言"
  }
  let temp = Object.keys(obj).filter(item => data.url.indexOf(item) > -1);
  let str = ""
  temp.forEach(item => {
    str += obj[item]
  })
  return str;
}