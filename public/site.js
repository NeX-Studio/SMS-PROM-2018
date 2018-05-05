//Form Submission Entries
$.fn.api.settings.api = {
  'submit hosts registration' : '/register/hosts',
  'submit participants registration' : '/register/participants',
  'submit shows registration' : '/register/shows'
};

$.fn.api.settings.successTest = function(response) {
  return response.errcode == '0';
}

// Form Popup
$(".ui.registration.button").click(function(){
    let id = $(this).attr("id");
    $(".registration.form").transition("hide");
$(".registration.form#" + id).transition("drop");
});

$(".close").click(function(){
    let id = $(this).closest(".registration.form").attr("id");
    $(".registration.form#" + id).transition("drop");
});

// Form Load
$("input.amount").each(function(){
    $(this).change(function(){
        let amount = parseInt($(this).val());
        amount = (amount > 10 && amount > 0) ? 10 : amount;
        let type = $(this).attr("id");
        let SingleParticipantForm = $(".hidden.registration.form").filter("."+type).children().first().html();
        let MultipleParticipantsForm = "<div class='field participants hidden'>" + SingleParticipantForm.repeat(amount) + "</div>";
        $(this).closest("div.field").next("div.field.participants").remove();
        $(this).closest("div.field").after(MultipleParticipantsForm);
        $(this).closest("div.field").next("div.field.participants.hidden").transition("drop in");
        // If 1, change the following hidden field to visible
        $("input.decision").change(function(){
            let value = $(this).data("true").includes($(this).val());
            if(value){
                $(this).closest("div.field").nextAll("div.field:first").transition('drop in');
            }
            else{
                $(this).closest("div.field").nextAll("div.field:first").transition('drop out');
            }

        });

        $('.ui.dropdown')
          .dropdown()
        ;
        $(".ui.form").form({
            revalidate: 'true',
            on: 'submit',
            fields:{
                amount: "integer[1..10]",
                showtime: "integer[1..120]",
                showtype: "empty",
                name: "empty",
                gender: "empty",
                tel: "exactLength[11]",
                group: "empty",
                type: "empty",
                email: "email"
            }
        });
        
        // Form Submission

        $(".ui.form.registration.hosts").api({
            action: "submit hosts registration",
            method: "POST",
            serializeForm: true,
            beforeSend: function(settings){
                settings.data.meta.group = settings.data.participants[0].name;
                settings.data.meta.tel = settings.data.participants[0].tel;
                settings.data = JSON.stringify({
                    meta: settings.data.meta,
                    participants: settings.data.participants
                });
                return settings;
            },
            beforeXHR: function(xhr) {
              // adjust XHR with additional headers
              xhr.setRequestHeader ('Content-Type', 'application/json');
              return xhr;
            },
            onRequest: function(promise, xhr) {
                 //$(this).api("set loading");
            },
            onSuccess: function(response, element) {
              // valid response and response.success = true
                $(this).removeClass("success error");
                $(this).addClass("success");
                let msg = $(this).find(".ui.message");
                msg.removeClass("error");
                msg.addClass("success");
                msg.find(".header").text("报名完成");
                msg.find(".list").empty();
                msg.find(".list").append("<li>我们已收到您的主持报名申请，请耐心等候，我们的工作人员将尽快与您取得联系</li>");
                msg.find(".list").append("<li>修改码: " + response.uuid + "</li>");
                msg.find(".list").append("<li>注意: 主持报名和节目报名是独立的</li>");
                msg.transition('vertical flip in');
            },
            onFailure: function(response, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.find(".list").append("<li>已经提交过? 请填写修改码重新提交</li>");
                msg.find(".list").append("<li>从未提交过? 请联系舞会负责人</li>");
                msg.transition('vertical flip in');
            },
            onError: function(errorMessage, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>遭遇未知力量打击</li>");
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.transition('vertical flip in');
            }
        });

        $(".ui.form.registration.shows").api({
            action: "submit shows registration",
            method : 'POST',
            serializeForm: true,
            beforeSend: function(settings){
                let arr = settings.data.participants;
                let masteridx = arr.findIndex(function(currentValue, idx){
                    if(currentValue.master == "yes")
                        return true;
                });
                if (masteridx < 0)
                    $(this).api("abort");
                settings.data.meta.tel = arr[masteridx].tel;
                settings.data.meta.master = arr[masteridx].name;
                settings.data = JSON.stringify({
                    meta: settings.data.meta,
                    participants: settings.data.participants
                })
                return settings;
            },
            beforeXHR: function(xhr) {
              // adjust XHR with additional headers
              xhr.setRequestHeader ('Content-Type', 'application/json');
              return xhr;
            },
            onRequest: function(promise, xhr) {
                //$(this).api("set loading");
            },
            onSuccess: function(response, element) {
              // valid response and response.success = true
                $(this).removeClass("success error");
                $(this).addClass("success");
                let msg = $(this).find(".ui.message");
                msg.removeClass("error");
                msg.addClass("success");
                msg.find(".header").text("报名完成");
                msg.find(".list").empty();
                msg.find(".list").append("<li>我们已收到您的节目报名申请，请耐心等候，我们的工作人员将尽快与您取得联系</li>");
                msg.find(".list").append("<li>修改码: " + response.uuid + "</li>");
                msg.find(".list").append("<li>注意: 舞会报名和节目报名是独立的</li>");
                msg.transition('vertical flip in');
            },
            onFailure: function(response, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.find(".list").append("<li>已经提交过? 请填写修改码重新提交</li>");
                msg.find(".list").append("<li>从未提交过? 请联系舞会负责人</li>");
                msg.transition('vertical flip in');
            },
            onError: function(errorMessage, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>遭遇未知力量打击</li>");
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.transition('vertical flip in');
            }
        });

        $(".ui.form.registration.participants").api({
            action: "submit participants registration",
            method : 'POST',
            serializeForm: true,
            beforeSend: function(settings){
                let arr = settings.data.participants;
                let masteridx = arr.findIndex(function(currentValue, idx){
                    if(currentValue.type == "student")
                        return true;
                });
                settings.data.meta.class = arr[masteridx].class;
                settings.data.meta.tel = arr[masteridx].tel;
                settings.data.meta.group = arr[masteridx].name;
                settings.data = JSON.stringify({
                    meta: settings.data.meta,
                    participants: settings.data.participants
                })
                return settings;
            },
            beforeXHR: function(xhr) {
              // adjust XHR with additional headers
              xhr.setRequestHeader ('Content-Type', 'application/json');
              return xhr;
            },
            onRequest: function(promise, xhr) {
                 //$(this).api("set loading");
            },
            onSuccess: function(response, element) {
              // valid response and response.success = true
                let contact = response.contact;
                //console.log("switch");
                $(this).removeClass("success error");
                $(this).addClass("success");
                let msg = $(this).find(".ui.message");
                //console.log(element);
                msg.removeClass("error");
                msg.addClass("success");
                msg.find(".header").text("报名完成");
                msg.find(".list").empty();
                msg.find(".list").append("<li>我们已经收到了您的报名信息，请于2018年5月13日24:00前联系家委会负责人支付报名费用</li>");
                msg.find(".list").append("<li>总参与人数: " + response.amount + "</li>");
                msg.find(".list").append("<li>需支付金额: " + response.fee + "</li>");
                msg.find(".list").append("<li>收费负责人: "+ contact + "</li>");
                msg.find(".list").append("<li>修改码: " + response.uuid + "</li>");
                msg.transition('vertical flip in');
            },
            onFailure: function(response, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.find(".list").append("<li>已经提交过? 请填写修改码重新提交</li>");
                msg.find(".list").append("<li>从未提交过? 请联系舞会负责人</li>");
                msg.transition('vertical flip in');
            },
            onError: function(errorMessage, element) {
                $(this).removeClass("success error");
                $(this).addClass("error");
                let msg = $(this).find(".ui.message");
                // toggle?
                msg.removeClass("success");
                msg.addClass("error");
                msg.find(".header").text("报名失败");
                msg.find(".list").empty();
                msg.find(".list").append("<li>遭遇未知力量打击</li>");
                msg.find(".list").append("<li>此次表单提交失败</li>");
                msg.transition('vertical flip in');
            }
        });

    });
});

// Form Validate Rules
$(".ui.form").form({
    revalidate: 'true',
    on: 'submit',
    fields:{
        amount: "integer[1..10]",
        name: "empty",
        gender: "empty",
        tel: "exactLength[11]",
        group: "empty",
        type: "empty",
        email: "email",
        showtime: "integer[1..120]",
        showtype: "empty"
    }
});