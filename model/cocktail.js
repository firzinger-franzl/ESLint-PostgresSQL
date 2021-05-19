const db = require('../db');

async function getEmployees() {
  const { rows } = await db.query('SELECT * FROM employees');
  return {
    code: 200,
    data: rows,
  };
}

async function getEmployee(id) {
  const { rows } = await db.query('SELECT * FROM employees WHERE employee_id = $1', [id]);
  if (rows.length > 0)
    return {
      code: 200,
      data: rows[0],
    };
  else
    return {
      code: 404,
      data: `the specified employee ${id} was not found in the database`,
    };
}

async function delEmployee(id) {
  const result = await getEmployee(id);
  if (result.code != 200) return result;

  const { rows } = await db.query('SELECT * FROM orders WHERE employee_id = $1', [id]);
  for (const row of rows) {
    await db.query('DELETE FROM order_details WHERE order_id =$1', [row.order_id]);
  }
  await db.query('DELETE FROM orders WHERE employee_id = $1', [id]);
  await db.query('DELETE FROM employees WHERE employee_id = $1', [id]);
  return {
    code: 200,
    data: true,
  };
}

async function patchEmployee(id, data) {
  const result = await getEmployee(id);
  if (result.code != 200) return result;
  let props = [];
  for (const prop in data) props.push(`${prop} = '${data[prop]}'`);
  let cmd = `UPDATE employees SET ${props.join(',')} WHERE employee_id = $1`;
  await db.query(cmd, [id]);

  return {
    code: 200,
    data: true,
  };
}

async function insertEmployee(e) {
  let { rows } = await db.query('SELECT MAX(employee_id) AS max FROM employees');
  let employee_id = rows[0].max + 1;
  await db.query(
    `INSERT INTO employees (employee_id, last_name, first_name, title)
                           VALUES($1,$2,$3,$4)`,
    [employee_id, e.lastName, e.firstName, e.title],
  );
  return {
    code: 200,
    data: employee_id,
  };
}

module.exports = {
  getEmployees,
  getEmployee,
  insertEmployee,
  delEmployee,
  patchEmployee,
};
