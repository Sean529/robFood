// const appName = "盒马";
// launchApp(appName);
// sleep(3000);
auto.waitFor()

// 点击按钮
const clickSettle = () => {
	id('button_cart_charge').findOne().click()
}

const hasText = (text) => {
	return textStartsWith(text).exists() // 是否存在指定文本
}

const start = () => {
	// 是否有结算按钮
	if (hasText("结算")) {
		// 点击结算
		clickSettle()
		sleep(1000)
		start()
	} else if (hasText('非常抱歉，当前商品运力不足(063)') || hasText('很抱歉，下单失败')) {
		// 返回上一页
		back()
		sleep(1000)
		start()
	} else if (hasText('提交订单')) {
		className("android.widget.TextView").text("提交订单").findOne().parent().click()
		sleep(1000)
		start()
	} else {
		toast('停止活动了')
		exit()
	}
}

start()



















// while (true) {
	// if (!settle) {
	// 	toast('没找到结算按钮')
	// 	// continue
	// } else {
	// 	toast('点击结算按钮')
	// 	settle.click();
	// 	toast(settle)
	// 	sleep(100);
	// }
// }
// else {
// 	toast("未检查到领喵币按钮");
// 	//中止脚本
// 	exit();
// }