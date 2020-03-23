<template>
  <div>
    <Row>
      <Card>
        <Row>
          <Col span="24">
            <Form inline>
              <FormItem>
                <Poptip trigger="hover" title="提示" content="此开关用于打开实时表格数据更新功能">
                  <i-switch v-model="valve" @on-change="refreshForm" size="large">
                    <span slot="open">打开</span>
                    <span slot="close">关闭</span>
                  </i-switch>
                </Poptip>
              </FormItem>
              <FormItem>
                <Input placeholder="账号名" v-model="find.user" @on-keyup.enter="queryData"></Input>
              </FormItem>
              <FormItem>
                <DatePicker format="yyyy-MM-dd HH:mm" type="datetimerange" placeholder="请选择查询的时间范围"
                            v-model="find.picker" @on-change="find.picker=$event" style="width: 250px"
                            :editable="false"></DatePicker>
              </FormItem>
              <FormItem>
                <Button type="success" @click="queryData">查询</Button>
                <Button type="primary" @click="queryCancel" class="margin-left-10">重置</Button>
              </FormItem>
            </Form>
            <Table border :columns="columns" :data="tableData" stripe>
              <template slot-scope="{ row }" slot="action">
                <div v-if="row.Status !== 5 || auth==='perform'">
                  <Button type="primary" @click="openOrder(row)" size="small" ghost
                          v-if="row.Status === 2 || auth==='perform' && row.Status === 5">审批
                  </Button>
                  <Button type="success" @click="orderDetail(row)" v-if="row.Status === 1 || row.Status === 4"
                          size="small" ghost>
                    执行结果
                  </Button>
                  <Poptip
                          confirm
                          title="确定要中止该工单吗？"
                          @on-ok="delayKill(row)"
                          transfer>
                    <Button type="error" v-if="row.Status === 3 && row.Delay !== 'none'"
                            size="small" ghost>
                      延时工单中止
                    </Button>
                  </Poptip>

                  <Button ghost size="small" class="margin-left-10" @click="timerOsc(row)"
                          v-if="row.Status === 3 && row.Type === 0" type="warning">osc进度
                  </Button>
                </div>
              </template>
              <template slot-scope="{ row }" slot="delay">
                <span v-if="row.Delay !== 'none'">{{row.Delay}}</span>
                <span v-else>无</span>
              </template>
            </Table>
            <br>
            <Page :total="page_number" show-elevator @on-change="refreshData" :page-size="20" ref="page" :current.sync="current"></Page>
          </Col>
        </Row>
      </Card>
    </Row>


    <audit_osc :is_open="is_osc" @cancel="oscClose"></audit_osc>

    <audit_detail :is_open="is_order" :sql_columns="sql_columns" @cancel="cancel_detail" @reject="rejectTo"
                  @agreed="agreedTo"
                  @perform="performTo" :multi_list="multi_list" :multi="multi"></audit_detail>
    <audit_reject @post="rejectText" @cancel="cancel_reject" :is_open="is_open"></audit_reject>
  </div>
</template>
<script lang="ts">
    import expandRow from '../../components/expandTable.vue';
    import audit_mixins from "@/mixins/audit_mixin";
    import {Component, Vue} from "vue-property-decorator";

    @Component({components: {}, mixins: [audit_mixins]})
    export default class mobile_audit extends Vue {

        sql_columns = [
            {
                type: 'expand',
                width: 50,
                render: (h: any, params: { row: object }) => {
                    return h(expandRow, {
                        props: {
                            row: params.row
                        }
                    })
                }
            },
            {
                title: '错误等级',
                key: 'Level',
                width: '100'
            },
            {
                title: '影响行数',
                key: 'AffectRows'
            }
        ];

        columns = [
            {
                title: '工单编号:',
                key: 'WorkId',
                sortable: true,
                sortType: 'desc',
                width: 100,
                tooltip: true,
            },
            {
                title: '状态',
                key: 'Status',
                width: 120,
                render: (h: any, params: { row: { Status: number } }) => {
                    const row = params.row;
                    let color = '';
                    let text = '';
                    if (row.Status === 2) {
                        color = 'primary';
                        text = '待审核'
                    } else if (row.Status === 0) {
                        color = 'error';
                        text = '驳回'
                    } else if (row.Status === 1) {
                        color = 'success';
                        text = '执行成功'
                    } else if (row.Status === 4) {
                        color = 'error';
                        text = '执行失败'
                    } else if (row.Status === 5) {
                        color = 'default';
                        text = '待执行'
                    } else {
                        color = 'warning';
                        text = '执行中'
                    }
                    return h('Tag', {
                        props: {
                            color: color,
                        }
                    }, text)
                },
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                slot: 'action'
            }
        ];

        orderDetail(row: any) {
            this.$router.push({
                name: 'wap_detail',
                query: {workid: row.WorkId, status: row.Status}
            })
        }
    }
</script>
<!-- remove delete request -->

<style lang="less" scoped>
  @import '../../styles/common.less';
  @import '../../styles/table.less';

  .demo-Circle-custom {
    & h1 {
      color: #3f414d;
      font-size: 28px;
      font-weight: normal;
    }

    & p {
      color: #657180;
      font-size: 14px;
      margin: 10px 0 15px;
    }

    & span {
      display: block;
      padding-top: 15px;
      color: #657180;
      font-size: 14px;

      &:before {
        content: '';
        display: block;
        width: 50px;
        height: 1px;
        margin: 0 auto;
        background: #e0e3e6;
        position: relative;
        top: -15px;
      }
    ;
    }

    & span i {
      font-style: normal;
      color: #3f414d;
    }
  }

  p {
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
  }
</style>
