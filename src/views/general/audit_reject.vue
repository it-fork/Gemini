<template>
  <Modal v-model="open" @on-ok="reject_post" @on-cancel="cancel">
    <p slot="header" style="color:#f60;font-size: 16px">
      <Icon type="information-circled"></Icon>
      <span>SQL工单驳回理由说明</span>
    </p>
    <Input v-model="reject" type="textarea" :autosize="{minRows: 15,maxRows: 15}"
           placeholder="请填写驳回说明"></Input>
  </Modal>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component({components: {}})
    export default class audit_reject extends Vue {
        reject = '';
        $config: any;
        @Prop({
            type: Boolean,
            required: true,
            default: false
        }) public is_open !: boolean;
        get open () {
            return this.is_open
        }
        set open (vl) {}

        reject_post() {
            this.$emit("post", this.reject)
        }

        cancel() {
            this.$emit("cancel")
        }
    }
</script>

<style scoped>

</style>
