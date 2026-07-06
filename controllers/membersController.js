import fs from "fs";
import path from "path";
import { sendEmail } from "../utils/email.js";

// 📁 data file path
const filePath = path.resolve("data/members.json");

// 📖 read members safely
const readMembers = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
};

// ✍️ write members
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
  const member = members.find((m) => m.id == req.params.id);

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(member);
};

// CREATE member + EMAIL 📧
export const createMember = async (req, res) => {
  try {
    const members = readMembers();

    const newMember = {
      id: members.length ? members[members.length - 1].id + 1 : 1,
      ...req.body,
    };

    members.push(newMember);
    writeMembers(members);

    // 📧 SEND EMAIL
    await sendEmail(
      req.body.email,
      "Sunday School Registration Successful",
      `Hello ${req.body.firstName}, your registration was successful.`
    );

    res.status(201).json({
      message: "Member created successfully",
      member: newMember,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE member
export const updateMember = (req, res) => {
  const members = readMembers();
  const id = Number(req.params.id);

  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Member not found" });
  }

  members[index] = { ...members[index], ...req.body };
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

  const filtered = members.filter((m) => m.id !== id);

  if (filtered.length === members.length) {
    return res.status(404).json({ message: "Member not found" });
  }

  writeMembers(filtered);

  res.json({ message: "Member deleted successfully" });
};