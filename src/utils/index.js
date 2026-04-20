import profilePhoto from '@/assets/img/profilePhoto.jpeg';
import { Typography } from 'antd';
import React from 'react';
//获取url参数
/**
 *@param url,name
 **/
export function getUrlParam(url, name) {
  try {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = url.split('?')[1].match(reg);
    if (r != null) {
      return r[2];
    }
    return '';
  } catch (e) {
    return '';
  }
}

export function removeTokenToLogin(path) {
  let url = path;
  const indextoken1 = url.indexOf('?token');
  const indextoken2 = url.indexOf('&token');
  if (indextoken1 != -1) {
    url = url.substring(0, indextoken1);
  }
  if (indextoken2 != -1) {
    url = url.substring(0, indextoken2);
  }
  return url;
}

/**
 * 下载 blob 流数据
 * @param {*} data 流数据
 * @param {*} fileName
 * @param {*} type
 */

/* eslint-disable */
export function downloadBlob(res) {
  const contentDisposition = res.headers['content-disposition']
  const type = res.headers['content-type']
  let fileName
  console.log(contentDisposition, 'contentDisposition');
  if (contentDisposition.indexOf("filename*=utf-8''") !== -1) {
    fileName = decodeURIComponent(
      contentDisposition.split("filename*=utf-8''")[1]
    )
  } else {
    fileName = decodeURIComponent(contentDisposition.split('filename=')[1])
  }
  const blob = new Blob([res.data], { type: type })
  const a = document.createElement('a')
  const URL = window.URL || window.webkitURL
  const herf = URL.createObjectURL(blob)
  a.href = herf
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(herf)
}
/* eslint-enable */
/**
 * 获取用户头像
 * @param {*} jobNumber 员工工号
 */

export function generateUserAvatar(jobNumber) {
  if (!jobNumber) return profilePhoto
  const a1 = jobNumber.slice(0, 4)
  const a2 = jobNumber.slice(4, 8)
  return `https://pfresource.transsion.com:19997/${a1}/${a2}/H_${jobNumber}_D.png`
}
/* eslint-enable */
/**
 * 判断是否是mac系统
 */

export function whitchSystem() {
  const agent = navigator.userAgent.toLowerCase()
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    return 'win32'
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    return 'win64'
  }
  if (isMac) {
    return 'mac'
  }
}
export const renderWord = (word, width = 80, rows = 1, text) => {
  return (
    <Typography.Paragraph
      ellipsis={{
        rows,
        tooltip: <div style={{ wordBreak: 'break-all' }}>{text || word}</div>
      }}
      style={{ wordBreak: 'break-all', marginBottom: 0, width }}>
      {word}
    </Typography.Paragraph>
  )
}

export function getLoginUrl() {
  return `${process.env.REACT_APP_LOGIN_PATH}//#/c-login?lang=zh&appId=${process.env.REACT_APP_APP_ID}&type=simple&redirect=${encodeURIComponent(removeTokenToLogin(decodeURIComponent(window.location.href)))}`
}

export const pageParams = {
  showTotal: total => `共${total}条`
}
export const tagOptions = [
  {
    label: 'test_team',
    value: 'test_team'
  },
  {
    label: 'develop_team',
    value: 'develop_team'
  },
  {
    label: 'personal',
    value: 'personal'
  },
  {
    label: 'other',
    value: 'other'
  }
];
