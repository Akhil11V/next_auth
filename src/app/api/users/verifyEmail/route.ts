import { connect } from "@/database/dbConfig/dbConfig";
import User from "@/database/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    console.log('token: ', token);

    const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 500 });
    }
    console.log('user: ', user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
