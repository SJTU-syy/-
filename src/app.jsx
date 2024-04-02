/*
 * @Description: 
 * @Version: 1.668
 * @Autor: 地虎降天龙
 * @Date: 2023-10-16 10:53:09
 * @LastEditors: 地虎降天龙
 * @LastEditTime: 2023-11-16 15:28:31
 */
import { defineRuntimeConfig, useModel } from '@fesjs/fes'
import { FMenu } from '@fesjs/fes-design';
import PageLoading from '@/components/pageLoading.vue';
import UserCenter from '@/components/userCenter.vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'uno.css';


//是否开启登录功能
export default defineRuntimeConfig({
    beforeRender: {
        loading: <PageLoading />,
        action () {
            const { signin } = useModel('user');
            signin();
            // const { setRole } = access;
            // return new Promise((resolve) => {
            //     setTimeout(() => {
            //         setRole('admin');
            //         // 初始化应用的全局状态，可以通过 useModel('@@initialState') 获取，具体用法看@/components/UserCenter 文件
            //         resolve({
            //             userName: '李雷',
            //         });
            //     }, 1000);
            // });
        },
    },
    layout: {
        renderCustom: () => <UserCenter />,
    },
});

//把app需要声明用的组件挂载到这里
export function onAppCreated ({ app }) {
    app.use(FMenu);
    app.use(ElementPlus);
}



//以下都是路由跳转设置
const findStringBetween = (str) => {
    const regex = /plugins\/([^/]+)\/pages\//;
    const match = str.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

export function patchRoutes ({ routes }) {
    if (process.env.FES_APP_PLUGINS === 'false') {
        console.log('项目开发模式: 配置 不自动增加插件plugins里面各个pages的页面路由')
        return
    }

    // 自动读取plugins目录下所有插件的pages的目录下的*.vue 并加入路由
    const viteModules = import.meta.glob('./plugins/**/pages/**/*.vue')
    const needAddRouter = {
        path: '/plugins',
        component: () => import("./components/forPreview/suspenseLayout.vue"),
        children: []
    }
    // eslint-disable-next-line guard-for-in
    for (const [key, value] of Object.entries(viteModules)) {
        const pluginName = findStringBetween(key)
        const urlList = key.match(/\.\/(.+)\.vue$/)[1].split('/')
        if (urlList.length === 4) {  //插件一级目录 普通插件
            needAddRouter.children.unshift({
                path: `/plugins/${pluginName}/${urlList[3]}`,
                component: value
            })
        }
        else if (urlList.length === 5) { //插件二级目录 目前只存在已 basic 基础功能展示
            needAddRouter.children.unshift({
                path: `/plugins/${pluginName}/${urlList[3]}/${urlList[4]}`,
                component: value
            })
        } else {  // 若目录异常 那么直接跳过
            return
        }
    }
    routes.unshift(needAddRouter)
}

export function modifyRoute (memo) {
    if (process.env.FES_APP_PREINDEX === 'true') {
        console.log('预览模式下 直接替换index的路由为 plugins/preview.vue')
        let indexRoute = memo.routes.find(route => route.path === '/')
        if (indexRoute) {
            indexRoute = indexRoute.children.find(route => route.path === '/')
            if (indexRoute) {
                indexRoute.component = () => import("./plugins/preview.vue")
                indexRoute.meta = {
                    name: 'preview',
                    title: '开源框架展示',
                }
            }
        }
    }
    if (process.env.FES_APP_PLUGINS === 'false') {
        console.log('项目开发模式: 默认路由 去除layout')
        const indexRoute = memo.routes.find(route => route.path === '/')
        if (indexRoute) {
            indexRoute.component = null
        }
    }
    return {
        ...memo,
        routes: [
            ...memo.routes
        ]
    }
}