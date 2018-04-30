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
    });
});

$("a#slideIn").click(function(){
    
})

