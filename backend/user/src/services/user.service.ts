import { User, type IUser } from "../model/User.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";
import { NotFoundError } from "../errors/customErrors.js";

export class UserService {
  public static async findOrCreateUser(
    email: string,
  ): Promise<{ user: IUser; accessToken: string }> {
    let currentUser = await User.findOne({ email });

    if (!currentUser) {
      const username = email.split("@")[0] || email;
      currentUser = await User.create({
        name: username,
        email,
      });
    }

    const accessToken = generateAccessToken(currentUser);

    return { user: currentUser, accessToken };
  }

  public static async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
