import { React, useEffect } from 'react'
import Routers from '@/router/index'
import { routerItems } from '@/router/config';
import { useStore } from '@/store'
import { getUrlParam, removeTokenToLogin, getLoginUrl } from '@/utils'
import { App as AntApp, ConfigProvider } from 'antd';
import en_US from 'antd/locale/en_US';
import zh_CN from 'antd/locale/zh_CN';
import LoginService from '@/services/user/loginService'
import { IntlProvider } from 'react-intl'
import enUS from '@/i18n/en-US'
import zhCN from '@/i18n/zh-CN'
import '@/fonts/font.css'
//为自定义ant组件d颜色引入
// import 'antd/dist/antd.less';

import styles from './App.module.scss'

//导入头、尾、导航栏
import Header from '@/layout/header'
// import Footer from '@/layout/footer';
import Sider from '@/layout/sider';

//antd平台国际化
const localeConfig = {
  'zh_CN': zh_CN,
  'en_US': en_US
};
//配置本地语言
const langMap = {
  'zh_CN': zhCN,
  'en_US': enUS
};

function App(props) {
  const { appStore, userStore } = useStore()
  useEffect(() => {
    LoginService.getUserInfo().then(res => {
      userStore.changeUserinfo(res.data.data)
      // LoginService.getAuthList({
      //   emp: res.data.data.employeeNo
      // }).then((res) =>
      //   userStore.changeAuthList(res.data.data.permissionMenuList)
      // ).catch(e => {
      //   userStore.changeAuthList([])
      // })
    })
    //登陆
    const urlde = decodeURIComponent(window.location.href);
    const tokenurl = getUrlParam(urlde, 'token');
    const rtokenurl = getUrlParam(urlde, 'rtoken');
    if (!window.__POWERED_BY_QIANKUN__) {
      if (localStorage.getItem('micro-app-template-token')) {
        //判断是否过期
      }
      else if (tokenurl != '') {
        localStorage.setItem('micro-app-template-token', tokenurl)
        localStorage.setItem('micro-app-template-rtoken', rtokenurl)
      } else {
        window.location.href = getLoginUrl();
      }
    }

    appStore.changeActivityUrl(props.activityUrl ? props.activityUrl : '')
    if (localStorage.getItem('lang')) {
      appStore.changeLang(localStorage.getItem('lang'))
    } else {
      appStore.changeLang('zh_CN')
      localStorage.setItem('lang', 'zh_CN')
    }
    if (tokenurl != '') {
      window.location.href = removeTokenToLogin(decodeURIComponent(window.location.href))
    }
    return (() => {
      appStore.changeActivityUrl('')
    })
  }, [appStore])


  return (
    <ConfigProvider
      locale={localStorage.getItem('lang') ? localeConfig[localStorage.getItem('lang')] : localeConfig['zh_CN']}
      theme={{
        token: {
          colorPrimary: '#1990FF', // 全局主色
          colorLink: '#1990FF',// 链接色
          colorSuccess: '#34C759',// 成功色
          colorWarning: '#FFCC00',// 警告色
          colorError: '#FF375F'// 错误色
        }
      }}>
      <IntlProvider
        locale={navigator.language}
        messages={localStorage.getItem('lang') ? langMap[localStorage.getItem('lang')] : langMap['zh_CN']}
      >
        <AntApp
        >
          {
            (!window.__POWERED_BY_QIANKUN__) &&
            <div className={styles['headerDiv']}>
              <Header />
            </div>
          }
          <div className={styles['contentDiv']}>
            {/* <Sider siderItems={[...routerItems, ...routerDailyItems]} */}

            {/* <div className={styles['siderDiv']}>
            <Sider {...props} />
          </div> */}
            <div className={styles['routeDiv']}>
              <Routers routerItems={[...routerItems]} />
            </div>
          </div>
          {/* <div className={styles['footerDiv']}>
          <Footer />
        </div> */}
        </AntApp>
      </IntlProvider>
    </ConfigProvider>
  )
}

export default App
