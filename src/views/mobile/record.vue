<template>
  <div>
    <Row>
      <Card>
        <Form inline ref="queryForm">
          <FormItem>
            <Input placeholder="工单编号" v-model="find.text" @on-keyup.enter="queryData"></Input>
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
        <Row>
          <Col span="24">
            <Table
                    border
                    :columns="tab_columns"
                    :data="dataInfo"
                    class="tabletop"
                    style="background: #5cadff"
            >
              <template slot-scope="{ row }" slot="action">
                <div>
                  <Button type="success" @click="openOrder(row)" size="small" ghost>
                    详细信息
                  </Button>
                </div>
              </template>
            </Table>
            <br>
            <Page
                    :total="this.page_number"
                    show-elevator
                    @on-change="currentPage"
                    :page-size="20"
                    :current.sync="current"
            ></Page>
          </Col>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import record_mixins from "@/mixins/record_mixin";

    @Component({components: {}, mixins: [record_mixins]})
    export default class record extends Vue {
        tab_columns = [
            {
                title: '工单',
                key: 'WorkId',
                tooltip: true,
                fixed: 'left',
                width: 100
            },
            {
                title: '工单说明',
                key: 'Text',
                tooltip: true,
                width: 150
            },
            {
                title: '执行时间',
                key: 'ExecuteTime',
                sortType: 'desc',
                tooltip: true,
                width: 100
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                slot: 'action',
                width: 150
            }
        ];
    }
</script>

<style scoped>
  @import '../../styles/common.less';
  @import '../../styles/table.less';
</style>
