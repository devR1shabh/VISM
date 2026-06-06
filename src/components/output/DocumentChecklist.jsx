function DocumentChecklist({ documents }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-3">
        Required Documents
      </h2>

      <ul className="list-disc ml-5">
        {documents.map((doc) => (
          <li key={doc}>{doc}</li>
        ))}
      </ul>

    </div>
  );
}

export default DocumentChecklist;