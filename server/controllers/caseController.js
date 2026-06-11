import Case from "../models/Case.js";

export async function createCase(
  req,
  res
) {
  try {
    const newCase =
      await Case.create(
        req.body
      );

    res.status(201).json(
      newCase
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to create case",
    });
  }
}

export async function getCase(
  req,
  res
) {
  try {
    const foundCase =
      await Case.findById(
        req.params.id
      );

    if (!foundCase) {
      return res
        .status(404)
        .json({
          error:
            "Case not found",
        });
    }

    res.json(foundCase);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to fetch case",
    });
  }
}

export async function updateCase(
  req,
  res
) {
  try {
    const updatedCase =
      await Case.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedCase);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to update case",
    });
  }
}

export async function addVerifiedDocument(
  req,
  res
) {
  try {
    const {
      documentType,
    } = req.body;

    const caseId = req.params.id;
    const uploadedAt = new Date();

    let updatedCase =
      await Case.findOneAndUpdate(
        {
          _id: caseId,
          "uploadedDocuments.type": documentType,
        },
        {
          $set: {
            "uploadedDocuments.$.verified": true,
            "uploadedDocuments.$.uploadedAt": uploadedAt,
          },
        },
        { new: true }
      );

    if (!updatedCase) {
      updatedCase =
        await Case.findByIdAndUpdate(
          caseId,
          {
            $push: {
              uploadedDocuments: {
                type: documentType,
                verified: true,
                uploadedAt,
              },
            },
          },
          { new: true }
        );
    }

    res.json(updatedCase);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Failed to save document",
    });
  }
}