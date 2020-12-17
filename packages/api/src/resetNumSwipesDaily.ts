import { CronJob } from "cron";
import { User } from "./entities/User";

export const resetNumSwipesDaily = () => {
  // every minute
  new CronJob(
    "0 1 * * * *",
    async () => {
      try {
        await User.update({}, { numSwipesToday: 0 });
      } catch (err) {
        console.log("error resetNumSwipesDaily ", err);
      }
    },
    null,
    true,
    "America/Chicago"
  );
};
