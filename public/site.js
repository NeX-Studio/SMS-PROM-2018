//Form Submission Entries
$.fn.api.settings.api = {
  'submit hosts registration' : '/register/hosts',
  'submit participants registration' : '/register/participants',
  'submit shows registration' : '/register/shows'
};

// Form Popup
$(".form.ui.tiny.modal").each(function(){
    $(this)
        .modal('setting', 'transition', "vertical flip")
        .modal('setting', 'duration', 600)
        .modal("setting", "blurring", true)
        .modal("setting", "close", "")
        .modal("attach events", ".registration.button#"+$(this).attr("id"), "show")
        .modal({
            selector    : {
              close    : '.close',
              approve  : '.actions .positive, .actions .approve, .actions .ok',
              deny     : '.actions .negative, .actions .deny, .actions .cancel'
            }
        })
});

// Form Load
$("input.amount").each(function(){
    $(this).change(function(){
        let amount = parseInt($(this).val());
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

        })

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
            }
        });

        $(".ui.form.registration.shows").api({
            action: "submit shows registration",
            method : 'POST',
            serializeForm: true,
            defaultData: false,
            beforeSend: function(settings){
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
            }
        });

        $(".ui.form.registration.participants").api({
            action: "submit participants registration",
            method : 'POST',
            serializeForm: true,
            defaultData: false,
            beforeSend: function(settings){
                let arr = settings.data.participants;
                settings.data.meta.group = arr[arr.findIndex(function(currentValue, idx){
                    if(currentValue.type == "student")
                        return true;
                })].name;
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