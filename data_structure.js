// POST https://prom.thexyzlab.tech/register
var Participants = {
    "meta": {
        // Randomly Generated, will be sent to the student phone number for updating info
        // If the group existed with different uuid, this post will be considered unauthorized 
        "uuid": "", 
        "group": "", // Student name, for grouping student, parents, and children from same family
        // Participants, Hosts, or Shows; Auto Generated
        "type": "",

        // PromShowPerformers Only
        "showtime": 0,
        "showtype": "",
        "note": ""

    },
    "participants": [
        {
            "name": "",
            "gender": "",
            "tel": "",

            // Prom Participants Only Options
            // Empty string for partner indicates that he/she is not in the international curriculum; thus whose fee must also pay by the student
            "class": "",
            "type": "", // Student, Parent, Child, and Partner
            "avoidance": "",

            // Hosts Only Options
            "class": "",

            // PromShowPerformers Only Options
            "master": false, // Do you in charge of this?
            "email": ""
        }
    ]
};