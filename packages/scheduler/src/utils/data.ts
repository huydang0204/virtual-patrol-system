
export const getNxWitnessDeviceId = (id : string) : string => {
  return id.replace("{", "").replace("}", "");
};

export const getTimeOfADayText = (time : number) : string => {
  if (time == undefined) return "";

  if (time == 0) return "Midnight";

  if (time < 3600 * 5) return "Night";

  if (time < 3600 * 12) return "Morning";

  if (time < 3600 * 17) return "Afternoon";

  if (time < 3600 * 21) return "Evening";

  return "Night";
};