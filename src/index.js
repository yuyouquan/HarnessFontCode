import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.scss';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
// import { useStore } from '@/store'
import actions from './micro-action'

import reportWebVitals from './reportWebVitals';

let root
function render(props) {
    if (props) {
        // 注入 actions 实例
        actions.setActions(props);
    }
    const { container } = props;
    // console.log(props, 'render')
    root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.querySelector('#root'));
    root.render(
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
            <App {...props} />
        </BrowserRouter>
    );
}

if (!window.__POWERED_BY_QIANKUN__) {
    root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
            <App />
        </BrowserRouter>
    );
}

export async function bootstrap() {
    // console.log('[react16] react app bootstraped');
}

export async function mount(props) {
    props.onGlobalStateChange(
        (state, prevState) => {
            // state: 变更后的状态; prevState: 变更前的状态
            // console.log(prevState, 'prevState')
            localStorage.setItem('micro-app-template-token', state.token)
            localStorage.setItem('micro-app-template-rtoken', state.rtoken)
        }, true
    );
    // console.log(props, 'mount')
    render(props);
}

export async function unmount(props) {
    // ReactDOM.unmountComponentAtNode(
    //     props.container ? props.container.querySelector('#root') : document.getElementById('root')
    // );
    // console.log('unmount', 'props');
    // const { container } = props;
    // const root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.querySelector('#root'));
    root.unmount();
}
/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
    // console.log('update props', props);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
