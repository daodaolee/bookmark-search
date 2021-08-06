$(function () {
  // 关闭弹窗
  $(".closeDrinkModal").click(function(){
    $(".modal").css("display","none");
    $(".modal .drink").css("display", "none");
  })
  // 更改提示时间
  $(".saveDrinkModal").click(function(){
    let value = $("#drinkTime").val()
    chrome.storage.local.set({ drinkTime: value });
    chrome.storage.local.set({ isOpenDrink: true });
    $(".modal").css("display","none")
    noticeHandle("喝水提醒","💕时间修改成功~");
  })
  // 关闭喝水提示
  $(".closeDrinkNotice").click(function(){
    chrome.storage.local.set({ isOpenDrink: false });
    $(".modal").css("display","none")
    noticeHandle("喝水提醒","💕喝水提醒已关闭~");
  })
});
