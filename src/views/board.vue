<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="md-clipboard"></Icon>
          公告
        </p>
        <template v-if="auth === 'admin'">
          <mavon-editor v-model="md_data" :ishljs="true" @save="post_board" :boxShadow="false"/>
        </template>
        <template v-else>
          <mavon-editor v-model="md_data" :ishljs="true" :subfield="false" defaultOpen="preview"
                        :editable="false" :toolbarsFlag="false" :boxShadow="false"/>
        </template>
      </Card>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "board",
        data() {
            return {
                md_data: '',
                auth: sessionStorage.getItem('user')
            }
        },
        methods: {
            post_board(vl) {
                axios.post(`${this.$config.url}/group/board/post`, {
                    board: vl
                })
                    .then(res => this.$config.notice(res.data))
                    .catch(err => this.$config.err_notice(this, err))
            }
        },
        mounted() {
            axios.get(`${this.$config.url}/board`)
                .then(res => {
                    this.md_data = res.data
                })
                .catch(err => this.$config.err_notice(this, err))
        }
    }
</script>

<style scoped>

</style>
