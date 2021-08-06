class Popup {
  constructor() {
    this.timer = null;
    this.arr = [];
    this.result = "";
  }
  // 导入数据
  import(){
    let data = window.prompt("请输入名称，逗号分隔", this.arr);
    this.arr = data.trim().replace(/，/g, ",").split(",")
  }
  // 开始抽奖
  play() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      let index = Math.floor(Math.random() * this.arr.length);
      $(".result").html(this.arr[index])
    }, 30);
  }
	// 结束抽奖
	stop(){
		clearInterval(this.timer);
	}
}

let popup = new Popup();
$(".start").click(function(){
  $("canvas").css("display","none")
	popup.play();
})
$(".end").click(function(){
  $("canvas").css("display","block")
	popup.stop();
})
$(".import").click(function(){
  $("canvas").css("display","none")
  popup.import()
})