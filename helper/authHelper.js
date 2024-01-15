import bcrypt from "bcrypt";
export const hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const comparedPassword = bcrypt.compare(password, hashedPassword);
    return comparedPassword;
  } catch (error) {
    console.log(error);
  }
};
