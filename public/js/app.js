function member(n, ge, t, tel, c) {
    this.name = n
    this.gender = ge
    this.type = t
    this.tel = tel
    this.class = c
}
function performer(n, ge, tel = '', m = false, e = '') {
    this.name = n
    this.gender = ge
    this.tel = tel
    this.master = m
    this.email = e
}
var app = new Vue({
    el: '#app',
    data: {
        stage: "home",
        type: "prom",
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
        hosts: {
            name: "",
            gender: "",
            class: "17",
            tel: "",
        },
        shows: {
            showname: "",
            showtype: "",
            showtime: 0,
            note: "",
            name: "",
            gender: "",
            tel: "",
            email: "",
            performers: []
        },
        res: {
            name: { range: [0, 10], cn: "姓名" },
            phone: { regex: /^\d{11}$/, cn: "电话号码" },
            tel: { regex: /^\d{11}$/, cn: "电话号码" },
            type: { regex: /^child$|^parent$/, cn: "身份" },
            gender: { regex: /^male$|^female$|^other$/, cn: "性别" },
            class: { regex: /^17$|^18$|^19$|^20$/, cn: "班级" },
            hasPartner: { regex: /^true|^false$/, cn: "舞伴信息" },
            isICStudent: { regex: /^true|^false$/, cn: "身份" },
            avoidance: { range: [-1, 200], cn: "过敏/忌口信息" },
            showname: { range: [0, 30], cn: "节目名称" },
            showtype: { range: [0, 10], cn: "节目类型" },
            showtime: { regex: /^[0-9]*$/, cn: "节目时长" },
            email: { regex:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, cn: "电子邮箱" }
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
        toMenu: function () {
            this.stage = 'menu'
        },
        chooseSignup: function () {
            switch (this.type) {
                case 'prom':
                    this.toSignup()
                    break
                case 'hosts':
                    this.toHosts()
                    break
                case 'shows':
                    this.toShows()
                    break
            }
        },
        toSignup: function () {
            this.stage = 'signup'
        },
        toHosts: function () {
            this.stage = 'hosts'
        },
        toShows: function () {
            this.stage = 'shows'
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
        addPerformer: function () {
            var f = this.shows.performers
            if (f.length < 10) {
                f.push({ name: "", gender: "" })
            }
        },
        deletePerformer: function () {
            var f = this.shows.performers
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
                else if (k == "performers") {
                    for (m in info[k])
                        if (!this.testInput(info[k][m], "表演者")) return false
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
                meta: { uuid: s.uuid, group: s.name, type: 'participants', avoidance: s.avoidance },
                participants: result
            }
        },
        submitInfo: function () {
            var payload = JSON.stringify(this.updateDataStructure(this.signup))
            console.log(payload)
            $.ajax({
                url: "/register/participants",
                type: "POST",
                data: payload,
                contentType: "application/json",
                success: function (data) {
                    if (data.errorcode == 0) {
                        this.stage = 'submitted'
                    }
                    else {
                        alert('发生错误：' + data.errmsg);
                    }
                }
            })
        },
        submitHostInfo: function () {
            if (this.testInput(this.hosts)) {
                if (confirm('信息提交后将无法修改，是否继续？')) {
                    var h = this.hosts
                    var info = {
                        meta: { uuid: this.getRandomUUID(), group: h.name + '(主持人)', type: 'hosts' },
                        participants: [ h ]
                    }
                    var payload = JSON.stringify(info)
                    console.log(payload)
                    $.ajax({
                        url: "/register/hosts",
                        type: "POST",
                        data: payload,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.errorcode == 0) {
                                this.stage = 'hostsubmitted'
                            }
                            else {
                                alert('发生错误：' + data.errmsg);
                            }
                        }
                    })
                }
            }
        },
        submitShowInfo: function () {
            if (this.testInput(this.shows)) {
                if (confirm('信息提交后将无法修改，是否继续？')) {
                    var s = this.shows
                    var performers = []
                    performers.push(new performer(s.name, s.gender, s.tel, true, s.email))
                    for (pid in s.performers) {
                        var p = s.performers[pid]
                        performers.push(new performer(p.name, p.gender))
                    }
                    var info = {
                        meta: { uuid: this.getRandomUUID(), group: s.showname, type: 'shows', showname: s.showname, showtype: s.showtype, showtime: s.showtime, note: s.note },
                        participants: performers
                    }
                    var payload = JSON.stringify(info)
                    console.log(payload)
                    $.ajax({
                        url: "/register/shows",
                        type: "POST",
                        data: payload,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.errorcode == 0) {
                                this.stage = 'showsubmitted'
                            }
                            else {
                                alert('发生错误：' + data.errmsg);
                            }
                        }
                    })
                }
            }
        }
    }
})