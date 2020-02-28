export const user_form = {
    data() {
        return {
            edit_password: false,
            savePassLoading: false,  // 保存更改密码loading按钮状态
        }
    },
    methods: {
        cancel_password() {
            this.edit_password = false
        }
    }
};


export const about_rule = {
    data() {
        return {
            is_open: false,
            group_list: [],
            group_props: [],
        }
    }
}
