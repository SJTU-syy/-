<template>
    <div class="flex h-full">
        <div class="w-50" style="background-color: #0f1222;">
            <f-menu mode="vertical" :defaultExpandAll="true" :inverted="true" @select="goto">
                <f-sub-menu value="1">
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                    <template #label>基础功能展示</template>
                    <template v-for="(bP, pkey) in pluginsConfig">
                        <f-menu-item v-if="pkey === 'basic'" v-for="(onePlugin, okey) in bP.child"
                            :value="onePlugin.name">
                            <template #label>{{ onePlugin.title }}</template>
                        </f-menu-item>
                    </template>
                </f-sub-menu>
                <f-sub-menu value="2">
                    <template #icon>
                        <PictureOutlined />
                    </template>
                    <template #label>进阶效果</template>
                    <template v-for="(onePlugin, pkey) in  pluginsConfig ">
                        <f-menu-item v-if="pkey !== 'basic'" :value="pkey">
                            <template #label>
                                <EditOutlined style="position: absolute;left: 13px;top: 20px;"
                                    v-if="isNew(onePlugin.updateTime)" :size="12" :rotate="135" color="#ffffff" />{{
                onePlugin.title }}
                            </template>
                        </f-menu-item>
                    </template>
                </f-sub-menu>
            </f-menu>
        </div>
        <div class="flex-1 overflow-scroll" style="height: calc(100vh - 54px);">
            <template v-for="( onePlugin, pkey ) in  pluginsConfig " :key="pkey">
                <template v-if="pkey === 'basic'">
                    <div style="background-color: #f1f1f2;" v-for="( one, opkey ) in  onePlugin.child " :key="opkey"
                        :ref="el => tabListRef[one.name] = el">
                        <cardList :onePlugin="one" />
                    </div>
                </template>
            </template>
            <template v-for="( onePlugin, pkey ) in  pluginsConfig " :key="pkey">
                <div style="background-color: #f1f1f2;" v-if="pkey !== 'basic'" :ref="el => tabListRef[pkey] = el">
                    <cardList :onePlugin="onePlugin" />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineRouteMeta } from '@fesjs/fes';
import { AppstoreOutlined, PictureOutlined, EditOutlined } from '@fesjs/fes-design/icon';
import { getPluginsConfig } from '../common/utils';
import cardList from '../components/forPreview/cardList.vue'

defineRouteMeta({
    name: 'preview',
    title: '开源框架展示',
});

const tabListRef = ref([])
let pluginsConfig = getPluginsConfig()
const goto = (value: string) => {
    tabListRef.value[value.value]?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: "nearest" })
}


//是不是新插件
const isNew = ((time: string) => {
    if (time) {
        const targetDate = new Date(time)
        const currentDate = new Date()
        const targetTimestamp = targetDate.getTime()
        const currentTimestamp = currentDate.getTime()
        const timeDifference = currentTimestamp - targetTimestamp
        const millisecondsPerDay = 1000 * 60 * 60 * 24 // 每天的毫秒数
        const daysDifference = Math.floor(timeDifference / millisecondsPerDay)
        if (daysDifference < 7) { //小于七天 算新插件
            return true
        }
    }
    return false
})
</script>

<style lang="less">
.layout-logo {
    /* margin-right: 6.2em !important; */
    width: 12.5rem !important;
    padding: 0 !important;
    justify-content: center !important;
    margin: 0 !important;
}

.fes-menu.is-vertical.is-inverted .fes-menu-item,
.fes-menu.is-horizontal.is-inverted .fes-menu-item {
    font-size: 0.93em;
    font-weight: 100;
}

.fes-menu.is-vertical.is-inverted {
    overflow: hidden;
    height: calc(100vh - 54px);
    overflow: scroll;
}

.fes-menu.is-vertical.is-inverted::-webkit-scrollbar {
    display: none;
}
</style>
