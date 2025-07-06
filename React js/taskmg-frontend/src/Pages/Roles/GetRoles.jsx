import React, { useEffect, useState } from 'react';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://localhost:7299/all');
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data.value); // because your controller returns `Ok(result)`
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">Roles List</h2>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left border-b">Role ID</th>
                <th className="px-4 py-2 text-left border-b">Role Name</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{role.id}</td>
                  <td className="px-4 py-2">{role.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RoleList;
