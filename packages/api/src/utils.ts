export function getAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const getUserIdOrder = (...uuids: string[]) => {
  const [userId1, userId2] = uuids.sort();

  return { userId1, userId2 };
};
