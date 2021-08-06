// 喝水提醒
let drink_SeepNum = 0;
let drink_Timer = null;

// 当前主题
let themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// 缓存改变
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes)
  drinkAward()
});


// -----------喝水模块------------
// 喝水的判定
function drinkAward() {
  // 判断缓存有没有喝水提示时间
  chrome.storage.local.get(["isOpenDrink"], function (val) {
    let isOpenDrink = val.isOpenDrink;
    if (isOpenDrink) {
      // 有喝水提示
      chrome.storage.local.get(["drinkTime"], function (drink) {
        let time = drink.drinkTime;
        if (!time) {
          // 默认值，30分钟
          chrome.storage.local.set({ drinkTime: 30 });
        }
        // 调用提示方法
        startDrinkTime(time);
      });
    }else{
      clearInterval(drink_Timer);
    }
  });
}

// 喝水提示
function startDrinkTime(time = 30) {
  clearInterval(drink_Timer);
  drink_Timer = setInterval(function () {
    if (drink_SeepNum >= time * 60) {
      clearInterval(drink_Timer);
      noticeHandle("喝水小助手", "💕时间到啦！喝口水休息一下吧！");
      drink_SeepNum = 0;
      startDrinkTime(time);
    } else {
      drink_SeepNum += 1;
    }
  }, 1000);
}
// -----------喝水模块结束------------


