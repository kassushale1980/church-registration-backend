import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/email.js";

// 📁 data file path
const filePath = path.resolve("data/members.json");

// 📖 Read members safely
const readMembers = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
};

// ✍️ Write members
const writeMembers = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};


// GET all members
export const getMembers = (req, res) => {
  const members = readMembers();
  res.json(members);
};


// GET one member
export const getMemberById = (req, res) => {
  const members = readMembers();

  const member = members.find(
    (m) => m.id == req.params.id
  );

  if (!member) {
    return res.status(404).json({
      message: "Member not found",
    });
  }

  res.json(member);
};


// CREATE member + EMAIL
export const createMember = async (req, res) => {

  try {

    const members = readMembers();


    const newMember = {
      id: members.length
        ? members[members.length - 1].id + 1
        : 1,

      ...req.body,
    };


    // Save member
    members.push(newMember);

    writeMembers(members);



    // Send email notification
    try {

      await sendEmail(
        newMember.email,
        "Sunday School Registration Successful",
        `Hello ${newMember.firstName},

Your Sunday School registration has been received successfully.

Thank you!

Ethiopian Orthodox Tewahedo Church
Sunday School Ministry`
      );


      console.log("Email sent successfully");


    } catch (emailError) {

      // Email failure should not stop registration
      console.error(
        "Email failed:",
        emailError.message
      );

    }



    res.status(201).json({

      success: true,

      message: "Registration completed successfully.",

      member: newMember,

    });



  } catch (error) {


    console.error(
      "Create member error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Server error",

    });


  }

};



// UPDATE member
export const updateMember = (req, res) => {

  const members = readMembers();

  const id = Number(req.params.id);


  const index = members.findIndex(
    (m) => m.id === id
  );


  if (index === -1) {

    return res.status(404).json({

      message: "Member not found",

    });

  }


  members[index] = {
    ...members[index],
    ...req.body,
  };


  writeMembers(members);


  res.json({

    message: "Member updated successfully",

    member: members[index],

  });

};



// DELETE member
export const deleteMember = (req, res) => {

  const members = readMembers();

  const id = Number(req.params.id);


  const filtered = members.filter(
    (m) => m.id !== id
  );


  if (filtered.length === members.length) {

    return res.status(404).json({

      message: "Member not found",

    });

  }


  writeMembers(filtered);


  res.json({

    message: "Member deleted successfully",

  });

};