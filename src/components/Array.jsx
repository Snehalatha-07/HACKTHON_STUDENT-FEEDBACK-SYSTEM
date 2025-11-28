import React, { useState } from "react";

const Array = () => {
  const [emp, setEmp] = useState([
    { eid: 6620, ename: "gopi", esal: 1000 },
    { eid: 1233, ename: "sandeep", esal: 2000 },
    { eid: 1253, ename: "sudeep", esal: 3000 },
    { eid: 234, ename: "kavya", esal: 4000 },
    { eid: 6589, ename: "vardhan", esal: 5000 }
  ]);

  const [editingRow, setEditingRow] = useState(false);
  const [tempData, setTempData] = useState({ eid: "", ename: "", esal: "" });
  const [deleteMode, setDeleteMode] = useState(false);

  // Add new row (in edit mode)
  const addEmp = () => {
    setEditingRow(true);
    setTempData({ eid: "", ename: "", esal: "" });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  // Save the new employee
  const proceed = () => {
    if (!tempData.eid || !tempData.ename || !tempData.esal) {
      return; // no alerts, just do nothing
    }
    setEmp([
      ...emp,
      { eid: Number(tempData.eid), ename: tempData.ename, esal: Number(tempData.esal) }
    ]);
    setEditingRow(false);
  };

  // Enable delete mode
  const delEmp = () => {
    setDeleteMode(true);
  };

  // Delete specific employee
  const deleteRow = (id) => {
    setEmp(emp.filter((e) => e.eid !== id));
    setDeleteMode(false);
  };

  return (
    <div>
      <h2>Employee Table</h2>
      <table border="1" cellPadding={10} cellSpacing={10}>
        <thead>
          <tr>
            <th>eid</th>
            <th>ename</th>
            <th>esalary</th>
            {deleteMode && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {emp.map((element) => (
            <tr key={element.eid}>
              <td>{element.eid}</td>
              <td>{element.ename}</td>
              <td>{element.esal}</td>
              {deleteMode && (
                <td>
                  <button type="button" onClick={() => deleteRow(element.eid)}>Delete</button>
                </td>
              )}
            </tr>
          ))}

          {/* Row for adding new employee */}
          {editingRow && (
            <tr>
              <td>
                <input
                  type="number"
                  name="eid"
                  placeholder="Enter ID"
                  value={tempData.eid}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ename"
                  placeholder="Enter Name"
                  value={tempData.ename}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="esal"
                  placeholder="Enter Salary"
                  value={tempData.esal}
                  onChange={handleChange}
                />
              </td>
              <td>
                <button type="button" onClick={proceed}>Proceed</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <br />

      <button type="button" onClick={addEmp} disabled={editingRow}>
        Add emp
      </button>
      <button type="button" onClick={delEmp} disabled={deleteMode}>
        Del emp
      </button>
    </div>
  );
};

export default Array;
