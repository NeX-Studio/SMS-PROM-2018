var info = {
    "name": "学生名",
    "gender": "male",
    "class": "18",
    "phone": "12345678901",
    "family": [ //数组长度为0-10
        {
        "name": "家属1",
        "gender": "female",
        "type": "parent"
        },
        {
        "name": "家属2",
        "gender": "other",
        "type": "child"
        }
    ],
    "hasPartner": "true",
    "partner": { //如果没有则partner为null
        "isICStudent": "true",
        "name": "舞伴名",
        "gender": "female"
    },
    "hasAvoidance": "false",
    "avoidance": ""
}
// 报名是post以上数据架构到api，应返回一个6位随机大写字母+数字的代码凭证
// 凭此凭证可以从api取回（get）同样结构的数据并修改（update）