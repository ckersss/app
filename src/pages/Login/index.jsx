import React, { useState, useEffect } from "react";
import { NavBar, InputItem, Button, Toast } from "antd-mobile";
//引入正则校验
import { phoneReg, codeReg } from "../../config/reg";
import { codeTime } from "../../config/contants";
import "./index.less";
import axios from "axios";

export default function Login() {
  const [phone, getPhone] = useState("");
  const [code, getCode] = useState("");
  const [time, setTime] = useState(codeTime);
  const [canClick, clickFlag] = useState(true);
  //登录按钮的回调
  function login() {
    //优化错误登录信息
    let phoneError = false;
    let codeError = false;
    if (!phone) phoneError = true;
    if (!code) codeError = true;
    let errMsg = "";
    errMsg += phoneError ? " 手机号" : "";
    errMsg += codeError ? " 验证码" : "";
    if (errMsg) return Toast.fail("请输入合法的" + errMsg);
    // if (!phone) {
    //   Toast.fail('请输入合法的手机号！', 2)
    //   return
    // }
    // else if (!code) {
    //   Toast.fail('请输入合法的验证码！', 2)
    //   return
    // }
    console.log(`发起登录请求，手机号为${phone}，验证码为${code}`);
  }
  //保存用户输入的数据
  function savePhone(value) {
    //正则校验通过保存手机号
    if (!phoneReg.test(value)) value = "";
    getPhone(value);
  }
  function saveCode(value) {
    if (codeReg.test(value)) {
      getCode(value);
    } else getCode("");
  }
  //获取验证码，触发倒计时
  function getReCode() {
    if (!canClick) return;
    else if (!phone) return Toast.fail("请输入合法的手机号！", 2);
    clickFlag(false);
    setTime(10);
    axios.post("http://localhost:5000/login/digits", { phone }).then(
      (response) => {
        const { code, message } = response.data;
        if (code === 20000) Toast.success(message, 2);
        else if (code !== 20000) Toast.fail(message, 2);
      },
      //如果发送失败(网络异常)
      (error) => {
        Toast.fail("糟糕，网络异常，请稍后再试", 2);
        clickFlag(true);
      }
    );
  }

  //发送验证码后开启定时器
  useEffect(() => {
    if (canClick) return;
    const timeId = setInterval(() => {
      //更新状态中的时间
      setTime((time) => time - 1);
      console.log(time);
      //如果时间小于0，清除定时器，让按钮再次可以点击
    }, 1000);
    if (time <= 0) {
      //清除定时器
      //让按钮可以再次点击
      // setTime(codeTime)
      clearInterval(timeId);
      clickFlag(true);
    }
    return () => clearInterval(timeId);
  }, [time, canClick]);
  return (
    <div>
      {/* 顶部导航区 */}
      {/* <NavBar
      mode="light" //颜色模式
      icon={<Icon type="left" />} //导航图标
      onLeftClick={() => console.log('onLeftClick')}
      rightContent={[
        <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
        <Icon key="1" type="ellipsis" />,
      ]}
    >NavBar</NavBar> */}
      <NavBar mode="light">手机验证码登录</NavBar>
      {/* 内容区 */}
      <div className="login-wraper">
        {/* 手机号输入区 */}
        <InputItem
          onChange={savePhone}
          clear
          placeholder="请输入手机号"
        ></InputItem>
        {/* 验证码输入区 */}
        <div className="code-group">
          <InputItem
            onChange={saveCode}
            clear
            placeholder="6位验证码"
          ></InputItem>
          <button
            className={
              canClick ? "get-code-btn active" : "get-code-btn disable"
            }
            onTouchEnd={getReCode}
            // disabled={canClick?false:true}
          >
            获取验证码{canClick ? "" : `(${time})`}
          </button>
        </div>
        <Button type="primary" onTouchEnd={login}>
          登录
        </Button>
        {/* 底部说明区域 */}
        <div className="footer">
          未注册的手机号，验证后会自动创建硅谷账号，登录即代表您同意
          <a href="http://www.baidu.com">《隐私协议》</a>
        </div>
      </div>
    </div>
  );
}
