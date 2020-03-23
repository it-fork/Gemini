<template>
  <div>
    <Row>
      <Menu mode="horizontal" theme="light" active-name="wap_audit" @on-select="url_path">
        <MenuItem name="wap_audit">
          <Icon type="md-open"/>
          工单审核
        </MenuItem>
        <MenuItem name="wap_record">
          <Icon type="md-list"/>
          工单记录
        </MenuItem>
        <MenuItem name="login">
          <Icon type="md-log-out"/>
          退出
        </MenuItem>
      </Menu>
    </Row>
    <br>
    <Row>
      <router-view></router-view>
    </Row>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import axios from "axios";

    @Component({components: {}})
    export default class dash extends Vue {

        url_path(vl: string) {
            if (vl === 'login') {
                sessionStorage.clear();
                this.$router.push({
                    name: 'login'
                })
            } else {
                this.$router.push({
                    name: vl
                })
            }
        }

        created() {
            // 权限菜单过滤相关
            this.$store.commit('sidebar_filter');
            this.$store.commit('snippetTagFromJson');
            axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('jwt');
        }
    }
</script>

<style scoped>
</style>
