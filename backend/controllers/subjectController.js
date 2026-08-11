import Subject from "../models/Subject.js";
import crypto from "crypto";

// =============================
// Create Subject
// =============================
export const createSubject = async (req, res) => {
  try {
    const {
      name,
      description,
      color,
      visibility,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    let inviteCode = null;

    if (visibility === "group") {
      inviteCode = crypto.randomBytes(4).toString("hex");
    }

    const subject = await Subject.create({
      name,
      description,
      color,
      visibility: visibility || "private",
      inviteCode,
      members: [req.user.id],
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get My Subjects
// =============================
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      members: req.user.id,
    })
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Explore Public Subjects
// =============================
export const getPublicSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      visibility: "public",
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Join Group
// =============================
export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({
        success: false,
        message: "Invite code is required",
      });
    }

    const subject = await Subject.findOne({
      inviteCode: inviteCode.trim(),
      visibility: "group",
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    const alreadyMember = subject.members.some(
      (memberId) =>
        memberId.toString() === req.user.id.toString()
    );

    if (!alreadyMember) {
      subject.members.push(req.user.id);
      await subject.save();
    }

    const updatedSubject = await Subject.findById(
      subject._id
    ).populate("members", "name email");

    res.status(200).json({
      success: true,
      message: alreadyMember
        ? "You are already a member of this group"
        : "Joined group successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Leave Group
// =============================
export const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (subject.visibility !== "group") {
      return res.status(400).json({
        success: false,
        message: "This subject is not a group",
      });
    }

    const userId = req.user.id.toString();

    // Group owner cannot leave
    if (subject.user.toString() === userId) {
      return res.status(400).json({
        success: false,
        message:
          "Group owner cannot leave the group. Delete the group instead.",
      });
    }

    const isMember = subject.members.some(
      (memberId) =>
        memberId.toString() === userId
    );

    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this group",
      });
    }

    subject.members = subject.members.filter(
      (memberId) =>
        memberId.toString() !== userId
    );

    await subject.save();

    const updatedSubject = await Subject.findById(
      subject._id
    ).populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "You left the group successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Leave group error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Remove Member
// =============================
export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (subject.visibility !== "group") {
      return res.status(400).json({
        success: false,
        message: "This subject is not a group",
      });
    }

    const currentUserId = req.user.id.toString();

    // Only group owner can remove members
    if (subject.user.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message:
          "Only the group owner can remove members",
      });
    }

    // Owner cannot remove themselves
    if (memberId === currentUserId) {
      return res.status(400).json({
        success: false,
        message:
          "Group owner cannot remove themselves",
      });
    }

    const isMember = subject.members.some(
      (member) =>
        member.toString() === memberId.toString()
    );

    if (!isMember) {
      return res.status(404).json({
        success: false,
        message: "Member is not part of this group",
      });
    }

    subject.members = subject.members.filter(
      (member) =>
        member.toString() !== memberId.toString()
    );

    await subject.save();

    const updatedSubject = await Subject.findById(
      subject._id
    ).populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Remove member error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Subject
// =============================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(
      req.params.id
    ).populate("members", "name email");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Subject
// =============================
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(
      req.params.id
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const oldVisibility = subject.visibility;

    subject.name =
      req.body.name || subject.name;

    subject.description =
      req.body.description ??
      subject.description;

    subject.color =
      req.body.color || subject.color;

    subject.visibility =
      req.body.visibility ||
      subject.visibility;

    // Generate invite code when changing
    // a subject into a group.
    if (
      subject.visibility === "group" &&
      oldVisibility !== "group" &&
      !subject.inviteCode
    ) {
      subject.inviteCode =
        crypto.randomBytes(4).toString("hex");

      if (
        !subject.members.some(
          (memberId) =>
            memberId.toString() ===
            req.user.id.toString()
        )
      ) {
        subject.members.push(req.user.id);
      }
    }

    // Remove invite code if no longer a group.
    if (subject.visibility !== "group") {
      subject.inviteCode = null;
    }

    await subject.save();

    const updatedSubject = await Subject.findById(
      subject._id
    ).populate("members", "name email");

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Subject
// =============================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(
      req.params.id
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};