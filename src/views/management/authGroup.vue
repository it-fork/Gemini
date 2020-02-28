<template>
  <div>
    <Row>
      <Card>
        <p slot="title">
          <Icon type="ios-crop"/>
          用户权限
        </p>
        <div>
          <Input v-model="query.username" placeholder="请填写用户名" style="width: 15%" clearable
                 class="margin-left-10"></Input>
          <Button @click="queryData" type="success" class="margin-left-10">查询</Button>
          <Button @click="queryCancel" type="warning" class="margin-left-10">重置</Button>
          <br>
          <br>
          <Table border :columns="columns" :data="data6" stripe height="550">
            <template slot-scope="{ row }" slot="action">
              <Button type="info" size="small" @click="edit_rule(row)" style="margin-right: 5px">
                查看与编辑
              </Button>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="page_number" show-elevator @on-change="fetch_info" :page-size="10" ref="total"></Page>
      </Card>
    </Row>

    <edit_rule is_admin :is_open="is_open" :username="rule_form.username" :group_list="group_list"
               :group_props="rule_form.group" @cancel="cancel" @success="post_ok"></edit_rule>
  </div>
</template>

<script>
    import axios from 'axios'
    import edit_rule from "../../components/edit_rule";
    import {about_rule} from "../../libs/user_classMixin";

    export default {
        name: 'auth-group',
        mixins: [about_rule],
        components: {edit_rule},
        data() {
            return {
                query: {
                    username: '',
                    valve: false
                },
                page_number: 1,
                data6: [],
                columns: [
                    {
                        title: 'ID',
                        key: 'ID',
                        width: 85,
                        sortable: true
                    },
                    {
                        title: '用户名',
                        key: 'Username',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        slot: 'action'
                    }
                ],
                rule_form: {
                    username: '',
                    group: []
                }
            }
        },
        methods: {
            edit_rule(vl) {
                this.rule_form = {
                    username: vl.Username,
                    group: vl.Group
                };
                this.is_open = true;
            },
            fetch_info(vl = 1) {
                this.page_num = vl;
                axios.get(`${this.$config.url}/group?page=${vl}&con=${JSON.stringify(this.query)}`)
                    .then(res => {
                        this.data6 = res.data.data;
                        this.group_list = res.data.group_list;
                        this.page_number = parseInt(res.data.page);
                    })
                    .catch(error => {
                        this.$config.err_notice(this, error)
                    })
            },
            queryData() {
                this.query.valve = true;
                this.fetch_info()
            },
            queryCancel() {
                this.$config.clearObj(this.query);
                this.fetch_info()
            },
            cancel() {
                this.is_open = false;
                this.rule_form.group = []
            },
            post_ok() {
                this.fetch_info(this.page_num)
            }
        },
        mounted() {
            this.fetch_info()
        }
    }
</script>

<style scoped lang="less">
  @import '../../styles/common.less';
</style>
