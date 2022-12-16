const delay = async (delayBy: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayBy));
};
export default delay;
