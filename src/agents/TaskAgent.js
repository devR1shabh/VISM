export async function TaskAgent(
  analysis
) {
  const tasks = [];

  const documents =
    analysis.documents || [];

  let id = 1;

  documents.forEach((document) => {
    tasks.push({
      id: id++,
      title: `Upload ${document}`,
      category:
        "Document Collection",
      priority: "High",
      status: "Pending",
    });
  });

  tasks.push({
    id: id++,
    title:
      "Verify Uploaded Documents",
    category:
      "Document Verification",
    priority: "High",
    status: "Pending",
  });

  tasks.push({
    id: id++,
    title:
      "Prepare Visa Application Package",
    category:
      "Application Preparation",
    priority: "Medium",
    status: "Pending",
  });

  tasks.push({
    id: id++,
    title:
      "Review Compliance Requirements",
    category:
      "Compliance Review",
    priority: "Medium",
    status: "Pending",
  });

  tasks.push({
    id: id++,
    title:
      "Submit Application",
    category:
      "Submission",
    priority: "High",
    status: "Pending",
  });

  return tasks;
}