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
              <Button type="info" size="small" @click="editAuthGroup(row)" style="margin-right: 5px">
                查看与编辑
              </Button>
            </template>
          </Table>
        </div>
        <br>
        <Page :total="pagenumber" show-elevator @on-change="fetch_info" :page-size="10" ref="total"></Page>
      </Card>
    </Row>
    <Modal v-model="addAuthGroupModal" :width="800">
      <h3 slot="header" style="color:#2D8CF0">用户权限</h3>
      <Form :model="addAuthGroupForm" :label-width="120" label-position="top">
        <FormItem label="用户名">
          <Input v-model="addAuthGroupForm.username" readonly></Input>
        </FormItem>
        <FormItem label="权限组">
          <Select v-model="addAuthGroupForm.group" @on-change="marge_group" clearable multiple>
            <Option v-for=" i in group_list" :key="i.Name" :value="i.Name" :label="i.Name"></Option>
          </Select>
        </FormItem>
        <template>
          <FormItem label="DDL及索引权限:">
            <Tag v-if="permission.ddl==='1'" color="success">是</Tag>
            <Tag v-else color="volcano">否</Tag>
          </FormItem>
          <template v-if="permission.ddl === '1'">
            <FormItem label="数据源:">
              <Tag color="purple" v-for="i in permission.ddl_source" :key="i"> {{i}}</Tag>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="DML权限:">
            <Tag v-if="permission.dml==='1'" color="success">是</Tag>
            <Tag v-else color="volcano">否</Tag>
          </FormItem>
          <template v-if="permission.dml === '1'">
            <FormItem label="数据源:">
              <Tag color="geekblue" v-for="i in permission.dml_source" :key="i"> {{i}}</Tag>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="数据查询权限:">
            <Tag v-if="permission.query==='1'" color="success">是</Tag>
            <Tag v-else color="volcano">否</Tag>
          </FormItem>
          <template v-if="permission.query === '1'">
            <FormItem label="数据源:">
              <Tag color="blue" v-for="i in permission.query_source" :key="i"> {{i}}</Tag>
            </FormItem>
          </template>
          <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
          <br>
          <FormItem label="选择上级审核人:">
            <Tag color="cyan" v-for="i in permission.auditor" :key="i"> {{i}}</Tag>
          </FormItem>
        </template>
        <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
        <br>
        <FormItem label="用户管理权限:">
          <Tag v-if="permission.user==='1'" color="success">是</Tag>
          <Tag v-else color="volcano">否</Tag>
        </FormItem>
        <hr style="height:1px;border:none;border-top:1px dashed #dddee1;"/>
        <br>
        <FormItem label="数据库管理权限:">
          <Tag v-if="permission.base==='1'" color="success">是</Tag>
          <Tag v-else color="volcano">否</Tag>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addAuthGroupModal = false">取消</Button>
        <Button type="primary" @click="saveAddGroup">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
    import axios from 'axios'

    const structure = {
        ddl: '0',
        ddlsource: [],
        dml: '0',
        dmlsource: [],
        query: '0',
        querysource: [],
        user: '0',
        base: '0',
        auditor: []
    };
    export default {
        name: 'auth-group',
        data() {
            return {
                query: {
                    username: '',
                    valve: false
                },
                pagenumber: 1,
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
                permission: structure,
                addAuthGroupForm: {
                    username: '',
                    group: ''
                },
                addAuthGroupModal: false,
                group_list: []
            }
        },
        methods: {
            editAuthGroup(vl) {
                [this.isReadOnly, this.addAuthGroupModal] = [true, true];
                this.id = vl.ID;
                this.addAuthGroupForm = {
                    username: vl.Username,
                    group: vl.Group
                };
                this.marge_group(vl.Group)
            },
            marge_group(group) {
                let g = [];
                if (group !== null) {
                    g = group
                }
                axios.post(`${this.$config.url}/group/fetch/marge`, {
                    "user": this.addAuthGroupForm.username,
                    "group": g,
                })
                    .then(res => {
                        this.permission = res.data;
                    })
                    .catch(err => this.$config.err_notice(this, err))
            },
            saveAddGroup() {
                this.addAuthGroupModal = false;
                axios.post(`${this.$config.url}/group/update`, {
                    'username': this.addAuthGroupForm.username,
                    'permission': this.permission,
                    'group': this.addAuthGroupForm.group,
                })
                    .then(res => {
                        this.$config.notice(res.data);
                        this.$refs.total.currentPage = 1;
                        this.fetch_info()
                    })
                    .catch(error => {
                        this.$config.err_notice(this, error)
                    })
            },
            fetch_info(vl = 1) {
                axios.get(`${this.$config.url}/group?page=${vl}&con=${JSON.stringify(this.query)}`)
                    .then(res => {
                        this.data6 = res.data.data;
                        this.group_list = res.data.data2;
                        this.pagenumber = parseInt(res.data.page);
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
