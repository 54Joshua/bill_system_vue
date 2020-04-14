const utils = {
    resetObj: function (obj) {
        Object.keys(obj).forEach(key => {
            obj[key] = null
        })
    },
    copyObj: function (obj) {
        let newObj = JSON.parse(JSON.stringify(obj));
        return newObj

    },
    checkNumber: (rule, value, callback) => {
        if (!value && value !== 0) {
            return callback(new Error('不能为空'));
        } else {
            if (Number(value) || value === "0" || value === 0) {
                return callback()
            } else {
                return callback(new Error('请输入数字值'));
            }
        }
    },
    showMsg: function (ele, msg, type = 'success') {
        ele.$message({
            showClose: true,
            message: msg,
            type: type
        });
    }

}

export default utils