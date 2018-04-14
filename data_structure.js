// POST https://prom.thexyzlab.tech/register
var info = [
    {
        "name": "",
        "gender": "",
        "type": "", // Student, Parent, Child, and Partner
        "group": "", // Enter student name, for grouping student, parents, and children from same family
        // Randomly Generated, will be sent to the student phone number for updating info
        // If the group existed with different uuid, this post will be considered unauthorized 
        "uuid": "", 
        "tel": "",
        "avoidance": "",
        // Student and Partner Only Options
        // Empty string for partner indicates that he/she is not in the international curriculum; thus whose fee must also pay by the student
        "class": ""
    }
]