export async function TaskAgent(
  analysis
) {
  const tasks =
    analysis.followUpActions.map(
      (action, index) => ({
        id: index + 1,
        title: action,
        status: "Pending",
      })
    );

  return tasks;
}