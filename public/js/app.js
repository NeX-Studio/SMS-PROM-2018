function member(n, ge, t, tel, c) {
    this.name = n
    this.gender = ge
    this.type = t
    this.tel = tel
    this.class = c
}
var app = new Vue({
    el: '#app',
    data: {
        stage: "home",
        signup: {
            uuid: "",
            name: "",
            gender: "",
            class: "17",
            phone: "",
            family: [],
            hasPartner: null,
            partner: {
                isICStudent: null,
                name: "",
                gender: ""
            },
            hasAvoidance: 'false',
            avoidance: "",
        },
        res: {
            name: { range: [0, 10], cn: "姓名" },
            phone: { regex: /^\d{11}$/, cn: "电话号码" },
            type: { regex: /^child$|^parent$/, cn: "身份" },
            gender: { regex: /^male$|^female$|^other$/, cn: "性别" },
            class: { regex: /^17$|^18$|^19$|^20$/, cn: "班级" },
            hasPartner: { regex: /^true|^false$/, cn: "舞伴信息" },
            isICStudent: { regex: /^true|^false$/, cn: "身份" },
            avoidance: { range: [-1, 200], cn: "过敏/忌口信息" }
        },
        genders: {
            male: "男",
            female: "女",
            other: "其他"
        },
        roles: {
            parent: "家长",
            child: "儿童"
        }
    },
    methods: {
        toSignup: function () {
            this.stage = 'signup'
        },
        addFamilyMember: function () {
            var f = this.signup.family
            if (f.length < 10) {
                f.push({ name: "", gender: "", type: "" })
            }
        },
        deleteFamilyMember: function () {
            var f = this.signup.family
            if (f.length > 0) {
                f.pop()
            }
        },
        testInput: function (info, suffix = "") {
            var keys = Object.keys(info)
            var res = this.res
            for (i in keys) {
                var k = keys[i]
                var val = info[k]
                if (k == "family") {
                    for (m in info[k])
                        if (!this.testInput(info[k][m], "家属")) return false
                }
                else if (k == "partner" && info.hasPartner == 'true') {
                    if (!this.testInput(info[k], "舞伴")) return false
                }
                else if (k in res) {
                    if ('range' in res[k]) {
                        if (val.length <= res[k].range[0]) {
                            alert(suffix + res[k].cn + "过短")
                            return false
                        }
                        if (val.length >= res[k].range[1]) {
                            alert(suffix + res[k].cn + "过长")
                            return false
                        }
                    }
                    else if ('regex' in res[k]) {
                        if (!res[k].regex.test(val)) {
                            alert('请正确填写' + suffix + res[k].cn)
                            return false
                        }
                    }
                }
            }
            return true
        },
        checkInfo: function () {
            if (this.testInput(this.signup)) {
                this.stage = 'detail'
            }
        },
        getRandomUUID: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            for (var i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        calculateFamilyFee: function () {
            var f = 0
            for (m in this.signup.family) {
                f += this.signup.family[m].type == 'parent' ? 350 : 150
            }
            return f
        },
        calculateTotalFee: function () {
            return 400 + this.calculateFamilyFee() + ((this.signup.hasPartner == 'true' && this.signup.partner.isICStudent == 'false') ? 400 : 0)
        },
        updateDataStructure: function (info) {
            var result = []
            var s = this.signup
            s.uuid = s.uuid ? s.uuid : this.getRandomUUID()
            result.push(new member(s.name, s.gender, 'student', s.phone, s.class))
            if (s.hasPartner == 'true')
                result.push(new member(s.partner.name, s.partner.gender, 'partner', '', s.partner.isICStudent == 'true' ? '0' : ''))
            for (mid in s.family) {
                var m = s.family[mid]
                result.push(new member(m.name, m.gender, m.type, '', ''))
            }
            return {
                meta: { uuid: s.uuid, group: s.name, avoidance: s.avoidance },
                participants: result
            }
        },
        submitInfo: function () {
            var payload = JSON.stringify(this.updateDataStructure(this.signup))
            console.log(payload)
            $.ajax({
                url: "/register",
                type: "POST",
                data: payload,
                contentType: "application/json",
                success: function (data) {
                    if (data.errorcode == 0) {
                        this.stage = 'submitted'
                    }
                    else {
                        alert(data.errmsg);
                    }
                }
            })
        }
    }
})