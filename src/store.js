import Vue from 'vue'
import Vuex from 'vuex'
import {appRouter} from './router'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        hideMenuText: false,
        stmt: false,
        password: '',
        openReLogin: false,
        // 新的属性
        menuList: [],
        currentPageName: 'home_index',
        currentPath: [{
            title: '首页',
            path: '/',
            name: 'home_index'
        }],
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        snippet: [],
        group_props: []
    },
    mutations: {
        group_edit(state, vl) {
            state.group_props = vl
        },
        closeNav(state) {
            return state.hideMenuText = !state.hideMenuText
        },
        snippetTag(state, vm) {
            state.snippet.push({'title': vm.title, 'text': vm.text})
        },
        snippetTagToJson(state) {
            localStorage.setItem('snippet', JSON.stringify(state.snippet))
        },
        snippetTagFromJson(state) {
            state.snippet = JSON.parse(localStorage.getItem('snippet'))
        },
        snippetRemoveTag(state, vm) {
            const index = state.snippet.indexOf(vm);
            state.snippet.splice(index, 1)
        },
        sidebar_filter(state) {
            let accessCode = parseInt(sessionStorage.getItem('access')); // 0
            let menuList = [];
            appRouter.forEach((item) => {
                if (item.access === accessCode || item.access === 3) {
                    let i = menuList.push(item);
                    menuList[i - 1].children = item.children
                }
            });
            state.menuList = menuList
        },
        lock() {
            sessionStorage.setItem('locking', '1')
        },
        unlock() {
            sessionStorage.setItem('locking', '0')
        },
        breadcrumb_set(state, name) {
            state.currentPath = [];
            appRouter.forEach((val) => {
                for (let i of val.children) {
                    if (i.name === name) {
                        if (val.name !== 'main') {
                            state.currentPath.push({
                                'title': val.title,
                                'path': val.path,
                                'name': val.name
                            }, {
                                'title': i.title,
                                'path': `${val.path}/${i.path}`,
                                'name': i.name
                            })
                        } else {
                            state.currentPath.push({
                                'title': i.title,
                                'path': i.path,
                                'name': i.name
                            })
                        }
                    }
                }
            })
        }
    }
});

export default store
