function autoStart() {
  auto.waitFor()
  const SHORT_WAIT = 200
  const LONG_WAIT = 2000
  const appName = "叮咚买菜"
  launchApp(appName)
  sleep(LONG_WAIT)

  const path = "res/大籽-白月光与朱砂痣.mp3"
  // const path = '/storage/emulated/0/脚本/at-robFood/res/大籽-白月光与朱砂痣.mp3'
  let m = media
  function musicPlay() {
    musicStop()
    m.playMusic(path)
    function mySleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
    mySleep(m.getMusicDuration())
  }

  function musicStop() {
    m.stopMusic()
  }

  function hasText(text) {
    return textStartsWith(text).exists() // 是否存在指定文本
  }

  // 跳过开屏广告
  if (hasText("跳过")) {
    id("tv_skip").findOnce().click()
    sleep(SHORT_WAIT)
  }

  // 通过id点击按钮
  function idClickBtn(btnId) {
    id(btnId).findOnce().click()
  }

  // 判断页面上是否存在此 id
  function idExists(existsId) {
    id(existsId).exists()
  }

  // 去购物车页
  function shoppingCartCase() {
    // 进入购物车页
    const isCartPage = !hasText("去结算") && hasText("购物车")
    if (isCartPage) {
      // 主页 -> 点击底部tabBar购物车 -> 进入购物车页
      idClickBtn("rl_car_layout")
      sleep(SHORT_WAIT)
      confirmOrderCase()
    } else if (idExists("iv_cart")) {
      // 分类-> 商品详情 -> 点击底部小购物车图标 -> 购物车页面
      idClickBtn("iv_cart")
      sleep(SHORT_WAIT)
      confirmOrderCase()
    } else if (id("iv_cart1").exists()) {
      // 吃什么-> 商品详情 -> 点击顶部小购物车图标 -> 购物车页面
      idClickBtn("iv_cart1")
      sleep(SHORT_WAIT)
      confirmOrderCase()
    } else if (hasText("立即支付")) {
      // 如果在确认订单页则走payment逻辑
      payment()
    } else if (hasText("去结算")) {
      confirmOrderCase()
    } else if (text("您选择的送达时间已经失效了，请重新选择").exists()) {
      deliveryTimeError()
    } else {
      musicPlay()
      var clear = confirm("回购物车运行脚本")
      if (clear) {
        musicStop()
      }
    }
  }

  // 确认订单页逻辑
  function payment() {
    // 弹窗提示返回购物车
    if (hasText("返回购物车")) {
      back()
      sleep(SHORT_WAIT)
      shoppingCartCase()
    } else if (hasText("立即支付")) {
      // 点击立即支付按钮
      idClickBtn("tv_submit") // 点击立即支付按钮
      sleep(SHORT_WAIT)
      payCase()
      musicPlay()
    } else {
      shoppingCartCase()
    }
  }

  function deliveryTimeError() {
    musicStop()
    // 送达时间不正确了，重新选择 / 基本遇不到
    text("选择送达时间").findOnce().click()
    // NOTE: 点击送达时间进行时间选择
    sleep(SHORT_WAIT)
    const times = id("cl_item_select_hour_root").find()
    const clickables = times.filter((item) => item.clickable) // 可点击的时间
    if (!clickables.length) {
      // 如果都是不可点击则返回上一页
      back()
      shoppingCartCase()
    } else {
      // 如果有时间选择，则选择时间
      selectTime()
    }
  }

  // 点击立即支付后遇到的 case
  function payCase() {
    if (text("您选择的送达时间已经失效了，请重新选择").exists()) {
      deliveryTimeError()
    } else if (hasText("返回购物车")) {
      musicStop()
      text("返回购物车").findOnce().click()
      sleep(SHORT_WAIT)
      shoppingCartCase()
    } else if (text("选择送达时间")) {
      musicStop()
      if (hasText("今天")) {
        const full = text("今天").findOnce().parent().children().length
        if (full !== 1) {
          // 如果有时间选择，则选择时间
          selectTime()
          sleep(1000)
          payment()
        } else {
          // 已约满就返回购物车
          id("iv_dialog_select_time_close").findOne().click()
          // back()
          back()
          sleep(SHORT_WAIT)
          shoppingCartCase()
        }
      } if (hasText("明天")) {
        if (textStartsWith("明天").findOnce().parent().children().length) {
          // 如果有时间选择，则选择时间
          selectTime()
          sleep(1000)
          payment()
        } else {
          // 已约满就返回购物车
          id("iv_dialog_select_time_close").findOne().click()
          // back()
          back()
          sleep(SHORT_WAIT)
          shoppingCartCase()
        }
      } else {
        musicStop()
        payment()
      }
    }
  }

  // 自动选择时间
  function selectTime() {
    const times = id("cl_item_select_hour_root").find()
    times.some((item) => {
      if (item.clickable) {
        item.click()
      }
      return item.clickable
    })
  }

  // 去确认订单页
  function confirmOrderCase() {
    musicStop()
    // 已勾选的按钮会带数字，所以通过按钮文本来判断购物车中的商品是否失效，如果没有勾选，则无法进入确认订单页面。
    const toSettleAccounts_btn = text("去结算").exists()
    if (toSettleAccounts_btn) {
      id("vg_car")
        .findOne()
        .children()
        .forEach((child) => {
          var target = child.findOne(id("ll_left_state"))
          target.click()
        })
      musicPlay()
      sleep(SHORT_WAIT)
      confirmOrderCase()
    } else if (hasText("去结算(")) {
      // 去确认订单页
      id("btn_submit").findOnce().click()
      sleep(SHORT_WAIT)
      payment()
    }
  }
  if (hasText("去结算")) {
    confirmOrderCase()
  } else {
    shoppingCartCase()
  }
}
autoStart()
